/**
 * Exercise data loader
 *
 * Centralized exercise data loading from JSON files.
 * Provides both full registry and individual exercise access.
 *
 * @module entities/exercise/model/data
 */

import {toWordFormExerciseWithDefaults} from '../adapters'
import {validateWordFormExercise} from '../schemas'
import type {WordFormBlock, WordFormExercise} from '../types'

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
 * Load all exercises from JSON files
 *
 * Dynamically imports all JSON files from the exercises directory,
 * validates them, applies defaults, and optionally limits cases.
 *
 * @returns Map of exercise ID to exercise data
 *
 * @example
 * ```typescript
 * const exercises = loadExercises()
 * const exercise = exercises.get('verbs-present-tense')
 * ```
 */
export function loadExercises(): Map<string, WordFormExercise> {
	const exerciseRegistry = new Map<string, WordFormExercise>()

	// Dynamically import all JSON files from the exercises directory
	const exerciseModules = import.meta.glob<unknown>('./exercises/*.json', {
		eager: true,
		import: 'default'
	})

	// Process each exercise file
	for (const [_path, exerciseData] of Object.entries(exerciseModules)) {
		try {
			const validatedExercise = toWordFormExerciseWithDefaults(
				validateWordFormExercise(exerciseData)
			)
			const limitedExercise = limitExerciseCases(validatedExercise, caseLimit)
			exerciseRegistry.set(limitedExercise.id, limitedExercise)
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: This is intentional debug logging for exercise loading
			console.error(`Failed to load exercise from ${_path}:`, error)
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
export function getExerciseById(id: string): WordFormExercise | undefined {
	return exerciseRegistry.get(id)
}

/**
 * Get all exercises as array
 *
 * @returns Array of all exercises
 */
export function getAllExercises(): WordFormExercise[] {
	return Array.from(exerciseRegistry.values())
}

// Build registry once at module load time
const exerciseRegistry = loadExercises()
