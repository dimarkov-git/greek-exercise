import {describe, expect, it} from 'vitest'
import type {WordFormExercise} from '@/types/exercises'
import {
	validateExercisesList,
	validateWordFormBlock,
	validateWordFormExercise
} from './exercises'

const validExercise: WordFormExercise = {
	enabled: true,
	id: 'verbs-be',
	type: 'word-form',
	title: 'To be',
	titleI18n: {el: 'Είμαι', en: 'To be', ru: 'Быть'},
	description: 'Conjugation of the verb to be',
	descriptionI18n: {el: 'Περιγραφή', en: 'Description', ru: 'Описание'},
	buttonText: 'Start',
	buttonTextI18n: {el: 'Έναρξη', en: 'Start', ru: 'Начать'},
	tags: ['verbs'],
	difficulty: 'a1',
	estimatedTimeMinutes: 5,
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1000,
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

describe('exercise schemas', () => {
	it('validates a full word form exercise', () => {
		expect(validateWordFormExercise(validExercise)).toEqual(validExercise)
	})

	it('rejects exercises with invalid difficulty', () => {
		const invalid = {...validExercise, difficulty: 'zz'}

		expect(() => validateWordFormExercise(invalid)).toThrow()
	})

	it('validates block structure independently', () => {
		expect(validateWordFormBlock(validExercise.blocks[0])).toEqual(
			validExercise.blocks[0]
		)
	})

	it('validates metadata list', () => {
		const metadata = validateWordFormExercise(validExercise)
		const result = validateExercisesList([
			{
				id: metadata.id,
				type: metadata.type,
				title: metadata.title,
				titleI18n: metadata.titleI18n,
				description: metadata.description,
				descriptionI18n: metadata.descriptionI18n,
				tags: metadata.tags,
				difficulty: metadata.difficulty,
				estimatedTimeMinutes: metadata.estimatedTimeMinutes,
				totalBlocks: metadata.blocks.length,
				totalCases: metadata.blocks.reduce(
					(count, block) => count + block.cases.length,
					0
				),
				enabled: metadata.enabled
			}
		])

		expect(result).toHaveLength(1)
		expect(result[0]?.id).toBe('verbs-be')
	})
})
