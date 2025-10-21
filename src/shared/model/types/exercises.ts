// Basic exercise types that are truly shared across the application
export type ExerciseType = 'word-form' | 'flashcard' | 'multiple-choice'

export type Difficulty = 'a0' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'

// Base exercise settings (shared across all exercise types)
export interface ExerciseSettings {
	autoAdvance: boolean // auto-advance to the next question
	autoAdvanceDelayMs: number // delay before advancing (ms)
	allowSkip: boolean // whether skipping questions is allowed
	shuffleCases: boolean // whether to shuffle question order
}

// Word-form settings
export interface WordFormSettings extends ExerciseSettings {
	shuffleBlocks: boolean // whether to shuffle blocks
	allowSkipTone: boolean // accept answer without tone marks (but the incorrect tone is still wrong)
}

// Flashcard settings
export interface FlashcardSettings extends ExerciseSettings {
	shuffleCards: boolean // whether to shuffle cards
}

// Multiple-choice settings
export interface MultipleChoiceSettings extends ExerciseSettings {
	shuffleQuestions: boolean // whether to shuffle questions
	shuffleAnswers: boolean // whether to shuffle answer options
}

// Partial exercise settings (for JSON overrides)
export interface PartialExerciseSettings {
	autoAdvance?: boolean // auto-advance to the next question
	autoAdvanceDelayMs?: number // delay before advancing (ms)
	allowSkip?: boolean // whether skipping questions is allowed
	shuffleCases?: boolean // whether to shuffle question order
}

// Partial word-form settings
export interface PartialWordFormSettings extends PartialExerciseSettings {
	shuffleBlocks?: boolean
	allowSkipTone?: boolean
}

// Partial flashcard settings
export interface PartialFlashcardSettings extends PartialExerciseSettings {
	shuffleCards?: boolean
}

// Partial multiple-choice settings
export interface PartialMultipleChoiceSettings extends PartialExerciseSettings {
	shuffleQuestions?: boolean
	shuffleAnswers?: boolean
}

// Default exercise settings
export const DEFAULT_EXERCISE_SETTINGS: ExerciseSettings = {
	autoAdvance: true,
	autoAdvanceDelayMs: 1500,
	allowSkip: false,
	shuffleCases: false
} as const

// Default word-form settings
export const DEFAULT_WORD_FORM_SETTINGS: WordFormSettings = {
	...DEFAULT_EXERCISE_SETTINGS,
	shuffleBlocks: false,
	allowSkipTone: false
} as const

// Default flashcard settings
export const DEFAULT_FLASHCARD_SETTINGS: FlashcardSettings = {
	...DEFAULT_EXERCISE_SETTINGS,
	autoAdvanceDelayMs: 50,
	shuffleCards: false
} as const

// Default multiple-choice settings
export const DEFAULT_MULTIPLE_CHOICE_SETTINGS: MultipleChoiceSettings = {
	...DEFAULT_EXERCISE_SETTINGS,
	autoAdvanceDelayMs: 300,
	shuffleQuestions: false,
	shuffleAnswers: true
} as const
