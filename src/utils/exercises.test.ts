import {describe, expect, it, vi} from 'vitest'
import type {ExerciseMetadata, WordFormExercise} from '@/types/exercises'
import {
	checkAnswer,
	extractExerciseMetadata,
	filterExercisesByTags,
	getCaseByIndices,
	getCompletedCasesCount,
	getNextIndices,
	getTotalCases,
	normalizeGreekText,
	normalizeGreekTextWithoutTones,
	shuffleExerciseCases
} from './exercises'

const baseExercise: WordFormExercise = {
	enabled: true,
	id: 'verbs-be',
	type: 'word-form',
	title: 'To be',
	titleI18n: {el: 'Είμαι', en: 'To be', ru: 'Быть'},
	description: 'Conjugation of the verb to be',
	descriptionI18n: {el: 'Περιγραφή', en: 'Description', ru: 'Описание'},
	buttonText: 'Start',
	buttonTextI18n: {el: 'Έναρξη', en: 'Start', ru: 'Начать'},
	tags: ['verbs', 'beginner'],
	difficulty: 'a1',
	estimatedTimeMinutes: 5,
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1500,
		allowSkip: false,
		shuffleCases: true
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
				},
				{
					id: 'case-2',
					prompt: 'εσύ ___',
					promptHintI18n: {el: 'εσύ', en: 'you', ru: 'ты'},
					correct: ['είσαι', 'είσουνα'],
					hint: 'Singular you',
					hintI18n: {el: 'Εσύ', en: 'You', ru: 'Ты'}
				}
			]
		},
		{
			id: 'block-2',
			name: 'Plural',
			nameHintI18n: {el: 'Πληθυντικός', en: 'Plural', ru: 'Множественное'},
			cases: [
				{
					id: 'case-3',
					prompt: 'εμείς ___',
					promptHintI18n: {el: 'εμείς', en: 'we', ru: 'мы'},
					correct: ['είμαστε'],
					hint: null,
					hintI18n: null
				}
			]
		}
	]
}

describe('normalizeGreekText', () => {
	it('trims whitespace and lowercases text', () => {
		expect(normalizeGreekText('  ΕίΜαι  ')).toBe('είμαι')
	})

	it('removes tone marks when requested', () => {
		expect(normalizeGreekTextWithoutTones('ΉΜΑΣΤΑΝ')).toBe('ημασταν')
	})

	it('compares answers with optional tone sensitivity', () => {
		expect(checkAnswer('εισαι', ['είσαι'], true)).toBe(true)
		expect(checkAnswer('εισαι', ['είσαι'], false)).toBe(false)
	})
})

describe('exercise navigation helpers', () => {
	it('calculates totals and retrieves cases by index', () => {
		expect(getTotalCases(baseExercise)).toBe(3)
		expect(getCaseByIndices(baseExercise, 0, 1)?.id).toBe('case-2')
		expect(getCaseByIndices(baseExercise, 2, 0)).toBeUndefined()
	})

	it('computes next indices and completed counts', () => {
		expect(getNextIndices(baseExercise, 0, 0)).toEqual({
			blockIndex: 0,
			caseIndex: 1
		})
		expect(getNextIndices(baseExercise, 0, 1)).toEqual({
			blockIndex: 1,
			caseIndex: 0
		})
		expect(getNextIndices(baseExercise, 1, 0)).toBeNull()
		expect(getCompletedCasesCount(baseExercise, 1, 0)).toBe(2)
	})
})

describe('exercise transformation helpers', () => {
	it('extracts metadata for list views', () => {
		const metadata = extractExerciseMetadata(baseExercise)
		const expected: ExerciseMetadata = {
			id: 'verbs-be',
			type: 'word-form',
			title: 'To be',
			titleI18n: baseExercise.titleI18n,
			description: 'Conjugation of the verb to be',
			descriptionI18n: baseExercise.descriptionI18n,
			tags: ['verbs', 'beginner'],
			difficulty: 'a1',
			estimatedTimeMinutes: 5,
			totalBlocks: 2,
			totalCases: 3,
			enabled: true
		}

		expect(metadata).toEqual(expected)
	})

	it('shuffles cases deterministically when enabled', () => {
		const spy = vi.spyOn(Math, 'random').mockReturnValue(0.75)
		const shuffled = shuffleExerciseCases(baseExercise)
		spy.mockRestore()

		expect(shuffled.blocks[0]?.cases).not.toBe(baseExercise.blocks[0]?.cases)
		expect(shuffled.blocks[0]?.cases).toHaveLength(2)
	})

	it('returns the same structure when shuffling is disabled', () => {
		const result = shuffleExerciseCases({
			...baseExercise,
			settings: {...baseExercise.settings, shuffleCases: false}
		})

		expect(result.blocks[0]?.cases).toEqual(baseExercise.blocks[0]?.cases)
	})

	it('filters metadata by tags', () => {
		const allMetadata = [
			extractExerciseMetadata(baseExercise),
			{
				...extractExerciseMetadata(baseExercise),
				id: 'verbs-have',
				tags: ['verbs', 'intermediate'],
				difficulty: 'b1'
			}
		]

		expect(filterExercisesByTags(allMetadata, ['beginner'])).toEqual([
			allMetadata[0]
		])
		expect(filterExercisesByTags(allMetadata, [])).toEqual(allMetadata)
	})
})
