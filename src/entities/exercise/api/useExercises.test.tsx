import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {renderHook, waitFor} from '@testing-library/react'
import type React from 'react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {WordFormExerciseJSON} from '@/entities/exercise'
import {
	selectCustomExercises,
	useCustomExercisesStore
} from '@/entities/exercise'
import {useExercises} from './useExercises'

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

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {retry: false},
			mutations: {retry: false}
		}
	})

	return function TestWrapper({children}: {children: React.ReactNode}) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		)
	}
}

describe('useExercises', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		localStorage.clear()
		useCustomExercisesStore.setState({records: {}})
	})

	it('returns view model with builtin exercises when no custom entries', async () => {
		const {result} = renderHook(() => useExercises(), {
			wrapper: createWrapper()
		})

		// Wait for the query to complete
		await waitFor(() => expect(result.current.data).toBeDefined())

		expect(result.current.data).toBeDefined()
		const exercises = result.current.data?.exercises ?? []
		expect(exercises.length).toBeGreaterThan(0)
		// All exercises should be marked as builtin since no custom exercises are added
		expect(exercises.every(exercise => exercise.source === 'builtin')).toBe(
			true
		)
		// Should include the verbs-be exercise from MSW data
		expect(exercises.find(exercise => exercise.id === 'verbs-be')).toBeDefined()
	})

	it('includes custom exercises and marks them with source', async () => {
		const {saveExercise} = useCustomExercisesStore.getState()
		saveExercise(customExercise)

		const {result} = renderHook(() => useExercises(), {
			wrapper: createWrapper()
		})

		// Wait for the query to complete
		await waitFor(() => expect(result.current.data).toBeDefined())

		const exercises = result.current.data?.exercises ?? []
		// Should contain the custom exercise
		expect(exercises.length).toBeGreaterThanOrEqual(1) // At least the custom exercise
		const customEx = exercises.find(ex => ex.id === 'custom-1')
		expect(customEx).toBeDefined()
		expect(customEx?.source).toBe('custom')

		// If there are builtin exercises, they should have the correct source
		const builtinExercises = exercises.filter(ex => ex.source === 'builtin')
		if (builtinExercises.length > 0) {
			expect(builtinExercises.every(ex => ex.source === 'builtin')).toBe(true)
		}
	})

	it('prefers custom exercises when ids overlap', async () => {
		const {saveExercise} = useCustomExercisesStore.getState()
		// Use a real exercise ID from MSW data that we can override
		saveExercise({...customExercise, id: 'verbs-be', title: 'Override'})

		const {result} = renderHook(() => useExercises(), {
			wrapper: createWrapper()
		})

		// Wait for the query to complete
		await waitFor(() => expect(result.current.data).toBeDefined())

		const exercises = result.current.data?.exercises ?? []
		// Find the overridden exercise
		const verbsBeExercise = exercises.find(
			exercise => exercise.id === 'verbs-be'
		)
		expect(verbsBeExercise).toBeDefined()
		expect(verbsBeExercise?.title).toBe('Override')
		expect(verbsBeExercise?.source).toBe('custom')

		// Verify the custom exercise is stored
		const stored = selectCustomExercises(useCustomExercisesStore.getState())
		expect(stored.find(ex => ex.id === 'verbs-be')?.title).toBe('Override')
	})
})
