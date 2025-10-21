import {useQuery, useQueryClient} from '@tanstack/react-query'
import {useEffect, useMemo} from 'react'
import {createExerciseLibraryViewModel} from '../model/adapters'
import {
	customExerciseJsonToMetadata,
	wordFormExerciseJsonToExercise
} from '../model/custom'
import {
	type CustomExercisesState,
	selectCustomExercises,
	useCustomExercisesStore
} from '../model/custom-exercises-store'
import type {ExerciseLibraryViewModel} from '../model/domain-types'
import {exerciseLibraryQueryOptions, exerciseQueryOptions} from './queryOptions'

/**
 * Hook to get list of all available exercises with view-model metadata
 */
export function useExercises() {
	const customExercises = useCustomExercisesStore(selectCustomExercises)

	const customMetadata = useMemo(
		() => customExercises.map(customExerciseJsonToMetadata),
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
 *
 * Supports all exercise types (word-form, flashcard, etc.)
 * Also checks custom exercises store for user-created exercises.
 *
 * @param id - Exercise ID to fetch
 * @returns Query result with exercise data
 *
 * @example
 * ```typescript
 * const { data: exercise, isLoading } = useExercise('greek-nouns-flashcards-1')
 * if (exercise?.type === 'flashcard') {
 *   // Handle flashcard exercise
 * }
 * ```
 */
export function useExercise(id: string | undefined) {
	const baseOptions = useMemo(() => exerciseQueryOptions(id), [id])
	const selectExercise = useMemo(
		() => (state: CustomExercisesState) =>
			id ? state.records[id]?.exercise : undefined,
		[id]
	)
	const customExerciseJson = useCustomExercisesStore(selectExercise)
	const customExercise = useMemo(() => {
		if (!customExerciseJson) {
			return
		}

		// For custom exercises, just return them with defaults already applied from the store
		// The store already has normalized data with defaults
		if (customExerciseJson.type === 'word-form') {
			return wordFormExerciseJsonToExercise(customExerciseJson)
		}

		// For flashcard and other types, the JSON is already in the correct format
		return customExerciseJson
	}, [customExerciseJson])
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
