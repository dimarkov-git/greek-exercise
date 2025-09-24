import {describe, expect, it} from 'vitest'
import type {WordFormExercise} from '@/types/exercises'
import {
	calculateAccuracy,
	checkAnswer,
	getCaseByIndices,
	getCompletedCasesCount,
	getNextIndices,
	getTotalCases,
	normalizeGreekText,
	normalizeGreekTextWithoutTones
} from './exercises'

const sampleExercise: WordFormExercise = {
	enabled: true,
	id: 'verbs-be',
	type: 'word-form',
	title: 'Είμαι',
	description: 'Ρήμα είμαι',
	tags: ['verbs', 'a1'],
	difficulty: 'a1',
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
			name: 'Ενεστώτας',
			cases: [
				{id: 'case-1', prompt: 'εγώ ___', correct: ['είμαι']},
				{id: 'case-2', prompt: 'εσύ ___', correct: ['είσαι']}
			]
		},
		{
			id: 'block-2',
			name: 'Πληθυντικός',
			cases: [{id: 'case-3', prompt: 'εμείς ___', correct: ['είμαστε']}]
		}
	]
}

describe('Greek text helpers', () => {
	it('normalises Greek text by trimming and lowercasing', () => {
		expect(normalizeGreekText('  ΕΊΜΑΙ  ')).toBe('είμαι')
	})

	it('removes tone marks when requested', () => {
		expect(normalizeGreekTextWithoutTones('ΕΊΜΑΙ')).toBe('ειμαι')
	})

	it('compares answers with optional tone sensitivity', () => {
		expect(checkAnswer('είμαι', ['είμαι'])).toBe(true)
		expect(checkAnswer('ειμαι', ['είμαι'])).toBe(false)
		expect(checkAnswer('ειμαι', ['είμαι'], true)).toBe(true)
	})
})

describe('Word-form exercise navigation helpers', () => {
	it('derives totals and case lookups', () => {
		expect(getTotalCases(sampleExercise)).toBe(3)
		expect(getCaseByIndices(sampleExercise, 0, 1)?.id).toBe('case-2')
	})

	it('computes completed count and next indices across blocks', () => {
		expect(getCompletedCasesCount(sampleExercise, 0, 1)).toBe(1)
		expect(getNextIndices(sampleExercise, 0, 1)).toEqual({
			blockIndex: 1,
			caseIndex: 0
		})
		expect(getNextIndices(sampleExercise, 1, 0)).toBeNull()
	})
})

describe('Exercise statistics helpers', () => {
	it('calculates accuracy safely', () => {
		expect(calculateAccuracy(7, 10)).toBe(70)
		expect(calculateAccuracy(0, 0)).toBe(0)
	})
})
