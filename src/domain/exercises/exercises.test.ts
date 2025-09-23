import {describe, expect, it} from 'vitest'
import {
	createExerciseLibraryViewModel,
	toExerciseSummary,
	toWordFormExerciseWithDefaults
} from '@/domain/exercises/adapters'
import {selectFilteredExercises} from '@/domain/exercises/selectors'
import type {ExerciseSummary} from '@/domain/exercises/types'
import type {
	ExerciseMetadataDto,
	WordFormExerciseDto
} from '@/schemas/exercises'

const baseMetadata: ExerciseMetadataDto = {
	id: 'verbs-present-tense',
	type: 'word-form',
	title: 'Συζυγία',
	titleI18n: {en: 'Conjugation', ru: 'Спряжение'},
	description: 'Περιγραφή',
	descriptionI18n: {en: 'Description', ru: 'Описание'},
	tags: ['verbs', 'present', 'verbs'],
	difficulty: 'a1',
	estimatedTimeMinutes: 10,
	totalBlocks: 2,
	totalCases: 12,
	enabled: true
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: grouped adapter tests
describe('exercise domain adapters', () => {
	it('normalizes exercise metadata into summaries', () => {
		const summary = toExerciseSummary(baseMetadata)

		expect(summary.tags).toEqual(['present', 'verbs'])
		expect(summary.availableLanguages).toEqual(['el', 'en', 'ru'])
	})

	it('creates view-model with filter options and totals', () => {
		const secondMetadata: ExerciseMetadataDto = {
			...baseMetadata,
			id: 'nouns-basic',
			tags: ['nouns'],
			difficulty: 'b1',
			enabled: false,
			titleI18n: {en: 'Nouns'},
			descriptionI18n: {en: 'Learn nouns'}
		}

		const viewModel = createExerciseLibraryViewModel([
			baseMetadata,
			secondMetadata
		])

		expect(viewModel.totals).toEqual({total: 2, enabled: 1})
		expect(viewModel.filterOptions.tags).toEqual(['nouns', 'present', 'verbs'])
		expect(viewModel.filterOptions.difficulties).toEqual(['a1', 'b1'])
		expect(viewModel.filterOptions.languages).toEqual(['el', 'en', 'ru'])
	})

	it('applies defaults and sorting for word-form exercises', () => {
		const exercise: WordFormExerciseDto = {
			enabled: true,
			id: 'word-form-basic',
			type: 'word-form',
			title: 'Λέξεις',
			description: 'Άσκηση',
			tags: ['verbs', 'a1', 'verbs'],
			difficulty: 'a0',
			estimatedTimeMinutes: 5,
			blocks: [
				{
					id: 'block-1',
					name: 'είμαι',
					cases: [
						{
							id: 'case-1',
							prompt: 'εγώ ___',
							correct: ['είμαι']
						}
					]
				}
			]
		}

		const normalized = toWordFormExerciseWithDefaults(exercise)

		expect(normalized.tags).toEqual(['a1', 'verbs'])
		expect(normalized.settings).toMatchObject({
			autoAdvance: true,
			shuffleCases: false
		})
	})
})

describe('exercise domain selectors', () => {
	const summaries: ExerciseSummary[] = [
		toExerciseSummary(baseMetadata),
		toExerciseSummary({
			...baseMetadata,
			id: 'verbs-advanced',
			difficulty: 'c1',
			tags: ['verbs'],
			titleI18n: {en: 'Advanced Verbs'},
			descriptionI18n: {en: 'Advanced description'}
		})
	]

	it('filters exercises by tags, difficulty, and language', () => {
		const filtered = selectFilteredExercises(summaries, {
			tags: ['verbs'],
			difficulties: ['c1'],
			languages: ['en']
		})

		expect(filtered.map(exercise => exercise.id)).toEqual(['verbs-advanced'])
	})

	it('omits exercises that do not support selected languages', () => {
		const filtered = selectFilteredExercises(summaries, {
			tags: [],
			difficulties: [],
			languages: ['ru', 'en']
		})

		expect(filtered.map(exercise => exercise.id)).toEqual([
			'verbs-present-tense'
		])

		const [, advancedSummary] = summaries

		if (!advancedSummary) {
			throw new Error('Expected advanced summary for selector tests')
		}

		const noRussianSupport = selectFilteredExercises([advancedSummary], {
			tags: [],
			difficulties: [],
			languages: ['ru']
		})

		expect(noRussianSupport).toHaveLength(0)
	})
})
