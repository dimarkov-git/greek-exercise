import {useQuery, useQueryClient} from '@tanstack/react-query'
import {useEffect, useMemo} from 'react'
import {
	createExerciseLibraryViewModel,
	type ExerciseLibraryViewModel,
	exerciseLibraryQueryOptions,
	wordFormExerciseJsonToExercise,
	wordFormExerciseJsonToMetadata,
	wordFormExerciseQueryOptions
} from '@/entities/exercise'
import type {CustomExercisesState} from '@/shared/model'
import {selectCustomExercises, useCustomExercisesStore} from '@/shared/model'

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
	const baseOptions = useMemo(() => wordFormExerciseQueryOptions(id), [id])
	const selectExercise = useMemo(
		() => (state: CustomExercisesState) =>
			id ? state.records[id]?.exercise : undefined,
		[id]
	)
	const customExerciseJson = useCustomExercisesStore(selectExercise)
	const customExercise = useMemo(
		() =>
			customExerciseJson
				? wordFormExerciseJsonToExercise(customExerciseJson)
				: undefined,
		[customExerciseJson]
	)
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!(id && customExercise)) {
			return
		}

		queryClient.setQueryData(baseOptions.queryKey, customExercise)
	}, [baseOptions, customExercise, id, queryClient])

	const queryOptions = useMemo(() => {
		if (customExercise) {
			return {
				...baseOptions,
				enabled: false as const,
				initialData: customExercise
			}
		}

		return {
			...baseOptions,
			enabled: Boolean(id)
		}
	}, [baseOptions, customExercise, id])

	return useQuery(queryOptions)
}
