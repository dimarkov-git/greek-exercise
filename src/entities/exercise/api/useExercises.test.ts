import {renderHook} from '@testing-library/react'
import {QueryClientProvider} from '@tanstack/react-query'
import React from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {queryClient} from '@/shared/lib/test-utils'
import {useCustomExercisesStore} from '@/shared/model'

const useQueryMock = vi.hoisted(() => vi.fn())
const mockSetQueryData = vi.fn()
const mockWordFormExerciseQueryOptions = vi.fn((id: string | undefined) => ({
	queryKey: ['exercise', id],
	enabled: Boolean(id)
}))
const mockCreateExerciseLibraryViewModel = vi.fn(() => ({exercises: []}))

vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual<typeof import('@tanstack/react-query')>(
		'@tanstack/react-query'
	)

	return {
		...actual,
		useQuery: useQueryMock,
		useQueryClient: () => ({setQueryData: mockSetQueryData})
	}
})

vi.mock('@/entities/exercise/model/adapters', () => ({
	createExerciseLibraryViewModel: mockCreateExerciseLibraryViewModel
}))

vi.mock('@/entities/exercise/model/custom', () => ({
	wordFormExerciseJsonToMetadata: vi.fn(),
	wordFormExerciseJsonToExercise: vi.fn(exercise => exercise)
}))

vi.mock('@/entities/exercise/api/queryOptions', () => ({
	exerciseLibraryQueryOptions: {queryKey: ['exercise-library']} as const,
	wordFormExerciseQueryOptions: mockWordFormExerciseQueryOptions
}))

function createWrapper() {
	return function TestWrapper({children}: {children: React.ReactNode}) {
		return React.createElement(QueryClientProvider, {client: queryClient}, children)
	}
}

describe('useExercises', () => {
	afterEach(() => {
		useQueryMock.mockReset()
		mockSetQueryData.mockReset()
		mockWordFormExerciseQueryOptions.mockClear()
		queryClient.clear()
		useCustomExercisesStore.getState().clearExercises()
		localStorage.clear()
	})

	it('delegates to useQuery with library query options', async () => {
		const queryResult = {data: ['exercise-a']}
		useQueryMock.mockReturnValue(queryResult)

		const {useExercises} = await import('./useExercises')
		const {result, unmount} = renderHook(() => useExercises(), {
			wrapper: createWrapper()
		})

		expect(useQueryMock).toHaveBeenCalledWith({
			queryKey: ['exercise-library']
		})
		expect(mockCreateExerciseLibraryViewModel).toHaveBeenCalledWith([
			'exercise-a'
		])
		expect(result.current.data).toMatchObject({exercises: []})

		unmount()
	})

	it('requests exercise data using identifier-specific query options', async () => {
		const queryResult = {data: {id: 'exercise-42'}}
		useQueryMock.mockReturnValue(queryResult)

		const {useExercise} = await import('./useExercises')
		const {result, unmount} = renderHook(() => useExercise('exercise-42'), {
			wrapper: createWrapper()
		})

		expect(mockWordFormExerciseQueryOptions).toHaveBeenCalledWith('exercise-42')
		expect(useQueryMock).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: ['exercise', 'exercise-42'],
				enabled: true
			})
		)
		expect(mockSetQueryData).not.toHaveBeenCalled()
		expect(result.current).toBe(queryResult)

		unmount()
	})

	it('passes undefined ids through to the query option factory', async () => {
		const queryResult = {data: null}
		useQueryMock.mockReturnValue(queryResult)

		const {useExercise} = await import('./useExercises')
		const {result, unmount} = renderHook(() => useExercise(undefined), {
			wrapper: createWrapper()
		})

		expect(mockWordFormExerciseQueryOptions).toHaveBeenCalledWith(undefined)
		expect(result.current).toBe(queryResult)

		unmount()
	})

	it('uses custom exercises from the store when available', async () => {
		const {saveExercise} = useCustomExercisesStore.getState()
		saveExercise({
			enabled: true,
			id: 'exercise-42',
			type: 'word-form',
			language: 'el',
			title: 'Custom title',
			description: 'Custom description',
			tags: ['verbs'],
			difficulty: 'a1',
			estimatedTimeMinutes: 5,
			settings: {
				autoAdvance: true,
				autoAdvanceDelayMs: 1500,
				allowSkip: false,
				shuffleCases: false
			},
			blocks: [
				{
					id: 'block-1',
					name: 'Block',
					cases: [
						{
							id: 'case-1',
							prompt: 'prompt',
							correct: ['answer']
						}
					]
				}
			]
		})

		const queryResult = {data: null}
		useQueryMock.mockReturnValue(queryResult)

		const {useExercise} = await import('./useExercises')
		const {result, unmount} = renderHook(() => useExercise('exercise-42'), {
			wrapper: createWrapper()
		})

		expect(useQueryMock).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: ['exercise', 'exercise-42'],
				enabled: false,
				initialData: expect.objectContaining({id: 'exercise-42'})
			})
		)
		expect(mockSetQueryData).toHaveBeenCalledWith(
			['exercise', 'exercise-42'],
			expect.objectContaining({id: 'exercise-42'})
		)
		expect(result.current).toBe(queryResult)

		unmount()
	})
})
