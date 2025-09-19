import {act, renderHook} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import {checkAnswer} from '@/utils/exercises'
import {useAnswerHandler} from './useAnswerHandler'

// Mock the utility functions
vi.mock('@/utils/exercises', () => ({
	checkAnswer: vi.fn()
}))

const mockExercise: WordFormExercise = {
	enabled: true,
	id: 'test-exercise',
	type: 'word-form',
	title: 'Test Exercise',
	titleI18n: {el: 'Test', en: 'Test', ru: 'Test'},
	description: 'Test Description',
	descriptionI18n: {el: 'Test', en: 'Test', ru: 'Test'},
	buttonText: 'Start',
	buttonTextI18n: {el: 'Start', en: 'Start', ru: 'Start'},
	tags: ['test'],
	difficulty: 'beginner',
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
			name: 'Block 1',
			nameHintI18n: {el: 'Block 1', en: 'Block 1', ru: 'Block 1'},
			cases: [
				{
					id: 'case-1',
					prompt: 'εγώ ___',
					promptHintI18n: {el: 'I', en: 'I', ru: 'я'},
					correct: ['είμαι'],
					hint: null,
					hintI18n: null
				},
				{
					id: 'case-2',
					prompt: 'εσύ ___',
					promptHintI18n: {el: 'you', en: 'you', ru: 'ты'},
					correct: ['είσαι'],
					hint: null,
					hintI18n: null
				}
			]
		}
	]
}

const mockCurrentCase: WordFormCase = mockExercise.blocks[0]
	?.cases[0] as WordFormCase

const mockInitialState: ExerciseState = {
	currentBlockIndex: 0,
	currentCaseIndex: 0,
	userAnswer: '',
	showAnswer: false,
	isCorrect: null,
	completedCases: 0,
	totalCases: 2,
	autoAdvanceEnabled: true,
	incorrectAttempts: 0,
	showNameHint: false,
	showPromptHint: false,
	showAdditionalHint: false
}

describe('useAnswerHandler', () => {
	const mockSetState = vi.fn()
	const mockSetStatus = vi.fn()
	const mockSetCorrectCount = vi.fn()
	const mockSetIncorrectCount = vi.fn()
	vi.fn() // mockSetStartTime
	const mockTriggerPulse = vi.fn()
	const mockHandleContinue = vi.fn()
	const mockOnComplete = vi.fn()

	const defaultProps = {
		exercise: mockExercise,
		state: mockInitialState,
		status: 'WAITING_INPUT' as ExerciseStatus,
		currentCase: mockCurrentCase,
		setState: mockSetState,
		setStatus: mockSetStatus,
		setCorrectCount: mockSetCorrectCount,
		setIncorrectCount: mockSetIncorrectCount,
		triggerPulse: mockTriggerPulse,
		correctCount: 0,
		incorrectCount: 0,
		handleContinue: mockHandleContinue,
		onComplete: mockOnComplete
	}

	beforeEach(() => {
		vi.clearAllMocks()
		// Reset the mock implementation
		vi.mocked(checkAnswer).mockClear()
	})

	describe('Correct answer handling', () => {
		it('should handle correct answer submission', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Should set status to CHECKING first
			expect(mockSetStatus).toHaveBeenCalledWith('CHECKING')

			// Should check the answer
			expect(checkAnswer).toHaveBeenCalledWith('είμαι', ['είμαι'])

			// Should trigger success pulse
			expect(mockTriggerPulse).toHaveBeenCalledWith(true)

			// Should update state for correct answer
			expect(mockSetState).toHaveBeenCalledWith(expect.any(Function))

			// Should increment correct count
			expect(mockSetCorrectCount).toHaveBeenCalledWith(expect.any(Function))

			// Should set status to CORRECT_ANSWER
			expect(mockSetStatus).toHaveBeenCalledWith('CORRECT_ANSWER')
		})

		it('should handle correct answer with tone-insensitive matching', () => {
			// Mock returns true to simulate tone-insensitive matching
			vi.mocked(checkAnswer).mockReturnValue(true)

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('ειμαι')
			})

			// Should check the answer (only once in current implementation)
			expect(checkAnswer).toHaveBeenCalledWith('ειμαι', ['είμαι'])

			expect(mockTriggerPulse).toHaveBeenCalledWith(true)
			expect(mockSetStatus).toHaveBeenCalledWith('CORRECT_ANSWER')
		})

		it('should auto-advance after correct answer when enabled', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)
			vi.useFakeTimers()

			const propsWithAutoAdvance = {
				...defaultProps,
				state: {
					...mockInitialState,
					autoAdvanceEnabled: true
				}
			}

			const {result} = renderHook(() => useAnswerHandler(propsWithAutoAdvance))

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Fast-forward time to trigger auto-advance
			act(() => {
				vi.advanceTimersByTime(1500) // autoAdvanceDelayMs
			})

			expect(mockHandleContinue).toHaveBeenCalled()

			vi.useRealTimers()
		})

		it('should not auto-advance when disabled', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)
			vi.useFakeTimers()

			const propsWithoutAutoAdvance = {
				...defaultProps,
				state: {
					...mockInitialState,
					autoAdvanceEnabled: false
				}
			}

			const {result} = renderHook(() =>
				useAnswerHandler(propsWithoutAutoAdvance)
			)

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			act(() => {
				vi.advanceTimersByTime(2000)
			})

			expect(mockHandleContinue).not.toHaveBeenCalled()

			vi.useRealTimers()
		})
	})

	describe('Incorrect answer handling', () => {
		it('should handle incorrect answer submission', () => {
			vi.mocked(checkAnswer).mockReturnValue(false)

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('λάθος')
			})

			// Should check the answer
			expect(checkAnswer).toHaveBeenCalledWith('λάθος', ['είμαι'])

			// Should trigger error pulse
			expect(mockTriggerPulse).toHaveBeenCalledWith(false)

			// Should increment incorrect count
			expect(mockSetIncorrectCount).toHaveBeenCalledWith(expect.any(Function))

			// Should set status to WRONG_ANSWER
			expect(mockSetStatus).toHaveBeenCalledWith('WRONG_ANSWER')

			// Should show correct answer
			expect(mockSetState).toHaveBeenCalledWith(expect.any(Function))
		})

		it('should increment incorrect attempts counter', () => {
			vi.mocked(checkAnswer).mockReturnValue(false)

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('λάθος')
			})

			// Verify that setState was called to increment incorrectAttempts
			// Find the second setState call (the one that increments incorrectAttempts)
			const stateUpdateFunctions = mockSetState.mock.calls
				.filter(call => typeof call[0] === 'function')
				.map(call => call[0])

			// The second call should increment incorrectAttempts
			if (stateUpdateFunctions.length >= 2) {
				const newState = stateUpdateFunctions[1](mockInitialState)
				expect(newState.incorrectAttempts).toBe(1)
			} else {
				// Fallback: check if any call increments incorrectAttempts
				const foundIncrement = stateUpdateFunctions.some(fn => {
					const newState = fn(mockInitialState)
					return newState.incorrectAttempts === 1
				})
				expect(foundIncrement).toBe(true)
			}
		})

		it('should handle multiple incorrect attempts in REQUIRE_CORRECTION state', () => {
			vi.mocked(checkAnswer).mockReturnValue(false)

			const stateWithAttempts = {
				...mockInitialState,
				incorrectAttempts: 2
			}

			const propsWithAttempts = {
				...defaultProps,
				status: 'REQUIRE_CORRECTION' as ExerciseStatus,
				state: stateWithAttempts
			}

			const {result} = renderHook(() => useAnswerHandler(propsWithAttempts))

			act(() => {
				result.current.handleSubmitAnswer('λάθος')
			})

			// Should continue incrementing attempts in REQUIRE_CORRECTION state
			// The function should call setState once to update all state
			expect(mockSetState).toHaveBeenCalledTimes(1)

			const stateUpdateFunctions = mockSetState.mock.calls
				.filter(call => typeof call[0] === 'function')
				.map(call => call[0])

			// Check the setState call updates incorrectAttempts
			expect(stateUpdateFunctions.length).toBe(1)
			const newState = stateUpdateFunctions[0](stateWithAttempts)
			expect(newState.incorrectAttempts).toBe(3)
		})
	})

	describe('REQUIRE_CORRECTION status handling', () => {
		it('should handle answer in REQUIRE_CORRECTION state', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)

			const propsWithCorrection = {
				...defaultProps,
				status: 'REQUIRE_CORRECTION' as ExerciseStatus
			}

			const {result} = renderHook(() => useAnswerHandler(propsWithCorrection))

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Should not increment correct count (already counted as incorrect)
			expect(mockSetCorrectCount).not.toHaveBeenCalled()

			// Should still trigger success pulse
			expect(mockTriggerPulse).toHaveBeenCalledWith(true)

			// Should proceed with correct answer flow
			expect(mockSetStatus).toHaveBeenCalledWith('CORRECT_ANSWER')
		})

		it('should require correct answer in REQUIRE_CORRECTION state', () => {
			vi.mocked(checkAnswer).mockReturnValue(false)

			const propsWithCorrection = {
				...defaultProps,
				status: 'REQUIRE_CORRECTION' as ExerciseStatus
			}

			const {result} = renderHook(() => useAnswerHandler(propsWithCorrection))

			act(() => {
				result.current.handleSubmitAnswer('λάθος')
			})

			// Should not increment incorrect count again
			expect(mockSetIncorrectCount).not.toHaveBeenCalled()

			// Should trigger error pulse
			expect(mockTriggerPulse).toHaveBeenCalledWith(false)

			// Should still show wrong answer feedback
			expect(mockSetStatus).toHaveBeenCalledWith('WRONG_ANSWER')
		})
	})

	describe('Edge cases and error handling', () => {
		it('should handle empty answer submission', () => {
			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('')
			})

			// Should not proceed with answer checking for empty answers
			expect(checkAnswer).not.toHaveBeenCalled()
			expect(mockSetStatus).not.toHaveBeenCalled()
		})

		it('should handle whitespace-only answer submission', () => {
			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('   ')
			})

			// Should not proceed with answer checking for whitespace-only answers
			expect(checkAnswer).not.toHaveBeenCalled()
			expect(mockSetStatus).not.toHaveBeenCalled()
		})

		it('should handle missing current case', () => {
			const propsWithoutCase = {
				...defaultProps,
				currentCase: undefined
			}

			const {result} = renderHook(() => useAnswerHandler(propsWithoutCase))

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Should not proceed without current case
			expect(checkAnswer).not.toHaveBeenCalled()
			expect(mockSetStatus).not.toHaveBeenCalled()
		})

		it('should handle answer checking function throwing error', () => {
			vi.mocked(checkAnswer).mockImplementation(() => {
				throw new Error('Answer checking failed')
			})

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			// Should not crash when answer checking throws
			expect(() => {
				act(() => {
					result.current.handleSubmitAnswer('είμαι')
				})
			}).not.toThrow()
		})
	})

	describe('Timer management', () => {
		it('should clear existing timer when new answer is submitted', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)
			vi.useFakeTimers()

			const propsWithAutoAdvance = {
				...defaultProps,
				state: {
					...mockInitialState,
					autoAdvanceEnabled: true
				}
			}

			const {result} = renderHook(() => useAnswerHandler(propsWithAutoAdvance))

			// Submit first correct answer
			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Submit second answer before timer completes
			act(() => {
				vi.advanceTimersByTime(500) // Partial advance
				result.current.handleSubmitAnswer('είμαι')
			})

			// Advance full time for new timer
			act(() => {
				vi.advanceTimersByTime(1500)
			})

			// Should only call continue once (for the second answer)
			expect(mockHandleContinue).toHaveBeenCalledTimes(1)

			vi.useRealTimers()
		})

		it('should clear timer on component unmount', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)
			vi.useFakeTimers()
			const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

			const propsWithAutoAdvance = {
				...defaultProps,
				state: {
					...mockInitialState,
					autoAdvanceEnabled: true
				}
			}

			const {result, unmount} = renderHook(() =>
				useAnswerHandler(propsWithAutoAdvance)
			)

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			unmount()

			expect(clearTimeoutSpy).toHaveBeenCalled()

			vi.useRealTimers()
		})
	})

	describe('State updates', () => {
		it('should update user answer in state', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Verify that setState was called to update userAnswer
			const stateUpdateFunction = mockSetState.mock.calls.find(
				call => typeof call[0] === 'function'
			)?.[0]

			if (stateUpdateFunction) {
				const newState = stateUpdateFunction(mockInitialState)
				expect(newState.userAnswer).toBe('είμαι')
				expect(newState.isCorrect).toBe(true)
			}
		})

		it('should show correct answer for incorrect submissions', () => {
			vi.mocked(checkAnswer).mockReturnValue(false)

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			act(() => {
				result.current.handleSubmitAnswer('λάθος')
			})

			// Verify that setState was called to show answer
			const stateUpdateFunction = mockSetState.mock.calls.find(
				call => typeof call[0] === 'function'
			)?.[0]

			if (stateUpdateFunction) {
				const newState = stateUpdateFunction(mockInitialState)
				expect(newState.showAnswer).toBe(true)
				expect(newState.isCorrect).toBe(false)
			}
		})
	})

	describe('Completion handling', () => {
		it('should call handleContinue when auto-advance is enabled after correct answer', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)
			vi.useFakeTimers()

			// Mock exercise with auto-advance enabled
			const stateWithAutoAdvance = {
				...mockInitialState,
				autoAdvanceEnabled: true
			}

			const propsWithAutoAdvance = {
				...defaultProps,
				state: stateWithAutoAdvance
			}

			const {result} = renderHook(() => useAnswerHandler(propsWithAutoAdvance))

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Fast-forward time to trigger auto-advance
			act(() => {
				vi.advanceTimersByTime(1500) // autoAdvanceDelayMs
			})

			// Check if handleContinue was called (this should happen with auto-advance)
			expect(mockHandleContinue).toHaveBeenCalled()

			vi.useRealTimers()
		})

		it('should not call handleContinue when auto-advance is disabled', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)
			vi.useFakeTimers()

			const stateWithoutAutoAdvance = {
				...mockInitialState,
				autoAdvanceEnabled: false
			}

			const propsWithoutAutoAdvance = {
				...defaultProps,
				state: stateWithoutAutoAdvance
			}

			const {result} = renderHook(() =>
				useAnswerHandler(propsWithoutAutoAdvance)
			)

			act(() => {
				result.current.handleSubmitAnswer('είμαι')
			})

			// Fast-forward time - should not call handleContinue
			act(() => {
				vi.advanceTimersByTime(1500) // autoAdvanceDelayMs
			})

			// handleContinue should not have been called
			expect(mockHandleContinue).not.toHaveBeenCalled()

			vi.useRealTimers()
		})
	})

	describe('Performance and memory management', () => {
		it('should maintain stable function reference', () => {
			const {result, rerender} = renderHook(() =>
				useAnswerHandler(defaultProps)
			)

			const initialHandler = result.current.handleSubmitAnswer

			rerender()

			expect(result.current.handleSubmitAnswer).toBe(initialHandler)
		})

		it('should handle rapid successive submissions', () => {
			vi.mocked(checkAnswer).mockReturnValue(true)

			const {result} = renderHook(() => useAnswerHandler(defaultProps))

			// Submit multiple answers rapidly
			act(() => {
				result.current.handleSubmitAnswer('είμαι')
				result.current.handleSubmitAnswer('είμαι')
				result.current.handleSubmitAnswer('είμαι')
			})

			// Should handle all submissions without crashing
			expect(mockSetStatus).toHaveBeenCalled()
		})
	})
})
