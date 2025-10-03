import type {Language} from '@/shared/model'
import type {FlashcardExercise} from './flashcard-types'
import type {ExerciseMetadata, WordFormExercise} from './types'

export type ExerciseSource = 'builtin' | 'custom'

export interface ExerciseSummary extends ExerciseMetadata {
	/**
	 * Languages available for this exercise. Currently always contains only the
	 * exercise's primary language as defined in the `language` property.
	 */
	availableLanguages: Language[]
	/** Indicates whether the exercise comes from built-in content or user library */
	source?: ExerciseSource
}

export interface ExerciseLibraryFilterOptions {
	tags: string[]
	difficulties: ExerciseMetadata['difficulty'][]
	languages: Language[]
}

export interface ExerciseLibraryTotals {
	total: number
	enabled: number
}

export interface ExerciseLibraryViewModel {
	exercises: ExerciseSummary[]
	filterOptions: ExerciseLibraryFilterOptions
	totals: ExerciseLibraryTotals
}

export interface ExerciseFilterSelection {
	tags: string[]
	difficulties: ExerciseMetadata['difficulty'][]
	languages: Language[]
}

export type WordFormExerciseWithDefaults = WordFormExercise & {
	tags: string[]
	settings: import('@/entities/exercise').ExerciseSettings
}

export type FlashcardExerciseWithDefaults = FlashcardExercise & {
	tags: string[]
	settings: import('@/entities/exercise').ExerciseSettings
	srsSettings: import('@/entities/exercise').SRSSettings
}
