import {toWordFormExerciseWithDefaults} from '@/domain/exercises/adapters'
import {validateWordFormExercise} from '@/schemas/exercises'
import type {WordFormBlock, WordFormExercise} from '@/types/exercises'

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

export function loadExercises(): Map<string, WordFormExercise> {
	const exerciseRegistry = new Map<string, WordFormExercise>()

	// Dynamically import all JSON files from the exercises directory
	const exerciseModules = import.meta.glob('../data/exercises/*.json', {
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
