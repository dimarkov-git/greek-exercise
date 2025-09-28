import type {ChangeEvent} from 'react'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {type BaseIssue, safeParse} from 'valibot'
import type {WordFormExerciseWithDefaults} from '@/entities/exercise'
import {
	exerciseToJSON,
	toWordFormExerciseWithDefaults,
	type WordFormExerciseJSON
} from '@/entities/exercise'
import {WordFormExerciseSchema} from '@/schemas/exercises'
import type {ExerciseBuilderTranslationKey} from '@/shared/lib/i18n/dictionaries'
import type {Translator} from '@/shared/lib/i18n/dictionary'
import type {CustomExerciseRecord} from '@/shared/model'
import {selectCustomExerciseList, useCustomExercisesStore} from '@/shared/model'

export type BuilderTranslator = Translator<ExerciseBuilderTranslationKey>
export type BuilderSaveStatus = 'idle' | 'success' | 'error'

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

type RawValidationError =
	| {kind: 'empty'}
	| {kind: 'parse'; message: string}
	| {kind: 'schema'; message: string}

interface RawValidationState {
	readonly exercise: WordFormExerciseWithDefaults | null
	readonly errors: readonly RawValidationError[]
}

export interface ValidationState {
	readonly exercise: WordFormExerciseWithDefaults | null
	readonly rawErrors: readonly RawValidationError[]
	readonly errors: readonly string[]
}

export interface ExerciseValidationResult {
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

export interface ExercisePersistenceResult {
	readonly saveStatus: BuilderSaveStatus
	readonly savedExercises: readonly CustomExerciseRecord[]
	readonly handleSaveExercise: () => void
	readonly handleLoadExercise: (exercise: WordFormExerciseJSON) => void
	readonly handleDeleteExercise: (id: string) => void
}

export interface ExerciseBuilderState {
	readonly selectedType: 'word-form'
	readonly jsonValue: string
	readonly validation: ValidationState
	readonly saveStatus: BuilderSaveStatus
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

function formatIssue(issue: BaseIssue<unknown>): string {
	const path = issue.path

	if (!path || path.length === 0) {
		return issue.message ?? 'Invalid value'
	}

	const label = path
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

	const prefix = label.length > 0 ? `${label}: ` : ''

	return `${prefix}${issue.message ?? 'Invalid value'}`
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
	const [saveStatus, setSaveStatus] = useState<BuilderSaveStatus>('idle')
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

export function useFormattedSavedExercises(
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

export function useExerciseBuilderState(
	t: BuilderTranslator
): ExerciseBuilderState {
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
