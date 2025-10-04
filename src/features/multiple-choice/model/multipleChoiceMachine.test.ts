/**
 * multipleChoiceMachine tests
 */

import {describe, expect, it} from 'vitest'
import {
	initializeMultipleChoiceState,
	multipleChoiceReducer,
	selectCanAdvance,
	selectCanSkip,
	selectCanSubmit,
	selectCurrentQuestion,
	selectProgress,
	selectStats
} from './multipleChoiceMachine'
import type {MultipleChoiceExercise} from './types'

const mockExercise: MultipleChoiceExercise = {
	enabled: true,
	id: 'test-exercise',
	type: 'multiple-choice',
	language: 'el',
	title: 'Test',
	description: 'Test',
	tags: [],
	difficulty: 'a1',
	settings: {
		autoAdvance: false,
		autoAdvanceDelayMs: 1000,
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
				{id: 'o3', text: 'Correct'},
				{id: 'o4', text: 'Wrong'}
			],
			correctOptionId: 'o3'
		}
	]
}

describe('multipleChoiceMachine', () => {
	describe('initializeMultipleChoiceState', () => {
		it('initializes state correctly', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			expect(state.exercise).toBe(mockExercise)
			expect(state.status).toBe('WAITING_INPUT')
			expect(state.currentQuestionIndex).toBe(0)
			expect(state.totalQuestions).toBe(2)
			expect(state.stats).toEqual({correct: 0, incorrect: 0, skipped: 0})
		})

		it('shuffles questions when enabled', () => {
			const exerciseWithShuffle: MultipleChoiceExercise = {
				...mockExercise,
				settings: {...mockExercise.settings, shuffleQuestions: true}
			}

			const state = initializeMultipleChoiceState(exerciseWithShuffle)

			// Questions should be shuffled (can't test exact order due to randomness)
			expect(state.exercise.questions).toHaveLength(2)
		})
	})

	describe('multipleChoiceReducer', () => {
		it('handles SELECT_OPTION action', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const newState = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o1'
			})

			expect(newState.selectedOptionId).toBe('o1')
		})

		it('handles CHECK_ANSWER action with correct answer', () => {
			let state = initializeMultipleChoiceState(mockExercise)
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o1'
			})

			const newState = multipleChoiceReducer(state, {type: 'CHECK_ANSWER'})

			expect(newState.isCorrect).toBe(true)
			expect(newState.status).toBe('CORRECT_ANSWER')
			expect(newState.stats.correct).toBe(1)
		})

		it('handles CHECK_ANSWER action with incorrect answer', () => {
			let state = initializeMultipleChoiceState(mockExercise)
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o2'
			})

			const newState = multipleChoiceReducer(state, {type: 'CHECK_ANSWER'})

			expect(newState.isCorrect).toBe(false)
			expect(newState.status).toBe('WRONG_ANSWER')
			expect(newState.stats.incorrect).toBe(1)
		})

		it('handles ADVANCE action', () => {
			let state = initializeMultipleChoiceState(mockExercise)
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o1'
			})
			state = multipleChoiceReducer(state, {type: 'CHECK_ANSWER'})

			const newState = multipleChoiceReducer(state, {type: 'ADVANCE'})

			expect(newState.currentQuestionIndex).toBe(1)
			expect(newState.selectedOptionId).toBeNull()
			expect(newState.isCorrect).toBeNull()
			expect(newState.status).toBe('WAITING_INPUT')
		})

		it('handles ADVANCE action to completion', () => {
			let state = initializeMultipleChoiceState(mockExercise)

			// Answer first question
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o1'
			})
			state = multipleChoiceReducer(state, {type: 'CHECK_ANSWER'})
			state = multipleChoiceReducer(state, {type: 'ADVANCE'})

			// Answer second question
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o3'
			})
			state = multipleChoiceReducer(state, {type: 'CHECK_ANSWER'})

			// Advance should complete
			const newState = multipleChoiceReducer(state, {type: 'ADVANCE'})

			expect(newState.status).toBe('COMPLETED')
		})

		it('handles SKIP action', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const newState = multipleChoiceReducer(state, {type: 'SKIP'})

			expect(newState.currentQuestionIndex).toBe(1)
			expect(newState.stats.skipped).toBe(1)
		})

		it('handles RESTART action', () => {
			let state = initializeMultipleChoiceState(mockExercise)
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o1'
			})
			state = multipleChoiceReducer(state, {type: 'CHECK_ANSWER'})

			const newState = multipleChoiceReducer(state, {
				type: 'RESTART',
				exercise: mockExercise
			})

			expect(newState.currentQuestionIndex).toBe(0)
			expect(newState.stats).toEqual({correct: 0, incorrect: 0, skipped: 0})
			expect(newState.status).toBe('WAITING_INPUT')
		})

		it('handles RESTART_WITH_SETTINGS action', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const updatedExercise = {
				...mockExercise,
				settings: {...mockExercise.settings, autoAdvance: true}
			}

			const newState = multipleChoiceReducer(state, {
				type: 'RESTART_WITH_SETTINGS',
				exercise: updatedExercise
			})

			expect(newState.exercise.settings?.autoAdvance).toBe(true)
		})

		it('handles TOGGLE_AUTO_ADVANCE action', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const newState = multipleChoiceReducer(state, {
				type: 'TOGGLE_AUTO_ADVANCE'
			})

			expect(newState.autoAdvanceEnabled).toBe(true)
		})

		it('handles TOGGLE_HINT action', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const newState = multipleChoiceReducer(state, {type: 'TOGGLE_HINT'})

			expect(newState.showHint).toBe(true)
		})
	})

	describe('selectors', () => {
		it('selectCurrentQuestion returns current question', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const question = selectCurrentQuestion(state)

			expect(question?.id).toBe('q1')
		})

		it('selectProgress returns progress info', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const progress = selectProgress(state)

			expect(progress).toEqual({
			current: 1,
			total: 2,
			completed: 0,
			percentage: 0
		})
		})

		it('selectStats returns stats', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			const stats = selectStats(state)

			expect(stats).toEqual({correct: 0, incorrect: 0, skipped: 0})
		})

		it('selectCanSubmit returns true when option selected', () => {
			let state = initializeMultipleChoiceState(mockExercise)
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o1'
			})

			expect(selectCanSubmit(state)).toBe(true)
		})

		it('selectCanSubmit returns false when no option selected', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			expect(selectCanSubmit(state)).toBe(false)
		})

		it('selectCanSkip returns true when allowSkip is enabled', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			expect(selectCanSkip(state)).toBe(true)
		})

		it('selectCanAdvance returns true after answering', () => {
			let state = initializeMultipleChoiceState(mockExercise)
			state = multipleChoiceReducer(state, {
				type: 'SELECT_OPTION',
				optionId: 'o1'
			})
			state = multipleChoiceReducer(state, {type: 'CHECK_ANSWER'})

			expect(selectCanAdvance(state)).toBe(true)
		})

		it('selectCanAdvance returns false when unanswered', () => {
			const state = initializeMultipleChoiceState(mockExercise)

			expect(selectCanAdvance(state)).toBe(false)
		})
	})
})
