/**
 * Exercise data loader
 *
 * Centralized exercise data loading from JSON files.
 * Provides both full registry and individual exercise access.
 * Supports multiple exercise types (word-form, flashcard, multiple-choice).
 *
 * @module entities/exercise/model/data
 */

import {
	toFlashcardExerciseWithDefaults,
	toWordFormExerciseWithDefaults
} from '../adapters'
import type {FlashcardExercise} from '../flashcard-types'
import {validateFlashcardExercise, validateWordFormExercise} from '../schemas'
import type {WordFormBlock, WordFormExercise} from '../types'

/**
 * Union type for all supported exercise types
 */
export type AnyExercise = WordFormExercise | FlashcardExercise

const EXERCISE_CASE_LIMIT_KEY = '__EXERCISE_CASE_LIMIT__' as const

type ExerciseLimitGlobal = typeof globalThis & {
	[EXERCISE_CASE_LIMIT_KEY]?: number
}

const globalObject = globalThis as ExerciseLimitGlobal

const caseLimit = (() => {
	const limit = globalObject[EXERCISE_CASE_LIMIT_KEY]

	if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
		return Math.floor(limit)
	}

	return
})()

function limitExerciseCases(
	exercise: WordFormExercise,
	limit: number | undefined
): WordFormExercise {
	if (limit === undefined) {
		return exercise
	}

	let remaining = limit

	const limitedBlocks: WordFormBlock[] = []

	for (const block of exercise.blocks) {
		if (remaining <= 0) {
			break
		}

		const limitedCases = block.cases.slice(0, remaining)

		if (limitedCases.length === 0) {
			continue
		}

		remaining -= limitedCases.length
		limitedBlocks.push({...block, cases: limitedCases})
	}

	return {...exercise, blocks: limitedBlocks}
}

/**
 * Validate and normalize an exercise based on its type
 *
 * @param exerciseData - Raw exercise data from JSON
 * @param path - File path for error reporting
 * @returns Normalized exercise or null if invalid
 */
function loadAndValidateExercise(
	exerciseData: unknown,
	path: string
): AnyExercise | null {
	// Type guard to check if data has a type field
	if (
		!exerciseData ||
		typeof exerciseData !== 'object' ||
		!('type' in exerciseData)
	) {
		// biome-ignore lint/suspicious/noConsole: Intentional debug logging
		console.error(`Failed to load exercise from ${path}: missing type field`)
		return null
	}

	const type = (exerciseData as {type: unknown}).type

	try {
		switch (type) {
			case 'word-form': {
				const validated = validateWordFormExercise(exerciseData)
				const normalized = toWordFormExerciseWithDefaults(validated)
				return limitExerciseCases(normalized, caseLimit)
			}
			case 'flashcard': {
				const validated = validateFlashcardExercise(exerciseData)
				return toFlashcardExerciseWithDefaults(validated)
			}
			default:
				// biome-ignore lint/suspicious/noConsole: Intentional debug logging
				console.error(
					`Failed to load exercise from ${path}: unsupported type "${String(type)}"`
				)
				return null
		}
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: Intentional debug logging
		console.error(`Failed to load exercise from ${path}:`, error)
		return null
	}
}

/**
 * Load all exercises from JSON files
 *
 * Dynamically imports all JSON files from the exercises directory,
 * validates them based on their type, applies defaults, and optionally limits cases.
 *
 * @returns Map of exercise ID to exercise data
 *
 * @example
 * ```typescript
 * const exercises = loadExercises()
 * const exercise = exercises.get('verbs-present-tense')
 * ```
 */
export function loadExercises(): Map<string, AnyExercise> {
	const exerciseRegistry = new Map<string, AnyExercise>()

	// Dynamically import all JSON files from the exercises directory
	const exerciseModules = import.meta.glob<unknown>('./exercises/*.json', {
		eager: true,
		import: 'default'
	})

	// Process each exercise file
	for (const [path, exerciseData] of Object.entries(exerciseModules)) {
		const exercise = loadAndValidateExercise(exerciseData, path)
		if (exercise) {
			exerciseRegistry.set(exercise.id, exercise)
		}
	}

	return exerciseRegistry
}

/**
 * Get exercise by ID
 *
 * @param id - Exercise ID
 * @returns Exercise data or undefined if not found
 */
export function getExerciseById(id: string): AnyExercise | undefined {
	return exerciseRegistry.get(id)
}

/**
 * Get all exercises as array
 *
 * @returns Array of all exercises
 */
export function getAllExercises(): AnyExercise[] {
	return Array.from(exerciseRegistry.values())
}

// Build registry once at module load time
const exerciseRegistry = loadExercises()
