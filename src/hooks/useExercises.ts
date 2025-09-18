import {useQuery} from '@tanstack/react-query'
import {
	validateExercisesList,
	validateWordFormExercise
} from '@/schemas/exercises'
import type {ExerciseMetadata, WordFormExercise} from '@/types/exercises'

/**
 * Fetch exercises list from API
 */
async function fetchExercises(): Promise<ExerciseMetadata[]> {
	const response = await fetch('/api/exercises')

	if (!response.ok) {
		throw new Error(
			`Failed to fetch exercises: ${response.status} ${response.statusText}`
		)
	}

	const data = await response.json()

	// Validate response with Valibot
	return validateExercisesList(data) as ExerciseMetadata[]
}

/**
 * Fetch specific exercise by ID
 */
async function fetchExercise(id: string): Promise<WordFormExercise> {
	const response = await fetch(`/api/exercises/${id}`)

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error(`Exercise with id '${id}' not found`)
		}
		if (response.status === 403) {
			throw new Error(`Exercise '${id}' is not available`)
		}
		throw new Error(
			`Failed to fetch exercise: ${response.status} ${response.statusText}`
		)
	}

	const data = await response.json()

	// Validate response with Valibot
	return validateWordFormExercise(data) as WordFormExercise
}

/**
 * Hook to get list of all available exercises
 */
export function useExercises() {
	return useQuery({
		queryKey: ['exercises'],
		queryFn: fetchExercises,
		staleTime: 30 * 60 * 1000, // 30 minutes
		gcTime: 60 * 60 * 1000, // 1 hour
		retry: 2,
		refetchOnWindowFocus: false
	})
}

/**
 * Hook to get specific exercise by ID
 */
export function useExercise(id: string | undefined) {
	return useQuery({
		queryKey: ['exercises', id],
		queryFn: () => {
			if (!id) {
				throw new Error('Exercise ID is required')
			}
			return fetchExercise(id)
		},
		enabled: Boolean(id),
		staleTime: 30 * 60 * 1000, // 30 minutes
		gcTime: 60 * 60 * 1000, // 1 hour
		retry: (failureCount, error) => {
			// Don't retry on 404 or 403 errors
			if (
				error.message.includes('not found') ||
				error.message.includes('not available')
			) {
				return false
			}
			return failureCount < 2
		},
		refetchOnWindowFocus: false
	})
}
