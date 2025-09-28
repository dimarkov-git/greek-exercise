import {useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import {createExerciseLibraryViewModel} from '@/domain/exercises/adapters'
import {wordFormExerciseJsonToMetadata} from '@/domain/exercises/custom'
import {
	exerciseLibraryQueryOptions,
	wordFormExerciseQueryOptions
} from '@/domain/exercises/queryOptions'
import type {ExerciseLibraryViewModel} from '@/domain/exercises/types'
import {
	selectCustomExercises,
	useCustomExercisesStore
} from '@/stores/customExercises'

/**
 * Hook to get list of all available exercises with view-model metadata
 */
export function useExercises() {
	const customExercises = useCustomExercisesStore(selectCustomExercises)

	const customMetadata = useMemo(
		() => customExercises.map(wordFormExerciseJsonToMetadata),
		[customExercises]
	)

	const customIds = useMemo(
		() => new Set(customMetadata.map(metadata => metadata.id)),
		[customMetadata]
	)

	const queryResult = useQuery(exerciseLibraryQueryOptions)

	const combinedViewModel = useMemo<
		ExerciseLibraryViewModel | undefined
	>(() => {
		const remoteMetadata = queryResult.data

		if (!remoteMetadata && customMetadata.length === 0) {
			return
		}

		const filteredRemote = (remoteMetadata ?? []).filter(
			metadata => !customIds.has(metadata.id)
		)

		const combinedMetadata = [...customMetadata, ...filteredRemote]

		const viewModel = createExerciseLibraryViewModel(combinedMetadata)

		return {
			...viewModel,
			exercises: viewModel.exercises.map(exercise => ({
				...exercise,
				source: customIds.has(exercise.id) ? 'custom' : 'builtin'
			}))
		}
	}, [customIds, customMetadata, queryResult.data])

	return {
		...queryResult,
		data: combinedViewModel
	}
}

/**
 * Hook to get specific exercise by ID
 */
export function useExercise(id: string | undefined) {
	return useQuery(wordFormExerciseQueryOptions(id))
}
