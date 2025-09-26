import {renderHook} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'

type QueryModule = typeof import('@tanstack/react-query')

const mockUseQuery = vi.fn()
const mockWordFormExerciseQueryOptions = vi.fn((id: string | undefined) => ({
	queryKey: ['exercise', id]
}))

vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual<QueryModule>('@tanstack/react-query')

	return {
		...actual,
		useQuery: mockUseQuery
	}
})

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
		mockWordFormExerciseQueryOptions.mockClear()
	})

	it('delegates to useQuery with library query options', async () => {
		const queryResult = {data: ['exercise-a']}
		mockUseQuery.mockReturnValue(queryResult)

		const {useExercises} = await loadModule()
		const {result, unmount} = renderHook(() => useExercises())

		expect(mockUseQuery).toHaveBeenCalledWith({
			queryKey: ['exercise-library']
		})
		expect(result.current).toBe(queryResult)

		unmount()
	})

	it('requests exercise data using identifier-specific query options', async () => {
		const queryResult = {data: {id: 'exercise-42'}}
		mockUseQuery.mockReturnValue(queryResult)

		const {useExercise} = await loadModule()
		const {result, unmount} = renderHook(() => useExercise('exercise-42'))

		expect(mockWordFormExerciseQueryOptions).toHaveBeenCalledWith('exercise-42')
		expect(mockUseQuery).toHaveBeenCalledWith({
			queryKey: ['exercise', 'exercise-42']
		})
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
})
