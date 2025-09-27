import {describe, expect, it, vi} from 'vitest'
import {
	createExerciseLibraryViewModel,
	toExerciseSummary,
	toWordFormExerciseWithDefaults
} from '@/domain/exercises/adapters'
import {
	createMemoizedSelector,
	selectDifficultyOptions,
	selectExerciseLibraryViewModel,
	selectFilteredExercises,
	selectFilterOptions,
	selectHasEnabledExercises,
	selectLanguageOptions,
	selectTagOptions
} from '@/domain/exercises/selectors'
import type {ExerciseSummary} from '@/domain/exercises/types'
import type {
	ExerciseMetadataDto,
	WordFormExerciseDto
} from '@/schemas/exercises'

const baseMetadata: ExerciseMetadataDto = {
	id: 'verbs-present-tense',
	type: 'word-form',
	language: 'el',
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
		expect(viewModel.filterOptions.languages).toEqual(['el'])
	})

	it('applies defaults and sorting for word-form exercises', () => {
		const exercise: WordFormExerciseDto = {
			enabled: true,
			id: 'word-form-basic',
			type: 'word-form',
			language: 'el',
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

const advancedMetadata: ExerciseMetadataDto = {
	...baseMetadata,
	id: 'verbs-advanced',
	language: 'en',
	difficulty: 'c1',
	tags: ['verbs'],
	titleI18n: {en: 'Advanced Verbs'},
	descriptionI18n: {en: 'Advanced description'}
}

const baseSummary = toExerciseSummary(baseMetadata)
const advancedSummary = toExerciseSummary(advancedMetadata)

function createSummaries(): ExerciseSummary[] {
	return [baseSummary, advancedSummary]
}

describe('exercise library memoization', () => {
	it('memoizes the exercise library view model for identical metadata references', () => {
		const metadataList: ExerciseMetadataDto[] = [
			{...baseMetadata},
			{...baseMetadata, id: 'secondary', enabled: false}
		]

		const first = selectExerciseLibraryViewModel(metadataList)
		const second = selectExerciseLibraryViewModel(metadataList)

		expect(second).toBe(first)
	})

	it('invalidates the memoized library view model when metadata identity changes', () => {
		const metadataList: ExerciseMetadataDto[] = [
			{...baseMetadata},
			{...baseMetadata, id: 'secondary', enabled: false}
		]

		const first = selectExerciseLibraryViewModel(metadataList)
		const second = selectExerciseLibraryViewModel([...metadataList])

		expect(second).not.toBe(first)
	})
})

describe('exercise library selectors', () => {
	it('exposes filter, difficulty, tag, and language options', () => {
		const viewModel = createExerciseLibraryViewModel([
			{...baseMetadata},
			{...baseMetadata, id: 'disabled', enabled: false, tags: ['nouns']}
		])

		expect(selectFilterOptions(viewModel)).toBe(viewModel.filterOptions)
		expect(selectDifficultyOptions(viewModel)).toEqual(['a1'])
		expect(selectTagOptions(viewModel)).toEqual(['nouns', 'present', 'verbs'])
		expect(selectLanguageOptions(viewModel)).toEqual(['el'])
	})

	it('indicates whether any exercises remain enabled', () => {
		const enabledModel = createExerciseLibraryViewModel([
			{...baseMetadata},
			{...baseMetadata, id: 'disabled', enabled: false}
		])

		expect(selectHasEnabledExercises(enabledModel)).toBe(true)

		const disabledModel = createExerciseLibraryViewModel([
			{...baseMetadata, id: 'all-disabled', enabled: false}
		])

		expect(selectHasEnabledExercises(disabledModel)).toBe(false)
	})
})

describe('selectFilteredExercises', () => {
	it('returns the original list when no filters are applied', () => {
		const summaries = createSummaries()
		const filtered = selectFilteredExercises(summaries, {
			tags: [],
			difficulties: [],
			languages: []
		})

		expect(filtered).toBe(summaries)
	})

	it('filters exercises by tags, difficulty, and language', () => {
		const summaries = createSummaries()
		const filtered = selectFilteredExercises(summaries, {
			tags: ['verbs'],
			difficulties: ['c1'],
			languages: ['en']
		})

		expect(filtered.map(exercise => exercise.id)).toEqual(['verbs-advanced'])
	})

	it('omits exercises that do not support selected languages', () => {
		const summaries = createSummaries()
		const filtered = selectFilteredExercises(summaries, {
			tags: [],
			difficulties: [],
			languages: ['ru', 'en']
		})

		expect(filtered.map(exercise => exercise.id)).toEqual([
			'verbs-present-tense'
		])

		const noRussianSupport = selectFilteredExercises([advancedSummary], {
			tags: [],
			difficulties: [],
			languages: ['ru']
		})

		expect(noRussianSupport).toHaveLength(0)
	})
})

describe('createMemoizedSelector', () => {
	it('returns cached results when arguments remain identical', () => {
		const compute = vi.fn((value: number) => ({value}))
		const memoized = createMemoizedSelector((value: number) => compute(value))

		const first = memoized(1)
		const second = memoized(1)

		expect(second).toBe(first)
		expect(compute).toHaveBeenCalledTimes(1)
	})

	it('recomputes when argument identity changes', () => {
		const compute = vi.fn((value: number) => ({value}))
		const memoized = createMemoizedSelector((value: number) => compute(value))

		memoized(1)
		memoized(2)

		expect(compute).toHaveBeenCalledTimes(2)
	})

	it('recomputes when argument length differs', () => {
		const compute = vi.fn((...values: number[]) =>
			values.reduce((total, value) => total + value, 0)
		)
		const memoized = createMemoizedSelector((...values: number[]) =>
			compute(...values)
		)

		memoized(1, 2)
		memoized(1)

		expect(compute).toHaveBeenCalledTimes(2)
	})
})
