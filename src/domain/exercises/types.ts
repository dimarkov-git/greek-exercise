import type {ExerciseMetadata, WordFormExercise} from '@/types/exercises'
import type {Language} from '@/types/settings'

export interface ExerciseSummary extends ExerciseMetadata {
	/**
	 * Languages that have either title or description translations available.
	 * Greek (`el`) is always included because source content is authored in Greek.
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
