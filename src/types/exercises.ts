import type {Language} from './settings'

// Base exercise types
export type ExerciseType =
	| 'word-form'
	| 'translation'
	| 'flashcard'
	| 'multiple-choice'
export type Difficulty = 'a0' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'

// Exercise settings
export interface ExerciseSettings {
	autoAdvance: boolean // auto-advance to next question
	autoAdvanceDelayMs: number // delay before advancing (ms)
	allowSkip: boolean // whether skipping questions is allowed
	shuffleCases: boolean // whether to shuffle question order
}

// Exercise block (e.g., "είμαι in present tense")
export interface WordFormBlock {
	id: string // unique block identifier
	name: string // block name in Greek (main study language)
	nameHintI18n: Record<Language, string> // hints in user's language
	cases: WordFormCase[]
}

// Individual question in a block
export interface WordFormCase {
	id: string // unique case identifier
	prompt: string // question in Greek (main study language)
	promptHintI18n?: Record<Language, string> // hints in user's language (optional)
	correct: string[] // correct answers in Greek (multiple answers supported)
	hint?: string // additional hint in Greek (optional)
	hintI18n?: Record<Language, string> // additional hint in user's language (optional)
}

// Complete exercise structure
export interface WordFormExercise {
	enabled: boolean
	id: string
	type: 'word-form'
	title: string // title in Greek
	titleI18n: Record<Language, string> // title in interface languages
	description: string // description in Greek
	descriptionI18n: Record<Language, string> // description in interface languages
	tags: string[] // filtering tags (e.g., ["verbs", "irregular-verbs", "basic"])
	difficulty: Difficulty
	estimatedTimeMinutes: number // estimated completion time
	settings: ExerciseSettings
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
	title: string
	titleI18n: Record<Language, string>
	description: string
	descriptionI18n: Record<Language, string>
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
	title: string
	titleI18n: Record<Language, string>
	description: string
	descriptionI18n: Record<Language, string>
	tags: string[]
	difficulty: Difficulty
	estimatedTimeMinutes: number
	settings: ExerciseSettings
	blocks: WordFormBlock[]
}

// Helper function to convert exercise to serializable JSON
export function exerciseToJSON(
	exercise: WordFormExercise
): WordFormExerciseJSON {
	return {
		enabled: exercise.enabled,
		id: exercise.id,
		type: exercise.type,
		title: exercise.title,
		titleI18n: exercise.titleI18n,
		description: exercise.description,
		descriptionI18n: exercise.descriptionI18n,
		tags: exercise.tags,
		difficulty: exercise.difficulty,
		estimatedTimeMinutes: exercise.estimatedTimeMinutes,
		settings: exercise.settings,
		blocks: exercise.blocks
	}
}
