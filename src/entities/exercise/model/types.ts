import type {
	Difficulty,
	ExerciseSettings,
	ExerciseType,
	PartialExerciseSettings
} from '@/shared/model'
import {DEFAULT_EXERCISE_SETTINGS} from '@/shared/model'
import type {Language} from '@/shared/model/settings'

// Re-export shared types for backwards compatibility
export type {
	Difficulty,
	ExerciseSettings,
	ExerciseType,
	PartialExerciseSettings
}
export {DEFAULT_EXERCISE_SETTINGS}

type I18nText = Partial<Record<Language, string>>

// Exercise block (e.g., "είμαι in present tense")
export interface WordFormBlock {
	id: string // unique block identifier
	name: string // block name in Greek (main study language)
	nameHintI18n?: I18nText // hints in user's language (optional)
	cases: WordFormCase[]
}

// Individual question in a block
export interface WordFormCase {
	id: string // unique case identifier
	prompt: string // question in Greek (main study language)
	promptHintI18n?: I18nText // hints in user's language (optional)
	correct: string[] // correct answers in Greek (multiple answers supported)
	hint?: string // additional hint in Greek (optional)
	hintI18n?: I18nText // additional hint in user's language (optional)
}

// Complete exercise structure
export interface WordFormExercise {
	enabled: boolean
	id: string
	type: 'word-form'
	language: Language // primary language of the exercise
	title: string // title in Greek
	titleI18n?: I18nText // title in interface languages (optional)
	description: string // description in Greek
	descriptionI18n?: I18nText // description in interface languages (optional)
	tags?: string[] // filtering tags (optional, defaults to empty array)
	difficulty: Difficulty
	estimatedTimeMinutes: number // estimated completion time
	settings?: PartialExerciseSettings // optional settings, defaults will be applied
	blocks: WordFormBlock[]
}

// Exercise state during execution
export interface ExerciseState {
	currentBlockIndex: number
	currentCaseIndex: number
	userAnswer: string
	showAnswer: boolean // whether to show correct answer after mistake
	isCorrect: boolean | null // null = not checked, true = correct, false = incorrect
	completedCases: number
	totalCases: number
	autoAdvanceEnabled: boolean // can be toggled during execution
	incorrectAttempts: number // number of incorrect attempts for current question
	// Hint system state
	showNameHint: boolean // show block name translation
	showPromptHint: boolean // show question translation
	showAdditionalHint: boolean // show additional hint
}

// Exercise metadata for library display
export interface ExerciseMetadata {
	id: string
	type: ExerciseType
	language: Language // primary language of the exercise
	title: string
	titleI18n?: I18nText
	description: string
	descriptionI18n?: I18nText
	tags: string[]
	difficulty: Difficulty
	estimatedTimeMinutes: number
	totalBlocks: number
	totalCases: number
	enabled: boolean
}

// Exercise completion result
export interface ExerciseResult {
	exerciseId: string
	totalCases: number
	correctAnswers: number
	incorrectAnswers: number
	timeSpentMs?: number
	completedAt: Date
	accuracy?: number // percentage of correct answers (0-100)
}

// Tag statistics (for analytics)
export interface TagStats {
	tag: string
	totalExercises: number
	completedExercises: number
	averageAccuracy: number
	totalTimeSpentMs: number
}

// Exercise state in state machine
export type ExerciseStatus =
	| 'WAITING_INPUT' // waiting for user input
	| 'CHECKING' // checking answer
	| 'CORRECT_ANSWER' // correct answer (green pulse)
	| 'WRONG_ANSWER' // wrong answer (red pulse + show correct)
	| 'REQUIRE_CORRECTION' // require entering correct answer
	| 'REQUIRE_CONTINUE' // correct answer, waiting for user to continue (when autoAdvance disabled)
	| 'COMPLETED' // exercise completed

// Event for state machine
export type ExerciseEvent =
	| {type: 'SUBMIT_ANSWER'; answer: string}
	| {type: 'CONTINUE'}
	| {type: 'SKIP'}
	| {type: 'RESTART'}
	| {type: 'TOGGLE_HINT'; hintType: 'name' | 'prompt' | 'additional'}
	| {type: 'TOGGLE_AUTO_ADVANCE'}

// JSON serialization type for exercises
export interface WordFormExerciseJSON {
	enabled: boolean
	id: string
	type: 'word-form'
	language: Language // primary language of the exercise
	title: string
	titleI18n?: I18nText
	description: string
	descriptionI18n?: I18nText
	tags: string[]
	difficulty: Difficulty
	estimatedTimeMinutes: number
	settings: ExerciseSettings
	blocks: WordFormBlock[]
}

/**
 * Get exercise settings with defaults applied for missing values
 */
export function getExerciseSettings(
	exercise: WordFormExercise
): ExerciseSettings {
	const settings = exercise.settings
	return {
		autoAdvance: settings?.autoAdvance ?? DEFAULT_EXERCISE_SETTINGS.autoAdvance,
		autoAdvanceDelayMs:
			settings?.autoAdvanceDelayMs ??
			DEFAULT_EXERCISE_SETTINGS.autoAdvanceDelayMs,
		allowSkip: settings?.allowSkip ?? DEFAULT_EXERCISE_SETTINGS.allowSkip,
		shuffleCases:
			settings?.shuffleCases ?? DEFAULT_EXERCISE_SETTINGS.shuffleCases
	}
}

// Helper function to convert exercise to serializable JSON
export function exerciseToJSON(
	exercise: WordFormExercise
): WordFormExerciseJSON {
	const result: WordFormExerciseJSON = {
		enabled: exercise.enabled,
		id: exercise.id,
		type: exercise.type,
		language: exercise.language,
		title: exercise.title,
		description: exercise.description,
		tags: exercise.tags || [],
		difficulty: exercise.difficulty,
		estimatedTimeMinutes: exercise.estimatedTimeMinutes,
		settings: getExerciseSettings(exercise),
		blocks: exercise.blocks
	}

	if (exercise.titleI18n) {
		result.titleI18n = exercise.titleI18n
	}

	if (exercise.descriptionI18n) {
		result.descriptionI18n = exercise.descriptionI18n
	}

	return result
}
