/**
 * Exercise component factory
 *
 * Factory functions for retrieving exercise type components from the registry.
 * Provides a clean API for pages to get components without knowing about the registry.
 *
 * @example
 * ```typescript
 * // In ExercisePage
 * const Renderer = getExerciseRenderer(exercise.type)
 * if (Renderer) {
 *   return <Renderer exercise={exercise} />
 * }
 * ```
 */

import type {ComponentType} from 'react'
import type {ExerciseType} from '@/shared/model'
import type {
	ExerciseLearnViewProps,
	ExerciseLibraryCardProps,
	ExerciseRendererProps
} from '../model/exercise-renderer-contract'
import {exerciseTypeRegistry} from '../model/exercise-type-registry'

/**
 * Get renderer component for an exercise type
 *
 * Returns the Renderer component for the given exercise type,
 * or null if the type is not registered.
 *
 * @param type - Exercise type identifier
 * @returns Renderer component or null if not found
 *
 * @example
 * ```typescript
 * const Renderer = getExerciseRenderer('word-form')
 * if (Renderer) {
 *   return <Renderer exercise={exercise} onComplete={handleComplete} />
 * }
 * ```
 */
export function getExerciseRenderer(
	type: ExerciseType
): ComponentType<ExerciseRendererProps> | null {
	const components = exerciseTypeRegistry.get(type)

	if (!components) {
		if (process.env.NODE_ENV === 'development') {
			console.warn(
				`[ExerciseComponentFactory] No renderer found for exercise type: ${type}. ` +
					`Make sure the exercise type is registered.`
			)
		}
		return null
	}

	return components.Renderer
}

/**
 * Get learn view component for an exercise type
 *
 * Returns the LearnView component for the given exercise type,
 * or null if the type is not registered.
 *
 * @param type - Exercise type identifier
 * @returns LearnView component or null if not found
 *
 * @example
 * ```typescript
 * const LearnView = getExerciseLearnView('word-form')
 * if (LearnView) {
 *   return <LearnView exercise={exercise} viewMode="table" />
 * }
 * ```
 */
export function getExerciseLearnView(
	type: ExerciseType
): ComponentType<ExerciseLearnViewProps> | null {
	const components = exerciseTypeRegistry.get(type)

	if (!components) {
		if (process.env.NODE_ENV === 'development') {
			console.warn(
				`[ExerciseComponentFactory] No learn view found for exercise type: ${type}. ` +
					`Make sure the exercise type is registered.`
			)
		}
		return null
	}

	return components.LearnView
}

/**
 * Get library card component for an exercise type
 *
 * Returns the LibraryCard component for the given exercise type,
 * or null if the type doesn't have a custom card.
 *
 * If null is returned, the default library card should be used.
 *
 * @param type - Exercise type identifier
 * @returns LibraryCard component or null if not provided
 *
 * @example
 * ```typescript
 * const CustomCard = getExerciseLibraryCard('flashcard')
 * const CardComponent = CustomCard || DefaultExerciseCard
 * return <CardComponent exercise={exercise} />
 * ```
 */
export function getExerciseLibraryCard(
	type: ExerciseType
): ComponentType<ExerciseLibraryCardProps> | null {
	const components = exerciseTypeRegistry.get(type)

	if (!components) {
		return null
	}

	// LibraryCard is optional - return null if not provided
	return components.LibraryCard ?? null
}

/**
 * Check if an exercise type has all required components registered
 *
 * @param type - Exercise type identifier
 * @returns Object indicating which components are available
 *
 * @example
 * ```typescript
 * const availability = getExerciseTypeAvailability('word-form')
 * if (!availability.hasRenderer) {
 *   console.error('Cannot execute this exercise type')
 * }
 * ```
 */
export function getExerciseTypeAvailability(type: ExerciseType): {
	isRegistered: boolean
	hasRenderer: boolean
	hasLearnView: boolean
	hasLibraryCard: boolean
} {
	const components = exerciseTypeRegistry.get(type)

	if (!components) {
		return {
			isRegistered: false,
			hasRenderer: false,
			hasLearnView: false,
			hasLibraryCard: false
		}
	}

	return {
		isRegistered: true,
		hasRenderer: Boolean(components.Renderer),
		hasLearnView: Boolean(components.LearnView),
		hasLibraryCard: Boolean(components.LibraryCard)
	}
}

/**
 * Check if exercise type can be executed
 *
 * @param type - Exercise type identifier
 * @returns true if type has a renderer component
 *
 * @example
 * ```typescript
 * if (canExecuteExercise('flashcard')) {
 *   navigate(`/exercise/${exerciseId}`)
 * } else {
 *   showError('This exercise type is not yet supported')
 * }
 * ```
 */
export function canExecuteExercise(type: ExerciseType): boolean {
	return getExerciseRenderer(type) !== null
}

/**
 * Check if exercise type can be learned/previewed
 *
 * @param type - Exercise type identifier
 * @returns true if type has a learn view component
 *
 * @example
 * ```typescript
 * if (canLearnExercise('word-form')) {
 *   navigate(`/learn/${exerciseId}`)
 * } else {
 *   showError('Learning view not available for this type')
 * }
 * ```
 */
export function canLearnExercise(type: ExerciseType): boolean {
	return getExerciseLearnView(type) !== null
}

/**
 * Get all components for an exercise type
 *
 * Convenience function to get all components at once.
 *
 * @param type - Exercise type identifier
 * @returns Object with all components, or null if type not registered
 *
 * @example
 * ```typescript
 * const components = getExerciseComponents('word-form')
 * if (components) {
 *   const { Renderer, LearnView, LibraryCard } = components
 * }
 * ```
 */
export function getExerciseComponents(type: ExerciseType): {
	Renderer: ComponentType<ExerciseRendererProps>
	LearnView: ComponentType<ExerciseLearnViewProps>
	LibraryCard: ComponentType<ExerciseLibraryCardProps> | null
} | null {
	const components = exerciseTypeRegistry.get(type)

	if (!components) {
		return null
	}

	return {
		Renderer: components.Renderer,
		LearnView: components.LearnView,
		LibraryCard: components.LibraryCard ?? null
	}
}
