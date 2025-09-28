import {queryOptions} from '@tanstack/react-query'
import {
	validateExercisesList,
	validateWordFormExercise
} from '@/entities/exercise'
import {HttpError, requestJson} from '@/shared/api'
import {toWordFormExerciseWithDefaults} from '../model/adapters'

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
