import {validateWordFormExercise} from '@/schemas/exercises'
import type {WordFormExercise} from '@/types/exercises'

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
			const validatedExercise = validateWordFormExercise(exerciseData)
			exerciseRegistry.set(
				validatedExercise.id,
				validatedExercise as WordFormExercise
			)
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: This is intentional debug logging for exercise loading
			console.error(`Failed to load exercise from ${_path}:`, error)
		}
	}

	return exerciseRegistry
}
