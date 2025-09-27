import type {ExerciseMetadata, WordFormExercise} from '@/types/exercises'
import type {Language} from '@/types/settings'

export interface ExerciseSummary extends ExerciseMetadata {
	/**
	 * Languages available for this exercise. Currently always contains only the
	 * exercise's primary language as defined in the `language` property.
	 */
	availableLanguages: Language[]
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
	settings: NonNullable<WordFormExercise['settings']>
}
