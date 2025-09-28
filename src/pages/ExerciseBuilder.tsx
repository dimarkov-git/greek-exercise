import {motion} from 'framer-motion'
import type {ChangeEvent} from 'react'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {Link} from 'react-router'
import {type BaseIssue, safeParse} from 'valibot'
import {Head} from '@/components/Head'
import {TableView} from '@/components/learn/TableView'
import {toWordFormExerciseWithDefaults} from '@/domain/exercises/adapters'
import type {WordFormExerciseWithDefaults} from '@/domain/exercises/types'
import {useTranslations} from '@/hooks/useTranslations'
import type {ExerciseBuilderTranslationKey} from '@/i18n/dictionaries'
import {exerciseBuilderTranslations} from '@/i18n/dictionaries'
import type {Translator} from '@/i18n/dictionary'
import {WordFormExerciseSchema} from '@/schemas/exercises'
import type {CustomExerciseRecord} from '@/stores/customExercises'
import {
	selectCustomExerciseList,
	useCustomExercisesStore
} from '@/stores/customExercises'
import {exerciseToJSON, type WordFormExerciseJSON} from '@/types/exercises'

type RawValidationError =
	| {kind: 'empty'}
	| {kind: 'parse'; message: string}
	| {kind: 'schema'; message: string}

interface RawValidationState {
	readonly exercise: WordFormExerciseWithDefaults | null
	readonly errors: readonly RawValidationError[]
}

interface ValidationState {
	readonly exercise: WordFormExerciseWithDefaults | null
	readonly rawErrors: readonly RawValidationError[]
	readonly errors: readonly string[]
}

const DEFAULT_WORD_FORM_TEMPLATE: WordFormExerciseJSON = {
	enabled: true,
	id: 'custom-verb-eimai',
	type: 'word-form',
	language: 'el',
	title: 'Ρήμα είμαι — ενεστώτας',
	titleI18n: {
		en: "Verb 'to be' — present",
		ru: 'Глагол «быть» — настоящее время'
	},
	description: 'Πρακτική για την κλίση του ρήματος είμαι στον ενεστώτα',
	descriptionI18n: {
		en: "Practice the conjugation of 'to be' in the present tense",
		ru: 'Практика спряжения глагола «быть» в настоящем времени'
	},
	tags: ['custom', 'verbs', 'present'],
	difficulty: 'a1',
	estimatedTimeMinutes: 6,
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1500,
		allowSkip: false,
		shuffleCases: false
	},
	blocks: [
		{
			id: 'present-tense',
			name: 'είμαι — Ενεστώτας',
			nameHintI18n: {
				en: 'to be — Present',
				ru: 'глагол быть — Настоящее'
			},
			cases: [
				{
					id: 'present-1s',
					prompt: 'εγώ ___',
					promptHintI18n: {
						en: 'I am',
						ru: 'я есть'
					},
					correct: ['είμαι']
				},
				{
					id: 'present-2s',
					prompt: 'εσύ ___',
					promptHintI18n: {
						en: 'you are',
						ru: 'ты есть'
					},
					correct: ['είσαι'],
					hint: 'εί___'
				},
				{
					id: 'present-3s',
					prompt: 'αυτός ___',
					promptHintI18n: {
						en: 'he is',
						ru: 'он есть'
					},
					correct: ['είναι']
				}
			]
		}
	]
}

const DEFAULT_TEMPLATE_JSON = JSON.stringify(
	DEFAULT_WORD_FORM_TEMPLATE,
	null,
	2
)

const EXERCISE_SCHEMA_DOC_URL =
	'https://github.com/learn-greek/greek-exercise/blob/main/docs/exercise-json-format.md'

function formatIssue(issue: BaseIssue<unknown>): string {
	const path = issue.path

	if (!path || path.length === 0) {
		return issue.message ?? 'Invalid value'
	}

	const parts = path
		.map(part => {
			if (typeof part.key === 'number') {
				return `[${part.key}]`
			}

			if (typeof part.key === 'string') {
				return part.key
			}

			return ''
		})
		.filter(Boolean)
		.join('.')

	const label = parts.length > 0 ? `${parts}: ` : ''

	return `${label}${issue.message ?? 'Invalid value'}`
}

function validateExerciseJson(json: string): RawValidationState {
	if (json.trim().length === 0) {
		return {exercise: null, errors: [{kind: 'empty'}]}
	}

	try {
		const parsed = JSON.parse(json)
		const result = safeParse(WordFormExerciseSchema, parsed)

		if (!result.success) {
			const errors = result.issues.map(
				issue =>
					({
						kind: 'schema',
						message: formatIssue(issue)
					}) as RawValidationError
			)
			return {exercise: null, errors}
		}

		const normalized = toWordFormExerciseWithDefaults(result.output)
		return {exercise: normalized, errors: []}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Unknown JSON parse error'
		return {
			exercise: null,
			errors: [
				{
					kind: 'parse',
					message
				}
			]
		}
	}
}

const INITIAL_RAW_VALIDATION = validateExerciseJson(DEFAULT_TEMPLATE_JSON)

function areArraysEqual(
	left: readonly string[],
	right: readonly string[]
): boolean {
	if (left === right) {
		return true
	}

	if (left.length !== right.length) {
		return false
	}

	return left.every((value, index) => value === right[index])
}

type BuilderTranslator = Translator<ExerciseBuilderTranslationKey>

interface ExerciseValidationResult {
	readonly selectedType: 'word-form'
	readonly jsonValue: string
	readonly validation: ValidationState
	readonly previewExercise: WordFormExerciseWithDefaults | null
	readonly hasErrors: boolean
	readonly handleTypeChange: (type: 'word-form') => void
	readonly handleJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
	readonly handleResetTemplate: () => void
	readonly handleFormatJson: () => void
	readonly loadExerciseJson: (exercise: WordFormExerciseJSON) => void
}

interface ExercisePersistenceResult {
	readonly saveStatus: 'idle' | 'success' | 'error'
	readonly savedExercises: readonly CustomExerciseRecord[]
	readonly handleSaveExercise: () => void
	readonly handleLoadExercise: (exercise: WordFormExerciseJSON) => void
	readonly handleDeleteExercise: (id: string) => void
}

function useFormatErrors(t: BuilderTranslator) {
	return useCallback(
		(errors: readonly RawValidationError[]): string[] =>
			errors.map(error => {
				if (error.kind === 'empty') {
					return t('builder.validationEmpty')
				}

				if (error.kind === 'parse') {
					return t('builder.parseError').replace('{message}', error.message)
				}

				if (error.kind === 'schema') {
					return error.message
				}

				return t('builder.validationUnknown')
			}),
		[t]
	)
}

function useValidationState(
	formatErrors: (errors: readonly RawValidationError[]) => string[]
) {
	const [validation, setValidation] = useState<ValidationState>(() => ({
		exercise: INITIAL_RAW_VALIDATION.exercise,
		rawErrors: INITIAL_RAW_VALIDATION.errors,
		errors: formatErrors(INITIAL_RAW_VALIDATION.errors)
	}))

	const applyValidation = useCallback(
		(value: string) => {
			const nextValidation = validateExerciseJson(value)
			setValidation({
				exercise: nextValidation.exercise,
				rawErrors: nextValidation.errors,
				errors: formatErrors(nextValidation.errors)
			})
		},
		[formatErrors]
	)

	return {validation, applyValidation, setValidation}
}

function useValidationSync(
	formatErrors: (errors: readonly RawValidationError[]) => string[],
	setValidation: (
		updater: (current: ValidationState) => ValidationState
	) => void
) {
	useEffect(() => {
		setValidation(current => {
			const formatted = formatErrors(current.rawErrors)

			if (areArraysEqual(current.errors, formatted)) {
				return current
			}

			return {
				...current,
				errors: formatted
			}
		})
	}, [formatErrors, setValidation])
}

function useBuilderJsonControls(applyValidation: (value: string) => void) {
	const [selectedType, setSelectedType] = useState<'word-form'>('word-form')
	const [jsonValue, setJsonValue] = useState(DEFAULT_TEMPLATE_JSON)

	const setAndValidate = useCallback(
		(value: string) => {
			setJsonValue(value)
			applyValidation(value)
		},
		[applyValidation]
	)

	const handleTypeChange = useCallback(
		(type: 'word-form') => {
			setSelectedType(type)
			setAndValidate(DEFAULT_TEMPLATE_JSON)
		},
		[setAndValidate]
	)

	const handleJsonChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setAndValidate(event.target.value)
		},
		[setAndValidate]
	)

	const handleResetTemplate = useCallback(() => {
		setAndValidate(DEFAULT_TEMPLATE_JSON)
	}, [setAndValidate])

	return {
		selectedType,
		jsonValue,
		handleTypeChange,
		handleJsonChange,
		handleResetTemplate,
		setJsonValueDirect: setAndValidate
	}
}

function useExerciseValidation(t: BuilderTranslator): ExerciseValidationResult {
	const formatErrors = useFormatErrors(t)
	const {validation, applyValidation, setValidation} =
		useValidationState(formatErrors)
	const {
		selectedType,
		jsonValue,
		handleTypeChange,
		handleJsonChange,
		handleResetTemplate,
		setJsonValueDirect
	} = useBuilderJsonControls(applyValidation)

	useValidationSync(formatErrors, setValidation)

	const previewExercise = validation.exercise
	const hasErrors = validation.rawErrors.length > 0 || !previewExercise

	const handleFormatJson = useCallback(() => {
		if (!previewExercise) {
			applyValidation(jsonValue)
			return
		}

		const formatted = JSON.stringify(exerciseToJSON(previewExercise), null, 2)
		setJsonValueDirect(formatted)
	}, [applyValidation, jsonValue, previewExercise, setJsonValueDirect])

	const loadExerciseJson = useCallback(
		(exercise: WordFormExerciseJSON) => {
			const serialized = JSON.stringify(exercise, null, 2)
			setJsonValueDirect(serialized)
		},
		[setJsonValueDirect]
	)

	return {
		selectedType,
		jsonValue,
		validation,
		previewExercise,
		hasErrors,
		handleTypeChange,
		handleJsonChange,
		handleResetTemplate,
		handleFormatJson,
		loadExerciseJson
	}
}

function useExercisePersistence(
	previewExercise: WordFormExerciseWithDefaults | null,
	loadExerciseJson: (exercise: WordFormExerciseJSON) => void
): ExercisePersistenceResult {
	const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
		'idle'
	)
	const saveExercise = useCustomExercisesStore(state => state.saveExercise)
	const deleteExercise = useCustomExercisesStore(state => state.deleteExercise)
	const savedExercises = useCustomExercisesStore(selectCustomExerciseList)

	const handleSaveExercise = useCallback(() => {
		if (!previewExercise) {
			setSaveStatus('error')
			return
		}

		try {
			const serialized = exerciseToJSON(previewExercise)
			saveExercise(serialized)
			setSaveStatus('success')
		} catch {
			setSaveStatus('error')
		}
	}, [previewExercise, saveExercise])

	const handleLoadExercise = useCallback(
		(exercise: WordFormExerciseJSON) => {
			loadExerciseJson(exercise)
		},
		[loadExerciseJson]
	)

	const handleDeleteExercise = useCallback(
		(id: string) => {
			deleteExercise(id)
		},
		[deleteExercise]
	)

	useEffect(() => {
		if (saveStatus === 'idle') {
			return
		}

		const timeout = window.setTimeout(() => setSaveStatus('idle'), 3200)
		return () => window.clearTimeout(timeout)
	}, [saveStatus])

	return {
		saveStatus,
		savedExercises,
		handleSaveExercise,
		handleLoadExercise,
		handleDeleteExercise
	}
}

interface ExerciseBuilderState {
	readonly selectedType: 'word-form'
	readonly jsonValue: string
	readonly validation: ValidationState
	readonly saveStatus: 'idle' | 'success' | 'error'
	readonly savedExercises: readonly CustomExerciseRecord[]
	readonly previewExercise: WordFormExerciseWithDefaults | null
	readonly hasErrors: boolean
	readonly handleTypeChange: (type: 'word-form') => void
	readonly handleJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
	readonly handleReset: () => void
	readonly handleFormat: () => void
	readonly handleSave: () => void
	readonly handleLoadSaved: (exercise: WordFormExerciseJSON) => void
	readonly handleDeleteSaved: (id: string) => void
}

function useExerciseBuilderState(t: BuilderTranslator): ExerciseBuilderState {
	const {
		selectedType,
		jsonValue,
		validation,
		previewExercise,
		hasErrors,
		handleTypeChange,
		handleJsonChange,
		handleResetTemplate,
		handleFormatJson,
		loadExerciseJson
	} = useExerciseValidation(t)

	const {
		saveStatus,
		savedExercises,
		handleSaveExercise,
		handleLoadExercise,
		handleDeleteExercise
	} = useExercisePersistence(previewExercise, loadExerciseJson)

	return {
		selectedType,
		jsonValue,
		validation,
		saveStatus,
		savedExercises,
		previewExercise,
		hasErrors,
		handleTypeChange,
		handleJsonChange,
		handleReset: handleResetTemplate,
		handleFormat: handleFormatJson,
		handleSave: handleSaveExercise,
		handleLoadSaved: handleLoadExercise,
		handleDeleteSaved: handleDeleteExercise
	}
}

function useFormattedSavedExercises(
	savedExercises: readonly CustomExerciseRecord[]
) {
	return useMemo(
		() =>
			savedExercises.map(record => ({
				...record,
				formattedDate: new Date(record.updatedAt).toLocaleString()
			})),
		[savedExercises]
	)
}

export function ExerciseBuilder() {
	const {t} = useTranslations(exerciseBuilderTranslations)
	const {
		selectedType,
		jsonValue,
		validation,
		saveStatus,
		savedExercises,
		previewExercise,
		hasErrors,
		handleTypeChange,
		handleJsonChange,
		handleReset,
		handleFormat,
		handleSave,
		handleLoadSaved,
		handleDeleteSaved
	} = useExerciseBuilderState(t)

	const formattedSavedExercises = useFormattedSavedExercises(savedExercises)

	return (
		<>
			<Head title={t('exerciseBuilder')} />
			<motion.div
				animate={{opacity: 1}}
				className='min-h-screen bg-gray-50 pb-16 dark:bg-gray-950'
				initial={{opacity: 0}}
			>
				<div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
					<BuilderHero t={t} />
					<div className='mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'>
						<section className='space-y-6'>
							<TypeSelectorPanel
								onTypeChange={handleTypeChange}
								selectedType={selectedType}
								t={t}
							/>
							<JsonEditorPanel
								hasErrors={hasErrors}
								jsonValue={jsonValue}
								onFormat={handleFormat}
								onJsonChange={handleJsonChange}
								onReset={handleReset}
								onSave={handleSave}
								saveStatus={saveStatus}
								t={t}
							/>
							<ValidationPanel
								hasErrors={hasErrors}
								t={t}
								validationErrors={validation.errors}
							/>
							<PreviewPanel previewExercise={previewExercise} t={t} />
							<SavedExercisesSection
								formattedSavedExercises={formattedSavedExercises}
								onDelete={handleDeleteSaved}
								onLoad={handleLoadSaved}
								t={t}
							/>
						</section>
					</div>
				</div>
			</motion.div>
		</>
	)
}

interface BuilderHeroProps {
	readonly t: BuilderTranslator
}

function BuilderHero({t}: BuilderHeroProps) {
	return (
		<motion.header
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 p-10 text-white shadow-2xl'
			initial={{opacity: 0, y: 20}}
			transition={{duration: 0.6}}
		>
			<div className='flex flex-wrap items-start justify-between gap-6'>
				<div className='max-w-3xl'>
					<div className='text-6xl'>{t('ui.toolsEmoji')}</div>
					<h1 className='mt-6 font-bold text-3xl sm:text-4xl md:text-5xl'>
						{t('exerciseBuilder')}
					</h1>
					<p className='mt-4 text-lg text-white/80'>
						{t('exerciseBuilderDesc')}
					</p>
					<p className='mt-6 text-sm text-white/70 sm:text-base'>
						{t('builder.libraryInfo')}
					</p>
				</div>
				<div className='flex flex-col gap-3 text-sm sm:flex-row sm:text-base'>
					<a
						className='inline-flex items-center justify-center rounded-full bg-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/25'
						href={EXERCISE_SCHEMA_DOC_URL}
						rel='noopener noreferrer'
						target='_blank'
					>
						{t('builder.viewSchema')}
					</a>
					<Link
						className='inline-flex items-center justify-center rounded-full bg-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/25'
						to='/exercises'
					>
						{t('builder.openLibrary')}
					</Link>
					<Link
						className='inline-flex items-center justify-center rounded-full bg-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/25'
						to='/'
					>
						{t('ui.backToHome')}
					</Link>
				</div>
			</div>
		</motion.header>
	)
}

interface TypeSelectorPanelProps {
	readonly selectedType: 'word-form'
	readonly onTypeChange: (type: 'word-form') => void
	readonly t: BuilderTranslator
}

function TypeSelectorPanel({
	selectedType,
	onTypeChange,
	t
}: TypeSelectorPanelProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.1, duration: 0.4}}
		>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
						{t('builder.typeSectionTitle')}
					</h2>
					<p className='text-gray-600 text-sm dark:text-gray-400'>
						{t('builder.typeHelp')}
					</p>
				</div>
				<select
					className='rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
					onChange={event => onTypeChange(event.target.value as 'word-form')}
					value={selectedType}
				>
					<option value='word-form'>{t('builder.wordFormType')}</option>
				</select>
			</div>
			<p className='mt-4 rounded-xl bg-purple-50 p-4 text-purple-900 text-sm dark:bg-purple-900/20 dark:text-purple-200'>
				{t('builder.jsonEditorHelp')}
			</p>
		</motion.div>
	)
}

interface JsonEditorPanelProps {
	readonly jsonValue: string
	readonly hasErrors: boolean
	readonly saveStatus: 'idle' | 'success' | 'error'
	readonly onJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
	readonly onReset: () => void
	readonly onFormat: () => void
	readonly onSave: () => void
	readonly t: BuilderTranslator
}

function JsonEditorPanel({
	jsonValue,
	hasErrors,
	saveStatus,
	onJsonChange,
	onReset,
	onFormat,
	onSave,
	t
}: JsonEditorPanelProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.15, duration: 0.4}}
		>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
					{t('builder.jsonEditorTitle')}
				</h2>
				<div className='flex flex-wrap gap-2'>
					<button
						className='rounded-full border border-purple-500 px-4 py-2 font-medium text-purple-600 text-sm transition hover:bg-purple-50 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-900/30'
						onClick={onFormat}
						type='button'
					>
						{t('builder.formatJson')}
					</button>
					<button
						className='rounded-full border border-gray-300 px-4 py-2 font-medium text-gray-600 text-sm transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
						onClick={onReset}
						type='button'
					>
						{t('builder.resetTemplate')}
					</button>
				</div>
			</div>
			<textarea
				aria-label={t('builder.jsonEditorTitle')}
				className='resize-vertical mt-4 h-[480px] w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-gray-800 text-sm leading-6 shadow-inner focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100'
				onChange={onJsonChange}
				spellCheck={false}
				value={jsonValue}
			/>
			<div className='mt-4 flex flex-wrap items-center gap-3'>
				<button
					className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2 font-semibold text-sm text-white shadow-lg transition hover:from-purple-600 hover:to-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'
					disabled={hasErrors}
					onClick={onSave}
					type='button'
				>
					{t('builder.saveToLibrary')}
				</button>
				{saveStatus === 'success' && (
					<span className='text-green-600 text-sm dark:text-green-400'>
						{t('builder.saveSuccess')}
					</span>
				)}
				{saveStatus === 'error' && (
					<span className='text-red-600 text-sm dark:text-red-400'>
						{t('builder.saveError')}
					</span>
				)}
			</div>
		</motion.div>
	)
}

interface ValidationPanelProps {
	readonly hasErrors: boolean
	readonly validationErrors: readonly string[]
	readonly t: BuilderTranslator
}

function ValidationPanel({
	hasErrors,
	validationErrors,
	t
}: ValidationPanelProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.2, duration: 0.4}}
		>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
					{t('builder.validationTitle')}
				</h2>
				<span
					className={`inline-flex items-center rounded-full px-3 py-1 font-semibold text-xs uppercase tracking-wide ${
						hasErrors
							? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
							: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
					}`}
				>
					{hasErrors
						? t('builder.validationError')
						: t('builder.validationSuccess')}
				</span>
			</div>
			{hasErrors ? (
				<ul className='mt-4 space-y-2 text-red-600 text-sm dark:text-red-300'>
					{validationErrors.map(error => (
						<li key={error}>{error}</li>
					))}
				</ul>
			) : (
				<p className='mt-4 rounded-xl bg-emerald-50 p-4 text-emerald-700 text-sm dark:bg-emerald-900/20 dark:text-emerald-300'>
					{t('builder.validationHint')}
				</p>
			)}
		</motion.div>
	)
}

interface PreviewPanelProps {
	readonly previewExercise: WordFormExerciseWithDefaults | null
	readonly t: BuilderTranslator
}

function PreviewPanel({previewExercise, t}: PreviewPanelProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.25, duration: 0.4}}
		>
			<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
				{t('builder.previewTitle')}
			</h2>
			{previewExercise ? (
				<div className='mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800'>
					<TableView exercise={previewExercise} />
				</div>
			) : (
				<div className='mt-4 rounded-2xl border border-gray-300 border-dashed bg-gray-50 p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400'>
					<p className='font-medium'>{t('builder.previewUnavailable')}</p>
					<p className='mt-2 text-sm'>{t('builder.previewUnavailableHint')}</p>
				</div>
			)}
		</motion.div>
	)
}

interface SavedExercisesSectionProps {
	readonly formattedSavedExercises: readonly (CustomExerciseRecord & {
		formattedDate: string
	})[]
	readonly onLoad: (exercise: WordFormExerciseJSON) => void
	readonly onDelete: (id: string) => void
	readonly t: BuilderTranslator
}

function SavedExercisesSection({
	formattedSavedExercises,
	onLoad,
	onDelete,
	t
}: SavedExercisesSectionProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.3, duration: 0.4}}
		>
			<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
				{t('builder.savedExercisesTitle')}
			</h2>
			{formattedSavedExercises.length === 0 ? (
				<p className='mt-4 rounded-xl bg-gray-50 p-4 text-gray-600 text-sm dark:bg-gray-800/40 dark:text-gray-300'>
					{t('builder.noSavedExercises')}
				</p>
			) : (
				<ul className='mt-4 space-y-4'>
					{formattedSavedExercises.map(record => (
						<SavedExerciseCard
							key={record.exercise.id}
							onDelete={onDelete}
							onLoad={onLoad}
							record={record}
							t={t}
						/>
					))}
				</ul>
			)}
		</motion.div>
	)
}

interface SavedExerciseCardProps {
	readonly record: CustomExerciseRecord & {formattedDate: string}
	readonly onLoad: (exercise: WordFormExerciseJSON) => void
	readonly onDelete: (id: string) => void
	readonly t: BuilderTranslator
}

function SavedExerciseCard({
	record,
	onLoad,
	onDelete,
	t
}: SavedExerciseCardProps) {
	const tags = record.exercise.tags ?? []

	return (
		<li className='rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900'>
			<div className='flex flex-wrap items-start justify-between gap-3'>
				<div>
					<h3 className='font-semibold text-gray-900 dark:text-white'>
						{record.exercise.title}
					</h3>
					<p className='text-gray-600 text-sm dark:text-gray-400'>
						{record.exercise.description}
					</p>
					<p className='mt-2 text-gray-500 text-xs dark:text-gray-500'>
						{t('builder.lastUpdated').replace('{date}', record.formattedDate)}
					</p>
				</div>
				<div className='flex flex-wrap gap-2'>
					<button
						className='rounded-full bg-blue-600 px-4 py-2 font-medium text-sm text-white transition hover:bg-blue-700'
						onClick={() => onLoad(record.exercise)}
						type='button'
					>
						{t('builder.loadButton')}
					</button>
					<button
						className='rounded-full border border-red-500 px-4 py-2 font-medium text-red-600 text-sm transition hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-900/30'
						onClick={() => onDelete(record.exercise.id)}
						type='button'
					>
						{t('builder.deleteButton')}
					</button>
				</div>
			</div>
			<div className='mt-3 flex flex-wrap gap-2 text-xs'>
				{tags.map(tag => (
					<span
						className='rounded-full bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
						key={tag}
					>
						{t('ui.hashSymbol')}
						{tag}
					</span>
				))}
			</div>
		</li>
	)
}
