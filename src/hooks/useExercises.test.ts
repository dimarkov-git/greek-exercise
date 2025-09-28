import {renderHook} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {useCustomExercisesStore} from '@/shared/model'

type QueryModule = typeof import('@tanstack/react-query')

const mockUseQuery = vi.fn()
const mockSetQueryData = vi.fn()
const mockUseQueryClient = vi.fn(() => ({setQueryData: mockSetQueryData}))
const mockWordFormExerciseQueryOptions = vi.fn((id: string | undefined) => ({
	queryKey: ['exercise', id],
	enabled: Boolean(id)
}))
const mockCreateExerciseLibraryViewModel = vi.fn(() => ({exercises: []}))

vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual<QueryModule>('@tanstack/react-query')

	return {
		...actual,
		useQuery: mockUseQuery,
		useQueryClient: mockUseQueryClient
	}
})

vi.mock('@/domain/exercises/adapters', () => ({
	createExerciseLibraryViewModel: mockCreateExerciseLibraryViewModel
}))

vi.mock('@/domain/exercises/custom', () => ({
	wordFormExerciseJsonToMetadata: vi.fn(),
	wordFormExerciseJsonToExercise: vi.fn(exercise => exercise)
}))

vi.mock('@/domain/exercises/queryOptions', () => ({
	exerciseLibraryQueryOptions: {queryKey: ['exercise-library']} as const,
	wordFormExerciseQueryOptions: mockWordFormExerciseQueryOptions
}))

async function loadModule() {
	const module = await import('@/hooks/useExercises')
	return module
}

describe('useExercises', () => {
	afterEach(() => {
		mockUseQuery.mockReset()
		mockUseQueryClient.mockClear()
		mockSetQueryData.mockReset()
		mockWordFormExerciseQueryOptions.mockClear()
		useCustomExercisesStore.getState().clearExercises()
		localStorage.clear()
	})

	it('delegates to useQuery with library query options', async () => {
		const queryResult = {data: ['exercise-a']}
		mockUseQuery.mockReturnValue(queryResult)

		const {useExercises} = await loadModule()
		const {result, unmount} = renderHook(() => useExercises())

		expect(mockUseQuery).toHaveBeenCalledWith({
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
		mockUseQuery.mockReturnValue(queryResult)

		const {useExercise} = await loadModule()
		const {result, unmount} = renderHook(() => useExercise('exercise-42'))

		expect(mockWordFormExerciseQueryOptions).toHaveBeenCalledWith('exercise-42')
		expect(mockUseQuery).toHaveBeenCalledWith(
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
		mockUseQuery.mockReturnValue(queryResult)

		const {useExercise} = await loadModule()
		const {result, unmount} = renderHook(() => useExercise(undefined))

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
		mockUseQuery.mockReturnValue(queryResult)

		const {useExercise} = await loadModule()
		const {result, unmount} = renderHook(() => useExercise('exercise-42'))

		expect(mockUseQuery).toHaveBeenCalledWith(
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
