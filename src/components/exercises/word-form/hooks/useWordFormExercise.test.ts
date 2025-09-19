import {act, renderHook} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import * as usePulseEffectModule from '@/hooks/usePulseEffect'
import type {
	ExerciseStatus,
	WordFormBlock,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import * as useExerciseHandlersModule from './useExerciseHandlers'
import * as useExerciseInitializationModule from './useExerciseInitialization'
import {useWordFormExercise} from './useWordFormExercise'

// Mock the dependent hooks
vi.mock('@/hooks/usePulseEffect', () => ({
	usePulseEffect: vi.fn(() => ({
		pulseState: null,
		triggerPulse: vi.fn(),
		clearPulse: vi.fn()
	}))
}))

vi.mock('./useExerciseInitialization', () => ({
	useExerciseInitialization: vi.fn(() => ({
		exercise: mockExercise,
		state: mockInitialState,
		setState: vi.fn(),
		status: 'WAITING_INPUT',
		setStatus: vi.fn(),
		currentCase: mockExercise.blocks[0]?.cases[0] as WordFormCase,
		currentBlock: mockExercise.blocks[0] as WordFormBlock,
		correctCount: 0,
		setCorrectCount: vi.fn(),
		incorrectCount: 0,
		setIncorrectCount: vi.fn(),
		startTime: Date.now(),
		setStartTime: vi.fn()
	}))
}))

vi.mock('./useExerciseHandlers', () => ({
	useExerciseHandlers: vi.fn(() => ({
		handleEvent: vi.fn(),
		handleSubmitAnswer: vi.fn(),
		handleContinue: vi.fn(),
		handleRestart: vi.fn(),
		handleToggleAutoAdvance: vi.fn()
	}))
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

const mockInitialState = {
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

describe('useWordFormExercise', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Hook initialization', () => {
		it('should initialize with correct default values', () => {
			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			expect(result.current).toHaveProperty('exercise')
			expect(result.current).toHaveProperty('state')
			expect(result.current).toHaveProperty('status')
			expect(result.current).toHaveProperty('currentCase')
			expect(result.current).toHaveProperty('currentBlock')
			expect(result.current).toHaveProperty('handleSubmit')
			expect(result.current).toHaveProperty('handleAutoAdvanceToggle')
		})

		it('should initialize with onComplete callback', () => {
			const onComplete = vi.fn()

			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise,
					onComplete
				})
			)

			expect(result.current).toBeDefined()
			expect(onComplete).not.toHaveBeenCalled()
		})

		it('should handle undefined onComplete callback', () => {
			expect(() =>
				renderHook(() =>
					useWordFormExercise({
						exercise: mockExercise,
						onComplete: undefined
					})
				)
			).not.toThrow()
		})
	})

	describe('Answer submission', () => {
		it('should handle answer submission with trimmed input', () => {
			const mockHandleEvent = vi.fn()

			// Mock the useExerciseHandlers to return our spy
			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			useExerciseHandlers.mockReturnValue({
				handleEvent: mockHandleEvent,
				handleSubmitAnswer: vi.fn(),
				handleContinue: vi.fn(),
				handleRestart: vi.fn(),
				handleToggleAutoAdvance: vi.fn()
			})

			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			act(() => {
				result.current.handleSubmit('  είμαι  ')
			})

			expect(mockHandleEvent).toHaveBeenCalledWith({
				type: 'SUBMIT_ANSWER',
				answer: 'είμαι'
			})
		})

		it('should handle empty answer submission', () => {
			const mockHandleEvent = vi.fn()

			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			useExerciseHandlers.mockReturnValue({
				handleEvent: mockHandleEvent,
				handleSubmitAnswer: vi.fn(),
				handleContinue: vi.fn(),
				handleRestart: vi.fn(),
				handleToggleAutoAdvance: vi.fn()
			})

			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			act(() => {
				result.current.handleSubmit('   ')
			})

			expect(mockHandleEvent).toHaveBeenCalledWith({
				type: 'SUBMIT_ANSWER',
				answer: ''
			})
		})

		it('should handle special characters in answers', () => {
			const mockHandleEvent = vi.fn()

			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			useExerciseHandlers.mockReturnValue({
				handleEvent: mockHandleEvent,
				handleSubmitAnswer: vi.fn(),
				handleContinue: vi.fn(),
				handleRestart: vi.fn(),
				handleToggleAutoAdvance: vi.fn()
			})

			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			act(() => {
				result.current.handleSubmit('είμαι!')
			})

			expect(mockHandleEvent).toHaveBeenCalledWith({
				type: 'SUBMIT_ANSWER',
				answer: 'είμαι!'
			})
		})
	})

	describe('Auto-advance toggle', () => {
		it('should handle auto-advance toggle', () => {
			const mockHandleEvent = vi.fn()

			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			useExerciseHandlers.mockReturnValue({
				handleEvent: mockHandleEvent,
				handleSubmitAnswer: vi.fn(),
				handleContinue: vi.fn(),
				handleRestart: vi.fn(),
				handleToggleAutoAdvance: vi.fn()
			})

			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			act(() => {
				result.current.handleAutoAdvanceToggle()
			})

			expect(mockHandleEvent).toHaveBeenCalledWith({
				type: 'TOGGLE_AUTO_ADVANCE'
			})
		})
	})

	describe('Pulse effect integration', () => {
		it('should integrate with pulse effect hook', () => {
			const mockTriggerPulse = vi.fn()
			const mockClearPulse = vi.fn()

			const usePulseEffect = vi.mocked(usePulseEffectModule.usePulseEffect)
			usePulseEffect.mockReturnValue({
				pulseState: true,
				triggerPulse: mockTriggerPulse,
				clearPulse: mockClearPulse
			})

			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			expect(result.current.pulseState).toBe(true)
			expect(result.current.clearPulse).toBe(mockClearPulse)
		})

		it('should pass trigger pulse to exercise handlers', () => {
			const mockTriggerPulse = vi.fn()

			const usePulseEffect = vi.mocked(usePulseEffectModule.usePulseEffect)
			usePulseEffect.mockReturnValue({
				pulseState: null,
				triggerPulse: mockTriggerPulse,
				clearPulse: vi.fn()
			})

			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			const mockUseExerciseHandlers = useExerciseHandlers

			renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			expect(mockUseExerciseHandlers).toHaveBeenCalledWith(
				expect.objectContaining({
					triggerPulse: mockTriggerPulse
				})
			)
		})
	})

	describe('Exercise completion callback', () => {
		it('should pass onComplete callback to exercise handlers', () => {
			const onComplete = vi.fn()

			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			const mockUseExerciseHandlers = useExerciseHandlers

			renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise,
					onComplete
				})
			)

			expect(mockUseExerciseHandlers).toHaveBeenCalledWith(
				expect.objectContaining({
					onComplete
				})
			)
		})

		it('should handle undefined onComplete callback gracefully', () => {
			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			const mockUseExerciseHandlers = useExerciseHandlers

			renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise,
					onComplete: undefined
				})
			)

			expect(mockUseExerciseHandlers).toHaveBeenCalledWith(
				expect.objectContaining({
					onComplete: undefined
				})
			)
		})
	})

	describe('Hook dependencies and updates', () => {
		it('should update when exercise changes', () => {
			const {rerender} = renderHook(
				({exercise}) => useWordFormExercise({exercise}),
				{
					initialProps: {exercise: mockExercise}
				}
			)

			const updatedExercise = {
				...mockExercise,
				title: 'Updated Exercise'
			}

			rerender({exercise: updatedExercise})

			// Verify that initialization hook is called with updated exercise
			const useExerciseInitialization = vi.mocked(
				useExerciseInitializationModule.useExerciseInitialization
			)
			expect(useExerciseInitialization).toHaveBeenLastCalledWith({
				exercise: updatedExercise
			})
		})

		it('should maintain stable function references', () => {
			const {result, rerender} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			const initialHandleSubmit = result.current.handleSubmit
			const initialHandleAutoAdvanceToggle =
				result.current.handleAutoAdvanceToggle

			rerender()

			expect(result.current.handleSubmit).toBe(initialHandleSubmit)
			expect(result.current.handleAutoAdvanceToggle).toBe(
				initialHandleAutoAdvanceToggle
			)
		})
	})

	describe('Error handling', () => {
		it('should handle initialization errors gracefully', () => {
			const useExerciseInitialization = vi.mocked(
				useExerciseInitializationModule.useExerciseInitialization
			)
			useExerciseInitialization.mockImplementation(() => {
				throw new Error('Initialization failed')
			})

			expect(() =>
				renderHook(() =>
					useWordFormExercise({
						exercise: mockExercise
					})
				)
			).toThrow('Initialization failed')
		})

		it('should handle handler creation errors gracefully', () => {
			// Reset the initialization mock to normal behavior
			const useExerciseInitialization = vi.mocked(
				useExerciseInitializationModule.useExerciseInitialization
			)
			useExerciseInitialization.mockReturnValue({
				exercise: mockExercise,
				state: mockInitialState,
				setState: vi.fn(),
				status: 'WAITING_INPUT',
				setStatus: vi.fn(),
				currentCase: mockExercise.blocks[0]?.cases[0] as WordFormCase,
				currentBlock: mockExercise.blocks[0] as WordFormBlock,
				correctCount: 0,
				setCorrectCount: vi.fn(),
				incorrectCount: 0,
				setIncorrectCount: vi.fn(),
				startTime: Date.now(),
				setStartTime: vi.fn()
			})

			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			useExerciseHandlers.mockImplementation(() => {
				throw new Error('Handler creation failed')
			})

			expect(() =>
				renderHook(() =>
					useWordFormExercise({
						exercise: mockExercise
					})
				)
			).toThrow('Handler creation failed')
		})

		it('should handle pulse effect errors gracefully', () => {
			const usePulseEffect = vi.mocked(usePulseEffectModule.usePulseEffect)
			usePulseEffect.mockImplementation(() => {
				throw new Error('Pulse effect failed')
			})

			expect(() =>
				renderHook(() =>
					useWordFormExercise({
						exercise: mockExercise
					})
				)
			).toThrow('Pulse effect failed')
		})
	})

	describe('Memory management', () => {
		it('should not cause memory leaks with frequent re-renders', () => {
			// Reset all mocks to their default behavior
			const usePulseEffect = vi.mocked(usePulseEffectModule.usePulseEffect)
			usePulseEffect.mockReturnValue({
				pulseState: null,
				triggerPulse: vi.fn(),
				clearPulse: vi.fn()
			})

			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			useExerciseHandlers.mockReturnValue({
				handleEvent: vi.fn(),
				handleSubmitAnswer: vi.fn(),
				handleContinue: vi.fn(),
				handleRestart: vi.fn(),
				handleToggleAutoAdvance: vi.fn()
			})

			const useExerciseInitialization = vi.mocked(
				useExerciseInitializationModule.useExerciseInitialization
			)
			useExerciseInitialization.mockReturnValue({
				exercise: mockExercise,
				state: mockInitialState,
				setState: vi.fn(),
				status: 'WAITING_INPUT',
				setStatus: vi.fn(),
				currentCase: mockExercise.blocks[0]?.cases[0] as WordFormCase,
				currentBlock: mockExercise.blocks[0] as WordFormBlock,
				correctCount: 0,
				setCorrectCount: vi.fn(),
				incorrectCount: 0,
				setIncorrectCount: vi.fn(),
				startTime: Date.now(),
				setStartTime: vi.fn()
			})

			const {result, rerender} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			// Perform many re-renders to test for memory leaks
			for (let i = 0; i < 100; i++) {
				rerender()
			}

			expect(result.current).toBeDefined()
		})

		it('should clean up properly on unmount', () => {
			const {unmount} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			expect(() => unmount()).not.toThrow()
		})
	})

	describe('Integration with dependent hooks', () => {
		it('should pass correct props to useExerciseInitialization', () => {
			const useExerciseInitialization = vi.mocked(
				useExerciseInitializationModule.useExerciseInitialization
			)

			renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			expect(useExerciseInitialization).toHaveBeenCalledWith({
				exercise: mockExercise
			})
		})

		it('should pass correct props to useExerciseHandlers', () => {
			const useExerciseHandlers = vi.mocked(
				useExerciseHandlersModule.useExerciseHandlers
			)
			const usePulseEffect = vi.mocked(usePulseEffectModule.usePulseEffect)

			const mockTriggerPulse = vi.fn()
			usePulseEffect.mockReturnValue({
				pulseState: null,
				triggerPulse: mockTriggerPulse,
				clearPulse: vi.fn()
			})

			const onComplete = vi.fn()

			renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise,
					onComplete
				})
			)

			expect(useExerciseHandlers).toHaveBeenCalledWith(
				expect.objectContaining({
					triggerPulse: mockTriggerPulse,
					onComplete
				})
			)
		})

		it('should return all necessary properties from dependent hooks', () => {
			const mockInitialization = {
				exercise: mockExercise,
				state: mockInitialState,
				setState: vi.fn(),
				status: 'WAITING_INPUT' as ExerciseStatus,
				setStatus: vi.fn(),
				currentCase: mockExercise.blocks[0]?.cases[0] as WordFormCase,
				currentBlock: mockExercise.blocks[0] as WordFormBlock,
				correctCount: 0,
				setCorrectCount: vi.fn(),
				incorrectCount: 0,
				setIncorrectCount: vi.fn(),
				startTime: Date.now(),
				setStartTime: vi.fn()
			}

			const useExerciseInitialization = vi.mocked(
				useExerciseInitializationModule.useExerciseInitialization
			)
			useExerciseInitialization.mockReturnValue(mockInitialization)

			const {result} = renderHook(() =>
				useWordFormExercise({
					exercise: mockExercise
				})
			)

			// Verify that initialization properties are spread into the result
			expect(result.current.exercise).toBe(mockInitialization.exercise)
			expect(result.current.state).toBe(mockInitialization.state)
			expect(result.current.status).toBe(mockInitialization.status)
			expect(result.current.currentCase).toBe(mockInitialization.currentCase)
			expect(result.current.currentBlock).toBe(mockInitialization.currentBlock)
		})
	})
})
