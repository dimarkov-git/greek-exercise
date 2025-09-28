import type {QueryFunctionContext} from '@tanstack/react-query'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import * as httpClientModule from '@/api/httpClient'
import * as schemaModule from '@/schemas/exercises'
import * as adaptersModule from './adapters'
import {
	exerciseLibraryQueryOptions,
	wordFormExerciseQueryOptions
} from './queryOptions'

const requestJsonMock = vi.spyOn(httpClientModule, 'requestJson')
const validateExercisesListMock = vi.spyOn(
	schemaModule,
	'validateExercisesList'
)
const validateWordFormExerciseMock = vi.spyOn(
	schemaModule,
	'validateWordFormExercise'
)
const toWordFormExerciseWithDefaultsMock = vi.spyOn(
	adaptersModule,
	'toWordFormExerciseWithDefaults'
)

const {HttpError} = httpClientModule

function createQueryContext<TQueryKey extends readonly unknown[]>(
	queryKey: TQueryKey
): QueryFunctionContext<TQueryKey> {
	return {
		queryKey,
		signal: new AbortController().signal
	} as QueryFunctionContext<TQueryKey>
}

const resetWordFormMocks = () => {
	requestJsonMock.mockReset()
	validateWordFormExerciseMock.mockReset()
	toWordFormExerciseWithDefaultsMock.mockReset()
}

describe('exerciseLibraryQueryOptions', () => {
	beforeEach(() => {
		requestJsonMock.mockReset()
		validateExercisesListMock.mockReset()
	})

	it('fetches and validates exercise library data', async () => {
		const rawResponse = {data: 'library'}
		const parsed = [] as ReturnType<typeof schemaModule.validateExercisesList>
		requestJsonMock.mockResolvedValue(rawResponse)
		validateExercisesListMock.mockReturnValue(parsed)

		const queryFn = exerciseLibraryQueryOptions.queryFn
		expect(queryFn).toBeDefined()

		const result = await queryFn?.(
			createQueryContext(exerciseLibraryQueryOptions.queryKey)
		)

		expect(requestJsonMock).toHaveBeenCalledWith('/api/exercises')
		expect(validateExercisesListMock).toHaveBeenCalledWith(rawResponse)
		expect(result).toBe(parsed)
	})

	it('exposes configuration tuned for long-lived exercise data', () => {
		expect(exerciseLibraryQueryOptions.queryKey).toEqual([
			'exercises',
			'library'
		])
		expect(exerciseLibraryQueryOptions.staleTime).toBe(30 * 60 * 1000)
		expect(exerciseLibraryQueryOptions.gcTime).toBe(60 * 60 * 1000)
		expect(exerciseLibraryQueryOptions.retry).toBe(2)
		expect(exerciseLibraryQueryOptions.refetchOnWindowFocus).toBe(false)
	})
})

describe('wordFormExerciseQueryOptions query function', () => {
	beforeEach(resetWordFormMocks)

	it('throws when exercise id is missing', async () => {
		const options = wordFormExerciseQueryOptions(undefined)

		await expect(
			options.queryFn?.(createQueryContext(options.queryKey))
		).rejects.toThrow('Exercise ID is required')
		expect(options.enabled).toBe(false)
	})

	it('fetches, validates, and normalizes a word-form exercise', async () => {
		const options = wordFormExerciseQueryOptions('exercise-123')
		const rawExercise = {id: 'exercise-123'}
		const validatedExercise = {
			id: 'exercise-123',
			title: 'Title',
			description: 'Description',
			enabled: true,
			type: 'word-form',
			language: 'el',
			blocks: [],
			tags: [],
			difficulty: 'a1',
			estimatedTimeMinutes: 5,
			settings: {
				allowSkip: true,
				autoAdvance: true,
				autoAdvanceDelayMs: 1000,
				shuffleCases: false
			}
		} as ReturnType<typeof schemaModule.validateWordFormExercise>
		const normalizedExercise = {
			...validatedExercise,
			settings: {
				allowSkip: true,
				autoAdvance: true,
				autoAdvanceDelayMs: 1000,
				shuffleCases: false
			}
		} as ReturnType<typeof adaptersModule.toWordFormExerciseWithDefaults>

		requestJsonMock.mockResolvedValue(rawExercise)
		validateWordFormExerciseMock.mockReturnValue(validatedExercise)
		toWordFormExerciseWithDefaultsMock.mockReturnValue(normalizedExercise)

		const result = await options.queryFn?.(createQueryContext(options.queryKey))

		expect(requestJsonMock).toHaveBeenCalledWith('/api/exercises/exercise-123')
		expect(validateWordFormExerciseMock).toHaveBeenCalledWith(rawExercise)
		expect(toWordFormExerciseWithDefaultsMock).toHaveBeenCalledWith(
			validatedExercise
		)
		expect(result).toBe(normalizedExercise)
		expect(options.enabled).toBe(true)
	})
})

describe('wordFormExerciseQueryOptions retry behaviour', () => {
	beforeEach(resetWordFormMocks)

	it('disables retries for forbidden or missing exercises', () => {
		const options = wordFormExerciseQueryOptions('exercise-123')
		const retryFn = options.retry

		if (typeof retryFn !== 'function') {
			throw new Error('Expected retry to be a function')
		}

		const forbiddenError = new HttpError('Forbidden', {
			status: 403,
			statusText: 'Forbidden',
			url: '/api/exercises/exercise-123',
			method: 'GET'
		})
		const notFoundError = new HttpError('Not Found', {
			status: 404,
			statusText: 'Not Found',
			url: '/api/exercises/exercise-123',
			method: 'GET'
		})
		const serverError = new HttpError('Server Error', {
			status: 500,
			statusText: 'Server Error',
			url: '/api/exercises/exercise-123',
			method: 'GET'
		})

		expect(retryFn(0, forbiddenError)).toBe(false)
		expect(retryFn(1, notFoundError)).toBe(false)
		expect(retryFn(0, serverError)).toBe(true)
		expect(retryFn(1, new Error('Network failure'))).toBe(true)
		expect(retryFn(2, new Error('Network failure'))).toBe(false)
	})
})

describe('wordFormExerciseQueryOptions configuration', () => {
	beforeEach(resetWordFormMocks)

	it('shares cache configuration with the library query', () => {
		const options = wordFormExerciseQueryOptions('exercise-456')

		expect(options.staleTime).toBe(30 * 60 * 1000)
		expect(options.gcTime).toBe(60 * 60 * 1000)
		expect(options.refetchOnWindowFocus).toBe(false)
	})
})

afterAll(() => {
	requestJsonMock.mockRestore()
	validateExercisesListMock.mockRestore()
	validateWordFormExerciseMock.mockRestore()
	toWordFormExerciseWithDefaultsMock.mockRestore()
})
