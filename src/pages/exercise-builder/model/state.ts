import type {ChangeEvent} from 'react'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {type BaseIssue, safeParse} from 'valibot'
import type {
	CustomExerciseJSON,
	CustomExerciseRecord,
	FlashcardExerciseWithDefaults,
	MultipleChoiceExerciseWithDefaults,
	WordFormExerciseWithDefaults
} from '@/entities/exercise'
import {
	exerciseToJSON,
	FlashcardExerciseSchema,
	flashcardExerciseToJSON,
	MultipleChoiceExerciseSchema,
	selectCustomExerciseList,
	toFlashcardExerciseWithDefaults,
	toMultipleChoiceExerciseWithDefaults,
	toWordFormExerciseWithDefaults,
	useCustomExercisesStore,
	WordFormExerciseSchema
} from '@/entities/exercise'
import type {ExerciseType} from '@/shared/model'
import type {exerciseBuilderPageTranslations} from '../translations'

export type BuilderTranslator = (
	entry: (typeof exerciseBuilderPageTranslations)[keyof typeof exerciseBuilderPageTranslations]
) => string
export type BuilderSaveStatus = 'idle' | 'success' | 'error'

type WordFormExerciseJSON = import('@/entities/exercise').WordFormExerciseJSON
type FlashcardExerciseJSON = import('@/entities/exercise').FlashcardExerciseJSON

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
					correct: ['είσαι']
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

const DEFAULT_FLASHCARD_TEMPLATE: FlashcardExerciseJSON = {
	enabled: true,
	id: 'custom-flashcard-basic',
	type: 'flashcard',
	language: 'el',
	title: 'Βασικά ελληνικά ουσιαστικά',
	titleI18n: {
		en: 'Basic Greek nouns',
		ru: 'Базовые греческие существительные'
	},
	description: 'Πρακτική για βασικά ουσιαστικά',
	descriptionI18n: {
		en: 'Practice basic nouns',
		ru: 'Практика базовых существительных'
	},
	tags: ['custom', 'nouns', 'vocabulary'],
	difficulty: 'a1',
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1500,
		allowSkip: false,
		shuffleCases: true
	},
	cards: [
		{
			id: 'card-1',
			front: 'το νερό',
			frontHintI18n: {
				en: 'the water',
				ru: 'вода'
			},
			back: 'water',
			backHintI18n: {
				en: 'a liquid',
				ru: 'жидкость'
			}
		},
		{
			id: 'card-2',
			front: 'το ψωμί',
			frontHintI18n: {
				en: 'the bread',
				ru: 'хлеб'
			},
			back: 'bread',
			backHintI18n: {
				en: 'a food',
				ru: 'еда'
			}
		},
		{
			id: 'card-3',
			front: 'το σπίτι',
			frontHintI18n: {
				en: 'the house',
				ru: 'дом'
			},
			back: 'house',
			backHintI18n: {
				en: 'a building',
				ru: 'здание'
			}
		}
	],
	srsSettings: {
		newCardsPerDay: 20,
		reviewsPerDay: 100,
		graduatingInterval: 1,
		easyInterval: 4
	}
}

const DEFAULT_WORD_FORM_TEMPLATE_JSON = JSON.stringify(
	DEFAULT_WORD_FORM_TEMPLATE,
	null,
	2
)

const DEFAULT_FLASHCARD_TEMPLATE_JSON = JSON.stringify(
	DEFAULT_FLASHCARD_TEMPLATE,
	null,
	2
)

type MultipleChoiceExerciseJSON =
	import('@/entities/exercise').MultipleChoiceExercise

const DEFAULT_MULTIPLE_CHOICE_TEMPLATE: MultipleChoiceExerciseJSON = {
	enabled: true,
	id: 'custom-multiple-choice',
	type: 'multiple-choice',
	language: 'el',
	title: 'Βασική λεξιλόγιο - Επιλογή απάντησης',
	titleI18n: {
		en: 'Basic Vocabulary - Multiple Choice',
		ru: 'Базовая лексика - Множественный выбор'
	},
	description: 'Εξάσκηση βασικών ελληνικών λέξεων με πολλαπλή επιλογή',
	descriptionI18n: {
		en: 'Practice basic Greek words with multiple choice questions',
		ru: 'Практика базовых греческих слов с вопросами множественного выбора'
	},
	tags: ['custom', 'vocabulary', 'multiple-choice'],
	difficulty: 'a1',
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1500,
		allowSkip: false,
		shuffleCases: true
	},
	questions: [
		{
			id: 'q1',
			text: "Τι σημαίνει 'καλημέρα';",
			textI18n: {
				en: "What does 'καλημέρα' mean?",
				ru: "Что означает 'καλημέρα'?"
			},
			options: [
				{
					id: 'q1-o1',
					text: 'Good morning',
					textI18n: {ru: 'Доброе утро'}
				},
				{
					id: 'q1-o2',
					text: 'Good night',
					textI18n: {ru: 'Спокойной ночи'}
				},
				{
					id: 'q1-o3',
					text: 'Goodbye',
					textI18n: {ru: 'До свидания'}
				}
			],
			correctOptionId: 'q1-o1',
			hint: 'Used in morning greetings',
			hintI18n: {
				en: 'Used when greeting someone in the morning',
				ru: 'Используется при приветствии утром'
			}
		},
		{
			id: 'q2',
			text: "Πώς λέμε 'thank you' στα ελληνικά;",
			textI18n: {
				en: "How do you say 'thank you' in Greek?",
				ru: "Как сказать 'спасибо' по-гречески?"
			},
			options: [
				{
					id: 'q2-o1',
					text: 'παρακαλώ',
					textI18n: {en: 'parakaló', ru: 'паракало'}
				},
				{
					id: 'q2-o2',
					text: 'ευχαριστώ',
					textI18n: {en: 'efcharistó', ru: 'эфхаристо'}
				},
				{
					id: 'q2-o3',
					text: 'συγγνώμη',
					textI18n: {en: 'signómi', ru: 'сигноми'}
				}
			],
			correctOptionId: 'q2-o2'
		}
	]
}

const DEFAULT_MULTIPLE_CHOICE_TEMPLATE_JSON = JSON.stringify(
	DEFAULT_MULTIPLE_CHOICE_TEMPLATE,
	null,
	2
)

function getDefaultTemplateForType(type: ExerciseType): string {
	switch (type) {
		case 'word-form':
			return DEFAULT_WORD_FORM_TEMPLATE_JSON
		case 'flashcard':
			return DEFAULT_FLASHCARD_TEMPLATE_JSON
		case 'multiple-choice':
			return DEFAULT_MULTIPLE_CHOICE_TEMPLATE_JSON
		default:
			return DEFAULT_WORD_FORM_TEMPLATE_JSON
	}
}

type RawValidationError =
	| {kind: 'empty'}
	| {kind: 'parse'; message: string}
	| {kind: 'schema'; message: string}

interface RawValidationState {
	readonly exercise:
		| WordFormExerciseWithDefaults
		| FlashcardExerciseWithDefaults
		| MultipleChoiceExerciseWithDefaults
		| null
	readonly errors: readonly RawValidationError[]
}

export interface ValidationState {
	readonly exercise:
		| WordFormExerciseWithDefaults
		| FlashcardExerciseWithDefaults
		| MultipleChoiceExerciseWithDefaults
		| null
	readonly rawErrors: readonly RawValidationError[]
	readonly errors: readonly string[]
}

export interface ExerciseValidationResult {
	readonly selectedType: ExerciseType
	readonly jsonValue: string
	readonly validation: ValidationState
	readonly previewExercise:
		| WordFormExerciseWithDefaults
		| FlashcardExerciseWithDefaults
		| MultipleChoiceExerciseWithDefaults
		| null
	readonly hasErrors: boolean
	readonly handleTypeChange: (type: ExerciseType) => void
	readonly handleJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
	readonly handleResetTemplate: () => void
	readonly handleFormatJson: () => void
	readonly loadExerciseJson: (exercise: CustomExerciseJSON) => void
}

export interface ExercisePersistenceResult {
	readonly saveStatus: BuilderSaveStatus
	readonly savedExercises: readonly CustomExerciseRecord[]
	readonly handleSaveExercise: () => void
	readonly handleLoadExercise: (exercise: CustomExerciseJSON) => void
	readonly handleDeleteExercise: (id: string) => void
}

export interface ExerciseBuilderState {
	readonly selectedType: ExerciseType
	readonly jsonValue: string
	readonly validation: ValidationState
	readonly saveStatus: BuilderSaveStatus
	readonly savedExercises: readonly CustomExerciseRecord[]
	readonly previewExercise:
		| WordFormExerciseWithDefaults
		| FlashcardExerciseWithDefaults
		| MultipleChoiceExerciseWithDefaults
		| null
	readonly hasErrors: boolean
	readonly handleTypeChange: (type: ExerciseType) => void
	readonly handleJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
	readonly handleReset: () => void
	readonly handleFormat: () => void
	readonly handleSave: () => void
	readonly handleLoadSaved: (exercise: CustomExerciseJSON) => void
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

function validateWordFormJson(parsed: unknown): RawValidationState {
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
}

function validateFlashcardJson(parsed: unknown): RawValidationState {
	const result = safeParse(FlashcardExerciseSchema, parsed)

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

	const normalized = toFlashcardExerciseWithDefaults(result.output)
	return {exercise: normalized, errors: []}
}

function validateMultipleChoiceJson(parsed: unknown): RawValidationState {
	const result = safeParse(MultipleChoiceExerciseSchema, parsed)

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

	const normalized = toMultipleChoiceExerciseWithDefaults(result.output)
	return {exercise: normalized, errors: []}
}

function validateExerciseJson(
	json: string,
	expectedType?: ExerciseType
): RawValidationState {
	if (json.trim().length === 0) {
		return {exercise: null, errors: [{kind: 'empty'}]}
	}

	try {
		const parsed = JSON.parse(json)
		const parsedType = parsed.type as ExerciseType | undefined

		// Determine which schema to use
		const typeToValidate = expectedType || parsedType || 'word-form'

		switch (typeToValidate) {
			case 'word-form':
				return validateWordFormJson(parsed)
			case 'flashcard':
				return validateFlashcardJson(parsed)
			case 'multiple-choice':
				return validateMultipleChoiceJson(parsed)
			default:
				return {
					exercise: null,
					errors: [
						{
							kind: 'schema',
							message: `Unsupported exercise type: ${typeToValidate}`
						}
					]
				}
		}
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

const INITIAL_RAW_VALIDATION = validateExerciseJson(
	DEFAULT_WORD_FORM_TEMPLATE_JSON,
	'word-form'
)

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
		(value: string, expectedType?: ExerciseType) => {
			const nextValidation = validateExerciseJson(value, expectedType)
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

function useBuilderJsonControls(
	applyValidation: (value: string, expectedType?: ExerciseType) => void
) {
	const [selectedType, setSelectedType] = useState<ExerciseType>('word-form')
	const [jsonValue, setJsonValue] = useState(DEFAULT_WORD_FORM_TEMPLATE_JSON)

	const setAndValidate = useCallback(
		(value: string, type?: ExerciseType) => {
			setJsonValue(value)
			applyValidation(value, type)
		},
		[applyValidation]
	)

	const handleTypeChange = useCallback(
		(type: ExerciseType) => {
			setSelectedType(type)
			const template = getDefaultTemplateForType(type)
			setAndValidate(template, type)
		},
		[setAndValidate]
	)

	const handleJsonChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setAndValidate(event.target.value, selectedType)
		},
		[setAndValidate, selectedType]
	)

	const handleResetTemplate = useCallback(() => {
		const template = getDefaultTemplateForType(selectedType)
		setAndValidate(template, selectedType)
	}, [setAndValidate, selectedType])

	return {
		selectedType,
		jsonValue,
		handleTypeChange,
		handleJsonChange,
		handleResetTemplate,
		setJsonValueDirect: (value: string) => setAndValidate(value, selectedType)
	}
}

function formatExerciseJson(
	exercise:
		| WordFormExerciseWithDefaults
		| FlashcardExerciseWithDefaults
		| MultipleChoiceExerciseWithDefaults
): string {
	if (exercise.type === 'word-form') {
		return JSON.stringify(exerciseToJSON(exercise), null, 2)
	}

	if (exercise.type === 'flashcard') {
		return JSON.stringify(flashcardExerciseToJSON(exercise), null, 2)
	}

	if (exercise.type === 'multiple-choice') {
		return JSON.stringify(exercise, null, 2)
	}

	return JSON.stringify(exercise, null, 2)
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
			applyValidation(jsonValue, selectedType)
			return
		}

		const formatted = formatExerciseJson(previewExercise)
		setJsonValueDirect(formatted)
	}, [
		applyValidation,
		jsonValue,
		previewExercise,
		selectedType,
		setJsonValueDirect
	])

	const loadExerciseJson = useCallback(
		(exercise: CustomExerciseJSON) => {
			setJsonValueDirect(JSON.stringify(exercise, null, 2))
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
	previewExercise:
		| WordFormExerciseWithDefaults
		| FlashcardExerciseWithDefaults
		| MultipleChoiceExerciseWithDefaults
		| null,
	loadExerciseJson: (exercise: CustomExerciseJSON) => void
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
			let serialized: CustomExerciseJSON
			if (previewExercise.type === 'word-form') {
				serialized = exerciseToJSON(previewExercise)
			} else if (previewExercise.type === 'flashcard') {
				serialized = flashcardExerciseToJSON(previewExercise)
			} else {
				setSaveStatus('error')
				return
			}

			saveExercise(serialized)
			setSaveStatus('success')
		} catch {
			setSaveStatus('error')
		}
	}, [previewExercise, saveExercise])

	const handleLoadExercise = useCallback(
		(exercise: CustomExerciseJSON) => {
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
