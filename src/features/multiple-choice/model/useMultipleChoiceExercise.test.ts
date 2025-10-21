/**
 * useMultipleChoiceExercise hook tests
 */

import {act, renderHook, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import type {MultipleChoiceExercise} from './types'
import {useMultipleChoiceExercise} from './useMultipleChoiceExercise'

const mockExercise: MultipleChoiceExercise = {
	enabled: true,
	id: 'test-exercise',
	type: 'multiple-choice',
	language: 'el',
	title: 'Test Exercise',
	description: 'Test',
	tags: [],
	difficulty: 'a1',
	settings: {
		autoAdvance: false,
		autoAdvanceDelayMs: 300,
		allowSkip: true,
		shuffleQuestions: false,
		shuffleAnswers: false
	},
	questions: [
		{
			id: 'q1',
			text: 'Question 1',
			options: [
				{id: 'o1', text: 'Correct'},
				{id: 'o2', text: 'Wrong'}
			],
			correctOptionId: 'o1'
		},
		{
			id: 'q2',
			text: 'Question 2',
			options: [
				{id: 'o3', text: 'Wrong'},
				{id: 'o4', text: 'Correct'}
			],
			correctOptionId: 'o4'
		}
	]
}

describe('useMultipleChoiceExercise', () => {
	it('initializes with first question', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		expect(result.current.state.currentQuestion?.id).toBe('q1')
		expect(result.current.state.progress.current).toBe(1)
		expect(result.current.state.progress.total).toBe(2)
	})

	it('allows selecting an option', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		act(() => {
			result.current.handleSelectOption('o1')
		})

		expect(result.current.state.selectedOptionId).toBe('o1')
	})

	it('checks answer correctly', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		act(() => {
			result.current.handleSelectOption('o1')
		})

		act(() => {
			result.current.handleCheckAnswer()
		})

		expect(result.current.state.isCorrect).toBe(true)
		expect(result.current.state.stats.correct).toBe(1)
	})

	it('checks answer incorrectly', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		act(() => {
			result.current.handleSelectOption('o2')
		})

		act(() => {
			result.current.handleCheckAnswer()
		})

		expect(result.current.state.isCorrect).toBe(false)
		expect(result.current.state.stats.incorrect).toBe(1)
	})

	it('advances to next question', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		act(() => {
			result.current.handleSelectOption('o1')
			result.current.handleCheckAnswer()
		})

		act(() => {
			result.current.handleAdvance()
		})

		expect(result.current.state.currentQuestion?.id).toBe('q2')
		expect(result.current.state.progress.current).toBe(2)
	})

	it('allows skipping questions', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		act(() => {
			result.current.handleSkip()
		})

		expect(result.current.state.currentQuestion?.id).toBe('q2')
		expect(result.current.state.stats.skipped).toBe(1)
	})

	it('completes exercise after all questions', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		// Answer first question
		act(() => {
			result.current.handleSelectOption('o1')
			result.current.handleCheckAnswer()
			result.current.handleAdvance()
		})

		// Answer second question
		act(() => {
			result.current.handleSelectOption('o4')
			result.current.handleCheckAnswer()
			result.current.handleAdvance()
		})

		expect(result.current.state.status).toBe('COMPLETED')
	})

	it('calls onComplete with results', async () => {
		const onComplete = vi.fn()
		const {result} = renderHook(() =>
			useMultipleChoiceExercise(mockExercise, onComplete)
		)

		// Complete the exercise (answer and advance through all questions)
		// Question 1
		act(() => {
			result.current.handleSelectOption('o1')
		})

		act(() => {
			result.current.handleCheckAnswer()
		})

		act(() => {
			result.current.handleAdvance()
		})

		// Question 2
		act(() => {
			result.current.handleSelectOption('o4')
		})

		act(() => {
			result.current.handleCheckAnswer()
		})

		act(() => {
			result.current.handleAdvance()
		})

		// Wait for completion effect to run
		await waitFor(() => {
			expect(onComplete).toHaveBeenCalled()
		})

		// Verify stats were tracked
		const call = onComplete.mock.calls[0]?.[0]
		expect(call).toMatchObject({
			exerciseId: 'test-exercise',
			totalCases: 2
		})
		expect(call.correctAnswers + call.incorrectAnswers).toBe(2)
	})

	it('allows restarting exercise', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		// Complete exercise
		act(() => {
			result.current.handleSelectOption('o1')
			result.current.handleCheckAnswer()
			result.current.handleAdvance()

			result.current.handleSelectOption('o4')
			result.current.handleCheckAnswer()
			result.current.handleAdvance()
		})

		// Restart
		act(() => {
			result.current.handleRestart()
		})

		expect(result.current.state.status).not.toBe('COMPLETED')
		expect(result.current.state.currentQuestion?.id).toBe('q1')
		expect(result.current.state.stats.correct).toBe(0)
	})

	it('toggles hint', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		expect(result.current.state.showHint).toBe(false)

		act(() => {
			result.current.handleToggleHint()
		})

		expect(result.current.state.showHint).toBe(true)

		act(() => {
			result.current.handleToggleHint()
		})

		expect(result.current.state.showHint).toBe(false)
	})

	it('toggles auto-advance', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		expect(result.current.state.autoAdvanceEnabled).toBe(false)

		act(() => {
			result.current.handleToggleAutoAdvance()
		})

		expect(result.current.state.autoAdvanceEnabled).toBe(true)
	})

	it('updates settings', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		expect(result.current.state.autoAdvanceEnabled).toBe(false)

		act(() => {
			result.current.handleSettingsChange({autoAdvance: true})
		})

		// Should update auto-advance setting
		expect(result.current.state.autoAdvanceEnabled).toBe(true)
	})

	it('cannot submit without selecting option', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		expect(result.current.state.canSubmit).toBe(false)
	})

	it('can submit after selecting option', () => {
		const {result} = renderHook(() => useMultipleChoiceExercise(mockExercise))

		act(() => {
			result.current.handleSelectOption('o1')
		})

		expect(result.current.state.canSubmit).toBe(true)
	})
})
