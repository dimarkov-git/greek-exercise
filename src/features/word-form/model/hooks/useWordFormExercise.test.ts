import {act, renderHook} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {ExerciseSettings, WordFormExercise} from '@/entities/exercise'

const triggerPulseMock = vi.fn()
const clearPulseMock = vi.fn()

const mockDetectAutomationEnvironment = vi.hoisted(() => vi.fn(() => false))

vi.mock('@/utils/test-utils', () => ({
	detectAutomationEnvironment: mockDetectAutomationEnvironment
}))

vi.mock('@/shared/ui/hint-system', () => ({
	usePulseEffect: () => ({
		pulseState: null,
		triggerPulse: triggerPulseMock,
		clearPulse: clearPulseMock
	})
}))

import * as exerciseUtils from '@/entities/exercise'
import {
	useWordFormExercise,
	WORD_FORM_TEST_CONTROL_KEY
} from './useWordFormExercise'

function createExercise(
	overrides: Partial<WordFormExercise> = {}
): WordFormExercise {
	const defaultExercise: WordFormExercise = {
		enabled: true,
		id: 'exercise-1',
		type: 'word-form',
		language: 'el',
		title: 'Conjugation Basics',
		description: 'Practice present tense verb forms',
		difficulty: 'a1',
		estimatedTimeMinutes: 5,
		settings: {
			autoAdvance: true,
			autoAdvanceDelayMs: 25,
			allowSkip: true,
			shuffleCases: false
		},
		blocks: [
			{
				id: 'block-1',
				name: 'Present Tense',
				cases: [
					{
						id: 'case-1',
						prompt: 'εγώ',
						correct: ['είμαι'],
						hint: 'to be'
					},
					{
						id: 'case-2',
						prompt: 'εσύ',
						correct: ['είσαι']
					}
				]
			}
		]
	}

	const mergedSettings: ExerciseSettings = {
		...defaultExercise.settings,
		...overrides.settings
	} as ExerciseSettings

	return {
		...defaultExercise,
		...overrides,
		settings: mergedSettings,
		blocks: overrides.blocks ?? defaultExercise.blocks
	}
}

describe('useWordFormExercise', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
		triggerPulseMock.mockReset()
		clearPulseMock.mockReset()
		mockDetectAutomationEnvironment.mockReturnValue(false)
	})

	afterEach(() => {
		vi.clearAllTimers()
		vi.useRealTimers()
	})

	describe('initialization', () => {
		it('initializes the view state with exercise data', () => {
			const exercise = createExercise({
				blocks: [
					{
						id: 'block-1',
						name: 'Block 1',
						cases: [
							{
								id: 'case-1',
								prompt: 'prompt 1',
								correct: ['answer-1']
							}
						]
					},
					{
						id: 'block-2',
						name: 'Block 2',
						cases: [
							{
								id: 'case-2',
								prompt: 'prompt 2',
								correct: ['answer-2']
							}
						]
					}
				]
			})

			const {result} = renderHook(() => useWordFormExercise({exercise}))

			expect(result.current.state.exercise).toBe(exercise)
			expect(result.current.state.currentBlock?.id).toBe('block-1')
			expect(result.current.state.currentCase?.id).toBe('case-1')
			expect(result.current.state.progress).toEqual({
				completed: 0,
				current: 1,
				total: 2
			})
			expect(result.current.state.stats).toEqual({correct: 0, incorrect: 0})
			expect(result.current.state.answer).toEqual({
				value: '',
				originalValue: '',
				isCorrect: null,
				showAnswer: false,
				incorrectAttempts: 0
			})
			expect(result.current.state.autoAdvanceEnabled).toBe(true)
		})
	})

	describe('answer handling', () => {
		it('updates answer value via handleAnswerChange', () => {
			const exercise = createExercise()
			const {result} = renderHook(() => useWordFormExercise({exercise}))

			act(() => {
				result.current.handleAnswerChange('  είμαι ')
			})

			expect(result.current.state.answer.value).toBe('  είμαι ')
		})

		it('submits correct answers, triggers pulse, and auto advances', () => {
			const exercise = createExercise({
				settings: {
					autoAdvance: true,
					autoAdvanceDelayMs: 25,
					allowSkip: true,
					shuffleCases: false
				}
			})

			const {result} = renderHook(() => useWordFormExercise({exercise}))

			act(() => {
				result.current.handleSubmit('  είμαι ')
			})

			expect(triggerPulseMock).toHaveBeenCalled()
			expect(triggerPulseMock).toHaveBeenCalledWith('correct')
			expect(result.current.state.answer).toMatchObject({
				value: 'είμαι',
				isCorrect: true,
				showAnswer: false
			})
			expect(result.current.state.stats).toEqual({correct: 1, incorrect: 0})
			expect(result.current.state.status).toBe('CORRECT_ANSWER')

			act(() => {
				vi.advanceTimersByTime(25)
			})

			expect(result.current.state.currentCase?.id).toBe('case-2')
			expect(result.current.state.status).toBe('WAITING_INPUT')
			expect(result.current.state.progress).toEqual({
				completed: 1,
				current: 2,
				total: 2
			})
		})

		it('handles incorrect answers, shows feedback, and requires correction', () => {
			const exercise = createExercise()
			const {result} = renderHook(() => useWordFormExercise({exercise}))

			act(() => {
				result.current.handleSubmit('λάθος')
			})

			expect(triggerPulseMock).toHaveBeenLastCalledWith('incorrect')
			expect(result.current.state.answer).toMatchObject({
				value: 'λάθος',
				isCorrect: false,
				showAnswer: true,
				incorrectAttempts: 1
			})
			expect(result.current.state.stats).toEqual({correct: 0, incorrect: 1})
			expect(result.current.state.status).toBe('REQUIRE_CORRECTION')
		})

		it('requires manual continue when auto-advance is disabled', () => {
			const exercise = createExercise({
				settings: {
					autoAdvance: false,
					autoAdvanceDelayMs: 25,
					allowSkip: true,
					shuffleCases: false
				}
			})

			const {result} = renderHook(() => useWordFormExercise({exercise}))

			act(() => {
				result.current.handleSubmit('είμαι')
			})

			expect(result.current.state.status).toBe('CORRECT_ANSWER')

			act(() => {
				vi.advanceTimersByTime(1000)
			})

			expect(result.current.state.status).toBe('REQUIRE_CONTINUE')

			act(() => {
				result.current.handleSubmit('anything')
			})

			expect(result.current.state.currentCase?.id).toBe('case-2')
			expect(result.current.state.status).toBe('WAITING_INPUT')
		})

		it('respects allowSkip setting when handling skip events', () => {
			const noSkipExercise = createExercise({
				settings: {
					autoAdvance: true,
					autoAdvanceDelayMs: 25,
					allowSkip: false,
					shuffleCases: false
				}
			})

			const {result: noSkipResult} = renderHook(() =>
				useWordFormExercise({exercise: noSkipExercise})
			)

			act(() => {
				noSkipResult.current.handleEvent({type: 'SKIP'})
			})

			expect(triggerPulseMock).not.toHaveBeenCalled()
			expect(noSkipResult.current.state.currentCase?.id).toBe('case-1')

			triggerPulseMock.mockClear()

			const skipExercise = createExercise({
				settings: {
					autoAdvance: true,
					autoAdvanceDelayMs: 25,
					allowSkip: true,
					shuffleCases: false
				}
			})

			const {result} = renderHook(() =>
				useWordFormExercise({exercise: skipExercise})
			)

			act(() => {
				result.current.handleEvent({type: 'SKIP'})
			})

			expect(triggerPulseMock).toHaveBeenLastCalledWith('skip')

			act(() => {
				vi.advanceTimersByTime(600)
			})

			expect(result.current.state.currentCase?.id).toBe('case-2')
		})

		it('calls onComplete with stats when the exercise finishes', () => {
			const exercise = createExercise({
				blocks: [
					{
						id: 'block-1',
						name: 'Single Block',
						cases: [
							{
								id: 'case-1',
								prompt: 'prompt',
								correct: ['είμαι']
							}
						]
					}
				]
			})
			const onComplete = vi.fn()

			const {result} = renderHook(() =>
				useWordFormExercise({exercise, onComplete})
			)

			act(() => {
				result.current.handleSubmit('είμαι')
			})

			act(() => {
				vi.advanceTimersByTime(25)
			})

			expect(onComplete).toHaveBeenCalledWith({
				exerciseId: exercise.id,
				totalCases: 1,
				correctAnswers: 1,
				incorrectAnswers: 0,
				timeSpentMs: 25,
				accuracy: 100
			})
			expect(result.current.state.status).toBe('COMPLETED')
		})

		it('toggles hints and auto-advance through events', () => {
			const exercise = createExercise()
			const {result} = renderHook(() => useWordFormExercise({exercise}))

			act(() => {
				result.current.handleEvent({type: 'TOGGLE_HINT', hintType: 'name'})
			})

			expect(result.current.state.hints.name).toBe(true)

			act(() => {
				result.current.handleEvent({type: 'TOGGLE_HINT', hintType: 'name'})
			})

			expect(result.current.state.hints.name).toBe(false)

			const initialAutoAdvance = result.current.state.autoAdvanceEnabled

			act(() => {
				result.current.handleEvent({type: 'TOGGLE_AUTO_ADVANCE'})
			})

			expect(result.current.state.autoAdvanceEnabled).toBe(!initialAutoAdvance)
		})

		it('resets state when restart event is dispatched', () => {
			const exercise = createExercise()
			const {result} = renderHook(() => useWordFormExercise({exercise}))

			act(() => {
				result.current.handleAnswerChange('temporary')
			})

			expect(result.current.state.answer.value).toBe('temporary')

			act(() => {
				result.current.handleEvent({type: 'RESTART'})
			})

			expect(result.current.state.answer).toEqual({
				value: '',
				originalValue: '',
				isCorrect: null,
				showAnswer: false,
				incorrectAttempts: 0
			})
			expect(result.current.state.stats).toEqual({correct: 0, incorrect: 0})
			expect(result.current.state.currentCase?.id).toBe('case-1')
		})

		it('attaches automation helpers when running in automation environment', () => {
			mockDetectAutomationEnvironment.mockReturnValue(true)
			const exercise = createExercise()
			const onComplete = vi.fn()

			const {result, unmount} = renderHook(() =>
				useWordFormExercise({exercise, onComplete})
			)

			const automationWindow = window as typeof window & {
				[WORD_FORM_TEST_CONTROL_KEY]?: {complete: () => void}
			}

			expect(automationWindow[WORD_FORM_TEST_CONTROL_KEY]).toBeDefined()

			act(() => {
				automationWindow[WORD_FORM_TEST_CONTROL_KEY]?.complete()
			})

			expect(onComplete).toHaveBeenCalledWith({
				exerciseId: exercise.id,
				totalCases: result.current.state.progress.total,
				correctAnswers: 0,
				incorrectAnswers: 0,
				timeSpentMs: 0,
				accuracy: 0
			})
			expect(result.current.state.status).toBe('COMPLETED')

			unmount()

			expect(automationWindow[WORD_FORM_TEST_CONTROL_KEY]).toBeUndefined()
		})

		it('treats answer check errors as incorrect answers', () => {
			const exercise = createExercise()
			const checkAnswerSpy = vi
				.spyOn(exerciseUtils, 'checkAnswer')
				.mockImplementation(() => {
					throw new Error('normalization failed')
				})

			const {result} = renderHook(() => useWordFormExercise({exercise}))

			act(() => {
				result.current.handleSubmit('είμαι')
			})

			expect(triggerPulseMock).toHaveBeenLastCalledWith('incorrect')
			expect(result.current.state.stats.incorrect).toBe(1)
			expect(result.current.state.answer.isCorrect).toBe(false)

			checkAnswerSpy.mockRestore()
		})
	})
})
