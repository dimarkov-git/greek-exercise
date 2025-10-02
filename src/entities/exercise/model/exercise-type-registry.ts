/**
 * Exercise type registry
 *
 * Central registry for mapping exercise types to their component implementations.
 * Uses the Registry Pattern to enable dynamic component lookup without hardcoded switches.
 *
 * @example
 * ```typescript
 * // Register a new exercise type
 * exerciseTypeRegistry.register('flashcard', {
 *   Renderer: FlashcardRenderer,
 *   LearnView: FlashcardLearnView,
 *   LibraryCard: FlashcardCard // optional
 * })
 *
 * // Retrieve components
 * const components = exerciseTypeRegistry.get('flashcard')
 * ```
 */

import type {ExerciseType} from '@/shared/model'
import type {ExerciseTypeComponents} from './exercise-renderer-contract'

/**
 * Registry for exercise type components
 *
 * Implements the Registry Pattern for managing exercise type to component mappings.
 * Provides type-safe registration and retrieval of exercise components.
 */
export class ExerciseTypeRegistry {
	private readonly registry = new Map<ExerciseType, ExerciseTypeComponents>()

	/**
	 * Register components for an exercise type
	 *
	 * @param type - Exercise type identifier
	 * @param components - Component implementations for this type
	 * @throws Error if type is already registered (prevents accidental overwrites)
	 *
	 * @example
	 * ```typescript
	 * registry.register('word-form', {
	 *   Renderer: WordFormRenderer,
	 *   LearnView: WordFormLearnView
	 * })
	 * ```
	 */
	register(type: ExerciseType, components: ExerciseTypeComponents): void {
		if (this.registry.has(type)) {
			throw new Error(
				`Exercise type "${type}" is already registered. Use unregister() first if you need to replace it.`
			)
		}

		this.registry.set(type, components)
	}

	/**
	 * Unregister an exercise type
	 *
	 * @param type - Exercise type to unregister
	 * @returns true if type was unregistered, false if it wasn't registered
	 *
	 * @example
	 * ```typescript
	 * registry.unregister('flashcard')
	 * ```
	 */
	unregister(type: ExerciseType): boolean {
		return this.registry.delete(type)
	}

	/**
	 * Get components for an exercise type
	 *
	 * @param type - Exercise type identifier
	 * @returns Components for the type, or undefined if not registered
	 *
	 * @example
	 * ```typescript
	 * const components = registry.get('word-form')
	 * if (components) {
	 *   const { Renderer, LearnView } = components
	 * }
	 * ```
	 */
	get(type: ExerciseType): ExerciseTypeComponents | undefined {
		return this.registry.get(type)
	}

	/**
	 * Check if an exercise type is registered
	 *
	 * @param type - Exercise type identifier
	 * @returns true if type is registered
	 *
	 * @example
	 * ```typescript
	 * if (registry.has('flashcard')) {
	 *   // flashcard is registered
	 * }
	 * ```
	 */
	has(type: ExerciseType): boolean {
		return this.registry.has(type)
	}

	/**
	 * Get all registered exercise types
	 *
	 * @returns Array of registered exercise type identifiers
	 *
	 * @example
	 * ```typescript
	 * const types = registry.getRegisteredTypes()
	 * console.log('Supported types:', types) // ['word-form', 'flashcard', ...]
	 * ```
	 */
	getRegisteredTypes(): ExerciseType[] {
		return Array.from(this.registry.keys())
	}

	/**
	 * Clear all registrations
	 *
	 * Useful for testing or hot module replacement.
	 *
	 * @example
	 * ```typescript
	 * registry.clear() // Remove all registered types
	 * ```
	 */
	clear(): void {
		this.registry.clear()
	}

	/**
	 * Get number of registered types
	 *
	 * @returns Number of registered exercise types
	 */
	get size(): number {
		return this.registry.size
	}
}

/**
 * Global singleton instance of the exercise type registry
 *
 * This is the main registry instance used throughout the application.
 * Exercise types should register themselves by importing this instance.
 *
 * @example
 * ```typescript
 * // In a feature module (e.g., features/word-form-exercise/index.ts)
 * import { exerciseTypeRegistry } from '@/entities/exercise'
 *
 * exerciseTypeRegistry.register('word-form', {
 *   Renderer: WordFormRenderer,
 *   LearnView: WordFormLearnView
 * })
 * ```
 */
export const exerciseTypeRegistry = new ExerciseTypeRegistry()

/**
 * Type guard to check if exercise type is supported
 *
 * @param type - Exercise type to check
 * @returns true if type is registered
 *
 * @example
 * ```typescript
 * if (isExerciseTypeSupported('flashcard')) {
 *   // Safe to use flashcard components
 * }
 * ```
 */
export function isExerciseTypeSupported(type: ExerciseType): boolean {
	return exerciseTypeRegistry.has(type)
}

/**
 * Get list of supported exercise types
 *
 * @returns Array of supported exercise type identifiers
 *
 * @example
 * ```typescript
 * const supportedTypes = getSupportedExerciseTypes()
 * console.log('Available types:', supportedTypes)
 * ```
 */
export function getSupportedExerciseTypes(): ExerciseType[] {
	return exerciseTypeRegistry.getRegisteredTypes()
}
