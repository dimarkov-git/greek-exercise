import {afterEach, beforeEach, expect, it, vi} from 'vitest'
import type {WordFormExercise} from '@/entities/exercise'
import {
	initializeWordFormState,
	selectCurrentCase,
	selectHintVisibility,
	selectNextIndices,
	selectProgress,
	wordFormReducer
} from './wordFormMachine'

const baseExercise: WordFormExercise = {
	enabled: true,
	id: 'verbs-be',
	type: 'word-form',
	language: 'el',
	title: 'Είμαι',
	description: 'Κλίση του ρήματος είμαι',
	tags: ['verbs', 'a1'],
	difficulty: 'a1',
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 500,
		allowSkip: true,
		shuffleCases: false
	},
	blocks: [
		{
			id: 'present',
			name: 'Ενεστώτας',
			cases: [
				{
					id: 'case-1',
					prompt: 'εγώ ___',
					correct: ['είμαι']
				},
				{
					id: 'case-2',
					prompt: 'εσύ ___',
					correct: ['είσαι']
				}
			]
		},
		{
			id: 'plural',
			name: 'Πληθυντικός',
			cases: [
				{
					id: 'case-3',
					prompt: 'εμείς ___',
					correct: ['είμαστε']
				}
			]
		}
	]
}

beforeEach(() => {
	vi.spyOn(Date, 'now').mockReturnValue(1000)
})

afterEach(() => {
	vi.restoreAllMocks()
})

it('initialises deterministic state with defaults applied', () => {
	const state = initializeWordFormState(baseExercise)

	expect(state.status).toBe('WAITING_INPUT')
	expect(state.autoAdvanceEnabled).toBe(true)
	expect(state.totalCases).toBe(3)
	expect(state.startedAt).toBe(1000)
	expect(selectHintVisibility(state)).toEqual({
		name: false,
		prompt: false,
		additional: false
	})
})

it('marks answers as correct and increments stats when appropriate', () => {
	const initial = initializeWordFormState(baseExercise)

	const next = wordFormReducer(initial, {
		type: 'ANSWER_CORRECT',
		answer: 'είμαι',
		incrementCorrect: true
	})

	expect(next.status).toBe('CORRECT_ANSWER')
	expect(next.stats.correct).toBe(1)
	expect(next.isCorrect).toBe(true)
})

it('marks answers as incorrect, reveals answer, and increments stats when requested', () => {
	const initial = initializeWordFormState(baseExercise)

	const next = wordFormReducer(initial, {
		type: 'ANSWER_INCORRECT',
		answer: 'λάθος',
		incrementIncorrect: true
	})

	expect(next.status).toBe('WRONG_ANSWER')
	expect(next.stats.incorrect).toBe(1)
	expect(next.showAnswer).toBe(true)
	expect(next.isCorrect).toBe(false)
})

it('advances to the next case and resets transient answer state', () => {
	const initial = initializeWordFormState(baseExercise)

	const progressed = wordFormReducer(initial, {
		type: 'ADVANCE',
		next: {blockIndex: 0, caseIndex: 1}
	})

	expect(progressed.currentBlockIndex).toBe(0)
	expect(progressed.currentCaseIndex).toBe(1)
	expect(progressed.userAnswer).toBe('')
	expect(progressed.incorrectAttempts).toBe(0)
	expect(progressed.status).toBe('WAITING_INPUT')
})

it('toggles hints individually without affecting other flags', () => {
	const initial = initializeWordFormState(baseExercise)

	const toggled = wordFormReducer(initial, {
		type: 'TOGGLE_HINT',
		hintType: 'prompt'
	})

	expect(toggled.hints.prompt).toBe(true)
	expect(toggled.hints.name).toBe(false)
})

it('toggles auto-advance state', () => {
	const initial = initializeWordFormState(baseExercise)

	const toggled = wordFormReducer(initial, {type: 'TOGGLE_AUTO_ADVANCE'})
	expect(toggled.autoAdvanceEnabled).toBe(false)
})

it('computes next indices and progress across blocks', () => {
	const initial = initializeWordFormState(baseExercise)
	const withProgress = {
		...initial,
		currentBlockIndex: 0,
		currentCaseIndex: 1
	}

	expect(selectNextIndices(withProgress)).toEqual({
		blockIndex: 1,
		caseIndex: 0
	})

	expect(selectProgress(withProgress)).toEqual({
		completed: 1,
		current: 2,
		total: 3
	})
})

it('selects the current case safely', () => {
	const initial = initializeWordFormState(baseExercise)
	const currentCase = selectCurrentCase(initial)
	expect(currentCase?.id).toBe('case-1')

	const outOfRange = {
		...initial,
		currentBlockIndex: 5,
		currentCaseIndex: 0
	}

	expect(selectCurrentCase(outOfRange)).toBeUndefined()
})
