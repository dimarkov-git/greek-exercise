import {act} from '@testing-library/react'
import {renderHook} from '@tests/utils'
import {describe, expect, it, vi} from 'vitest'
import * as pulseEffectModule from '@/hooks/usePulseEffect'
import type {
	ExerciseState,
	WordFormBlock,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import * as handlersModule from './useExerciseHandlers'
import * as initializationModule from './useExerciseInitialization'
import {useWordFormExercise} from './useWordFormExercise'

vi.mock('@/hooks/usePulseEffect')
vi.mock('./useExerciseInitialization')
vi.mock('./useExerciseHandlers')

const mockExercise: WordFormExercise = {
	enabled: true,
	id: 'verbs-be',
	type: 'word-form',
	title: 'To be',
	titleI18n: {el: 'Είμαι', en: 'To be', ru: 'Быть'},
	description: 'Conjugation',
	descriptionI18n: {el: 'Περιγραφή', en: 'Description', ru: 'Описание'},
	buttonText: 'Start',
	buttonTextI18n: {el: 'Έναρξη', en: 'Start', ru: 'Начать'},
	tags: ['verbs'],
	difficulty: 'a1',
	estimatedTimeMinutes: 5,
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1200,
		allowSkip: true,
		shuffleCases: false
	},
	blocks: [
		{
			id: 'block-1',
			name: 'Indicative',
			nameHintI18n: {el: 'Οριστική', en: 'Indicative', ru: 'Изъявительное'},
			cases: [
				{
					id: 'case-1',
					prompt: 'εγώ ___',
					promptHintI18n: {el: 'εγώ', en: 'I', ru: 'я'},
					correct: ['είμαι'],
					hint: null,
					hintI18n: null
				}
			]
		}
	]
}

const mockState: ExerciseState = {
	currentBlockIndex: 0,
	currentCaseIndex: 0,
	userAnswer: '',
	showAnswer: false,
	isCorrect: null,
	completedCases: 0,
	totalCases: 1,
	autoAdvanceEnabled: true,
	incorrectAttempts: 0,
	showNameHint: false,
	showPromptHint: false,
	showAdditionalHint: false
}

function setupMocks() {
	vi.resetAllMocks()

	const clearPulse = vi.fn()
	const handleEvent = vi.fn()
	const handleToggleAutoAdvance = vi.fn()

	vi.mocked(pulseEffectModule.usePulseEffect).mockReturnValue({
		pulseState: null,
		triggerPulse: vi.fn(),
		clearPulse
	})

	vi.mocked(initializationModule.useExerciseInitialization).mockReturnValue({
		exercise: mockExercise,
		state: mockState,
		setState: vi.fn(),
		status: 'WAITING_INPUT',
		setStatus: vi.fn(),
		currentCase: mockExercise.blocks[0]?.cases[0] as WordFormCase,
		currentBlock: mockExercise.blocks[0] as WordFormBlock,
		correctCount: 0,
		setCorrectCount: vi.fn(),
		incorrectCount: 0,
		setIncorrectCount: vi.fn(),
		startTime: 0,
		setStartTime: vi.fn()
	})

	vi.mocked(handlersModule.useExerciseHandlers).mockReturnValue({
		handleEvent,
		handleSubmitAnswer: vi.fn(),
		handleContinue: vi.fn(),
		handleRestart: vi.fn(),
		handleToggleAutoAdvance
	})

	return {clearPulse, handleEvent, handleToggleAutoAdvance}
}

describe('useWordFormExercise', () => {
	it('exposes initialization data and helpers', () => {
		const mocks = setupMocks()
		const {result} = renderHook(() =>
			useWordFormExercise({exercise: mockExercise})
		)

		expect(result.current.exercise).toBe(mockExercise)
		expect(result.current.state).toBe(mockState)
		expect(result.current.currentCase?.id).toBe('case-1')
		expect(result.current.clearPulse).toBe(mocks.clearPulse)
		expect(result.current.handleEvent).toBe(mocks.handleEvent)
	})

	it('submits trimmed answers through the handlers', () => {
		const mocks = setupMocks()
		const {result} = renderHook(() =>
			useWordFormExercise({exercise: mockExercise})
		)

		act(() => {
			result.current.handleSubmit('  είμαι  ')
		})

		expect(mocks.handleEvent).toHaveBeenCalledWith({
			type: 'SUBMIT_ANSWER',
			answer: 'είμαι'
		})
	})

	it('exposes the auto advance toggle handler', () => {
		const mocks = setupMocks()
		const {result} = renderHook(() =>
			useWordFormExercise({exercise: mockExercise})
		)

		act(() => {
			result.current.handleAutoAdvanceToggle()
		})

		expect(mocks.handleEvent).toHaveBeenCalledWith({
			type: 'TOGGLE_AUTO_ADVANCE'
		})
	})
})
