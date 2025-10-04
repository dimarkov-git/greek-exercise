import {queryOptions} from '@tanstack/react-query'
import {
	validateExercisesList,
	validateFlashcardExercise,
	validateMultipleChoiceExercise,
	validateWordFormExercise
} from '@/entities/exercise'
import {HttpError, requestJson} from '@/shared/api'
import {
	toFlashcardExerciseWithDefaults,
	toMultipleChoiceExerciseWithDefaults,
	toWordFormExerciseWithDefaults
} from '../model/adapters'

const THIRTY_MINUTES = 30 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000

export const exerciseLibraryQueryOptions = queryOptions({
	queryKey: ['exercises', 'library'],
	queryFn: async () => {
		const data = await requestJson<unknown>('/api/exercises')
		return validateExercisesList(data)
	},
	staleTime: THIRTY_MINUTES,
	gcTime: ONE_HOUR,
	retry: 2,
	refetchOnWindowFocus: false
})

/**
 * Universal exercise query options that supports all exercise types
 *
 * Automatically detects the exercise type and applies the correct validator and adapter.
 * Supports word-form, flashcard, and future exercise types.
 *
 * @param id - Exercise ID to fetch
 * @returns Query options for TanStack Query
 *
 * @example
 * ```typescript
 * const options = exerciseQueryOptions('greek-nouns-flashcards-1')
 * const { data } = useQuery(options)
 * ```
 */
export function exerciseQueryOptions(id: string | undefined) {
	return queryOptions({
		queryKey: ['exercises', id ?? ''],
		queryFn: async () => {
			if (!id) {
				throw new Error('Exercise ID is required')
			}

			const data = await requestJson<unknown>(`/api/exercises/${id}`)

			// Detect exercise type and apply correct validator + adapter
			const exerciseType = (data as {type?: string})?.type

			if (exerciseType === 'flashcard') {
				const parsed = validateFlashcardExercise(data)
				return toFlashcardExerciseWithDefaults(parsed)
			}

			if (exerciseType === 'word-form') {
				const parsed = validateWordFormExercise(data)
				return toWordFormExerciseWithDefaults(parsed)
			}

			if (exerciseType === 'multiple-choice') {
				const parsed = validateMultipleChoiceExercise(data)
				return toMultipleChoiceExerciseWithDefaults(parsed)
			}

			throw new Error(
				`Unsupported exercise type: ${exerciseType}. Supported types: word-form, flashcard, multiple-choice`
			)
		},
		retry: (failureCount: number, error: unknown) => {
			if (
				error instanceof HttpError &&
				(error.status === 403 || error.status === 404)
			) {
				return false
			}

			return failureCount < 2
		},
		staleTime: THIRTY_MINUTES,
		gcTime: ONE_HOUR,
		refetchOnWindowFocus: false,
		enabled: Boolean(id)
	})
}

/**
 * @deprecated Use `exerciseQueryOptions` instead for better type support
 *
 * This function is kept for backwards compatibility only.
 * It only supports word-form exercises.
 */
export function wordFormExerciseQueryOptions(id: string | undefined) {
	return queryOptions({
		queryKey: ['exercises', 'word-form', id ?? ''],
		queryFn: async () => {
			if (!id) {
				throw new Error('Exercise ID is required')
			}

			const data = await requestJson<unknown>(`/api/exercises/${id}`)
			const parsed = validateWordFormExercise(data)
			return toWordFormExerciseWithDefaults(parsed)
		},
		retry: (failureCount: number, error: unknown) => {
			if (
				error instanceof HttpError &&
				(error.status === 403 || error.status === 404)
			) {
				return false
			}

			return failureCount < 2
		},
		staleTime: THIRTY_MINUTES,
		gcTime: ONE_HOUR,
		refetchOnWindowFocus: false,
		enabled: Boolean(id)
	})
}
