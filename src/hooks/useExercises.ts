import {useQuery} from '@tanstack/react-query'
import {
	exerciseLibraryQueryOptions,
	wordFormExerciseQueryOptions
} from '@/domain/exercises/queryOptions'

/**
 * Hook to get list of all available exercises with view-model metadata
 */
export function useExercises() {
	return useQuery(exerciseLibraryQueryOptions)
}

/**
 * Hook to get specific exercise by ID
 */
export function useExercise(id: string | undefined) {
	return useQuery(wordFormExerciseQueryOptions(id))
}
