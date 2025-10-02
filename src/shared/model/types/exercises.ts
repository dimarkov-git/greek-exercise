// Basic exercise types that are truly shared across the application
export type ExerciseType = 'word-form' | 'flashcard' | 'multiple-choice'

export type Difficulty = 'a0' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'

// Exercise settings
export interface ExerciseSettings {
	autoAdvance: boolean // auto-advance to the next question
	autoAdvanceDelayMs: number // delay before advancing (ms)
	allowSkip: boolean // whether skipping questions is allowed
	shuffleCases: boolean // whether to shuffle question order
}

// Partial exercise settings (for JSON overrides)
export interface PartialExerciseSettings {
	autoAdvance?: boolean // auto-advance to the next question
	autoAdvanceDelayMs?: number // delay before advancing (ms)
	allowSkip?: boolean // whether skipping questions is allowed
	shuffleCases?: boolean // whether to shuffle question order
}

// Default exercise settings
export const DEFAULT_EXERCISE_SETTINGS: ExerciseSettings = {
	autoAdvance: true,
	autoAdvanceDelayMs: 1500,
	allowSkip: false,
	shuffleCases: false
} as const
