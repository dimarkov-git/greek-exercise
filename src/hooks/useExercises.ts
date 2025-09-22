import {useQuery} from '@tanstack/react-query'
import {HttpError, requestJson} from '@/api/httpClient'
import {
	validateExercisesList,
	validateWordFormExercise
} from '@/schemas/exercises'
import type {ExerciseMetadata, WordFormExercise} from '@/types/exercises'

/**
 * Fetch exercises list from API
 */
async function fetchExercises(): Promise<ExerciseMetadata[]> {
	const data = await requestJson<unknown>('/api/exercises')

	return validateExercisesList(data) as ExerciseMetadata[]
}

/**
 * Fetch specific exercise by ID
 */
async function fetchExercise(id: string): Promise<WordFormExercise> {
	try {
		const data = await requestJson<unknown>(`/api/exercises/${id}`)
		return validateWordFormExercise(data) as WordFormExercise
	} catch (error) {
		if (error instanceof HttpError) {
			if (error.status === 404) {
				throw new HttpError(`Exercise with id '${id}' not found`, {
					status: error.status,
					statusText: error.statusText,
					url: error.url,
					method: error.method,
					body: error.body
				})
			}

			if (error.status === 403) {
				throw new HttpError(`Exercise '${id}' is not available`, {
					status: error.status,
					statusText: error.statusText,
					url: error.url,
					method: error.method,
					body: error.body
				})
			}
		}

		throw error
	}
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
			if (
				error instanceof HttpError &&
				(error.status === 403 || error.status === 404)
			) {
				return false
			}

			return failureCount < 2
		},
		refetchOnWindowFocus: false
	})
}
