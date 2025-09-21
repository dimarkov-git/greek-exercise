import {describe, expect, test} from 'vitest'
import {loadExercises} from './loadExercises'

describe('loadExercises', () => {
	test('should load exercises from JSON files', () => {
		const exercises = loadExercises()

		expect(exercises).toBeInstanceOf(Map)
		expect(exercises.size).toBeGreaterThan(0)

		// Check that the exercises we expect are loaded
		expect(exercises.has('verbs-be')).toBe(true)
		expect(exercises.has('verbs-have')).toBe(true)

		// Check that a loaded exercise has the expected structure
		const verbsBeExercise = exercises.get('verbs-be')
		expect(verbsBeExercise).toBeDefined()
		expect(verbsBeExercise?.id).toBe('verbs-be')
		expect(verbsBeExercise?.type).toBe('word-form')
		expect(verbsBeExercise?.enabled).toBe(true)
	})

	test('should only include enabled exercises', () => {
		const exercises = loadExercises()

		// All loaded exercises should be enabled
		for (const exercise of exercises.values()) {
			expect(exercise.enabled).toBe(true)
		}
	})
})
