import {act} from '@testing-library/react'
import {renderHook} from '@tests/utils'
import {describe, expect, it, vi} from 'vitest'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormExercise
} from '@/types/exercises'
import {useAnswerHandler} from './useAnswerHandler'

const exercise: WordFormExercise = {
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
		autoAdvanceDelayMs: 1500,
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

const initialState: ExerciseState = {
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

function createHook(status: ExerciseStatus) {
	const setState = vi.fn()
	const setStatus = vi.fn()
	const setCorrectCount = vi.fn()
	const setIncorrectCount = vi.fn()
	const triggerPulse = vi.fn()
	const handleContinue = vi.fn()

	const {result} = renderHook(() =>
		useAnswerHandler({
			exercise,
			state: initialState,
			status,
			currentCase: exercise.blocks[0]?.cases[0],
			setState,
			setStatus,
			setCorrectCount,
			setIncorrectCount,
			triggerPulse,
			handleContinue
		})
	)

	return {
		handleSubmit: result.current.handleSubmitAnswer,
		setState,
		setStatus,
		setCorrectCount,
		setIncorrectCount,
		triggerPulse,
		handleContinue
	}
}

describe('useAnswerHandler', () => {
	it('marks answers as correct and auto advances when enabled', () => {
		vi.useFakeTimers()
		const hook = createHook('WAITING_INPUT')

		act(() => {
			hook.handleSubmit('είμαι')
		})

		expect(hook.setStatus).toHaveBeenCalledWith('CHECKING')
		expect(hook.setCorrectCount).toHaveBeenCalledTimes(1)
		expect(hook.triggerPulse).toHaveBeenCalledWith(true)

		vi.advanceTimersByTime(1500)
		expect(hook.handleContinue).toHaveBeenCalledTimes(1)
	})

	it('handles incorrect answers and requests correction', () => {
		vi.useFakeTimers()
		const hook = createHook('WAITING_INPUT')

		act(() => {
			hook.handleSubmit('ειμαί')
		})

		expect(hook.setIncorrectCount).toHaveBeenCalledTimes(1)
		expect(hook.triggerPulse).toHaveBeenCalledWith(false)
		expect(hook.setStatus).toHaveBeenCalledWith('WRONG_ANSWER')

		vi.advanceTimersByTime(2000)
		expect(hook.setStatus).toHaveBeenCalledWith('REQUIRE_CORRECTION')
	})

	it('ignores submissions when status is not accepting answers', () => {
		const hook = createHook('CHECKING')

		act(() => {
			hook.handleSubmit('είμαι')
		})

		expect(hook.setStatus).not.toHaveBeenCalled()
	})

	it('ignores empty answers', () => {
		const hook = createHook('WAITING_INPUT')

		act(() => {
			hook.handleSubmit('   ')
		})

		expect(hook.setStatus).not.toHaveBeenCalled()
	})
})
