/**
 * Universal contracts for all exercise types
 *
 * These interfaces define the common API that all exercise types must implement.
 * This enables the registry pattern and component factory to work with any exercise type.
 */

import type {ComponentType} from 'react'
import type {Difficulty, ExerciseType, Language} from '@/shared/model'

/**
 * Status of exercise execution
 */
export type ExerciseStatus =
	| 'WAITING_INPUT' // Waiting for user input
	| 'CHECKING' // Validating answer
	| 'CORRECT_ANSWER' // Correct answer feedback
	| 'WRONG_ANSWER' // Wrong answer feedback
	| 'REQUIRE_CORRECTION' // Must enter correct answer
	| 'REQUIRE_CONTINUE' // Waiting for user to continue
	| 'COMPLETED' // Exercise completed

/**
 * Universal progress information for any exercise type
 */
export interface ExerciseProgress {
	/** Current question/case number (1-based) */
	current: number
	/** Total number of questions/cases */
	total: number
	/** Number of completed questions/cases */
	completed: number
	/** Completion percentage (0-100) */
	percentage: number
}

/**
 * Universal statistics for any exercise type
 */
export interface ExerciseStatistics {
	/** Number of correct answers */
	correct: number
	/** Number of incorrect answers */
	incorrect: number
	/** Number of skipped questions */
	skipped: number
	/** Number of hints used */
	hintsUsed: number
	/** Time spent in milliseconds */
	timeSpentMs: number
}

/**
 * Base state interface for all exercise types
 */
export interface ExerciseState {
	/** Current exercise status */
	status: ExerciseStatus
	/** Progress information */
	progress: ExerciseProgress
	/** Statistics */
	statistics: ExerciseStatistics
}

/**
 * Exercise completion result
 */
export interface ExerciseResult {
	/** Exercise ID */
	exerciseId: string
	/** Total number of questions/cases */
	totalCases: number
	/** Number of correct answers */
	correctAnswers: number
	/** Number of incorrect answers */
	incorrectAnswers: number
	/** Time spent in milliseconds */
	timeSpentMs?: number
	/** Accuracy percentage (0-100) */
	accuracy?: number
}

/**
 * Universal props for exercise renderer components
 *
 * All exercise renderers must accept these props.
 * Generic type TExercise allows type-safe exercise data.
 */
export interface ExerciseRendererProps<TExercise = unknown> {
	/** Exercise data */
	exercise: TExercise
	/** Callback when exercise is completed */
	onComplete?: (result: Omit<ExerciseResult, 'completedAt'>) => void
	/** Callback when user exits exercise */
	onExit?: () => void
}

/**
 * View mode for learn page
 */
export type ExerciseViewMode = 'table' | 'json'

/**
 * Universal props for exercise learn view components
 *
 * Learn view displays exercise structure for studying.
 * Generic type TExercise allows type-safe exercise data.
 */
export interface ExerciseLearnViewProps<TExercise = unknown> {
	/** Exercise data */
	exercise: TExercise
	/** View mode (table or JSON) */
	viewMode: ExerciseViewMode
}

/**
 * Exercise summary for library display
 */
export interface ExerciseSummary {
	/** Unique exercise ID */
	id: string
	/** Exercise type */
	type: ExerciseType
	/** Primary language */
	language: Language
	/** Title in primary language */
	title: string
	/** Localized titles */
	titleI18n?: Partial<Record<Language, string>>
	/** Description in primary language */
	description: string
	/** Localized descriptions */
	descriptionI18n?: Partial<Record<Language, string>>
	/** Filtering tags */
	tags: string[]
	/** Difficulty level */
	difficulty: Difficulty
	/** Estimated time in minutes */
	estimatedTimeMinutes: number
	/** Total number of blocks/sections */
	totalBlocks: number
	/** Total number of questions/cases */
	totalCases: number
	/** Whether exercise is enabled */
	enabled: boolean
	/** Source of exercise (builtin or custom) */
	source?: 'builtin' | 'custom'
}

/**
 * Translation function type
 */
export type TranslationFunction = (key: string) => string

/**
 * Universal props for exercise library card components
 *
 * Library cards display exercise summary in the library.
 * Optional - if not provided, default card is used.
 */
export interface ExerciseLibraryCardProps {
	/** Exercise summary data */
	exercise: ExerciseSummary
	/** Translation function */
	t: TranslationFunction
	/** Card index for animations */
	index: number
	/** Translation keys object */
	translations: Record<string, string>
}

/**
 * Complete set of components for an exercise type
 */
export interface ExerciseTypeComponents<TExercise = unknown> {
	/** Component for executing the exercise */
	renderer: ComponentType<ExerciseRendererProps<TExercise>>
	/** Component for learning/studying the exercise */
	learnView: ComponentType<ExerciseLearnViewProps<TExercise>>
	/** Optional custom library card component */
	libraryCard?: ComponentType<ExerciseLibraryCardProps>
}

/**
 * Type guard to check if an exercise has i18n support
 */
export function hasI18nSupport<T extends {titleI18n?: unknown}>(
	exercise: T
): exercise is T & {titleI18n: Partial<Record<Language, string>>} {
	return Boolean(exercise.titleI18n)
}

/**
 * Get localized title from exercise
 */
export function getLocalizedTitle<
	T extends {title: string; titleI18n?: Partial<Record<Language, string>>}
>(exercise: T, language: Language): string {
	return exercise.titleI18n?.[language] ?? exercise.title
}

/**
 * Get localized description from exercise
 */
export function getLocalizedDescription<
	T extends {
		description: string
		descriptionI18n?: Partial<Record<Language, string>>
	}
>(exercise: T, language: Language): string {
	return exercise.descriptionI18n?.[language] ?? exercise.description
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(
	correct: number,
	total: number
): number | undefined {
	if (total === 0) return
	return Math.round((correct / total) * 100)
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
	if (total === 0) return 0
	return Math.round((completed / total) * 100)
}
