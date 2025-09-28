import type {UseQueryResult} from '@tanstack/react-query'
import {renderHook} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {WordFormExerciseJSON} from '@/entities/exercise'
import type {ExercisesListDto} from '@/schemas/exercises'
import {
	selectCustomExercises,
	useCustomExercisesStore
} from '@/stores/customExercises'
import {useExercises} from './useExercises'

const useQueryMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual<typeof import('@tanstack/react-query')>(
		'@tanstack/react-query'
	)

	return {
		...actual,
		useQuery: useQueryMock
	}
})

const baseMetadata: ExercisesListDto[number] = {
	id: 'builtin-1',
	type: 'word-form',
	language: 'el',
	title: 'Builtin exercise',
	description: 'Description',
	tags: ['verbs'],
	difficulty: 'a1',
	estimatedTimeMinutes: 5,
	totalBlocks: 1,
	totalCases: 1,
	enabled: true
}

const customExercise: WordFormExerciseJSON = {
	enabled: true,
	id: 'custom-1',
	type: 'word-form',
	language: 'el',
	title: 'Custom exercise',
	description: 'Custom description',
	tags: ['custom', 'verbs'],
	difficulty: 'a2',
	estimatedTimeMinutes: 10,
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
}

function mockQueryResult(data: ExercisesListDto | undefined) {
	useQueryMock.mockReturnValue({
		data,
		isLoading: !data,
		error: null
	} as UseQueryResult<ExercisesListDto, unknown>)
}

describe('useExercises', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		localStorage.clear()
		useCustomExercisesStore.setState({records: {}})
	})

	it('returns view model with builtin exercises when no custom entries', () => {
		mockQueryResult([baseMetadata])

		const {result} = renderHook(() => useExercises())

		expect(result.current.data).toBeDefined()
		const exercises = result.current.data?.exercises ?? []
		expect(exercises).toHaveLength(1)
		expect(exercises[0]?.id).toBe('builtin-1')
		expect(exercises[0]?.source).toBe('builtin')
	})

	it('includes custom exercises and marks them with source', () => {
		const {saveExercise} = useCustomExercisesStore.getState()
		saveExercise(customExercise)

		mockQueryResult([baseMetadata])

		const {result} = renderHook(() => useExercises())

		const exercises = result.current.data?.exercises ?? []
		expect(exercises).toHaveLength(2)
		expect(exercises[0]?.id).toBe('custom-1')
		expect(exercises[0]?.source).toBe('custom')
		expect(exercises[1]?.id).toBe('builtin-1')
	})

	it('prefers custom exercises when ids overlap', () => {
		const {saveExercise} = useCustomExercisesStore.getState()
		saveExercise({...customExercise, id: 'builtin-1', title: 'Override'})

		mockQueryResult([baseMetadata])

		const {result} = renderHook(() => useExercises())

		const exercises = result.current.data?.exercises ?? []
		expect(exercises).toHaveLength(1)
		expect(exercises[0]?.id).toBe('builtin-1')
		expect(exercises[0]?.title).toBe('Override')
		expect(exercises[0]?.source).toBe('custom')
		const stored = selectCustomExercises(useCustomExercisesStore.getState())
		expect(stored[0]?.id).toBe('builtin-1')
	})
})
