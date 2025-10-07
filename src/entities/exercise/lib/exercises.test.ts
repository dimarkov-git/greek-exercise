import {describe, expect, it, vi} from 'vitest'
import type {
	ExerciseMetadata,
	ExerciseSettings,
	WordFormExercise
} from '@/entities/exercise'
import {
	calculateAccuracy,
	checkAnswer,
	extractExerciseMetadata,
	filterExercisesByDifficulty,
	filterExercisesByTags,
	formatDuration,
	generateId,
	getAllTags,
	getCaseByIndices,
	getCompletedCasesCount,
	getNextIndices,
	getTotalCases,
	hasGreekTones,
	normalizeGreekText,
	normalizeGreekTextWithoutTones,
	shuffleExerciseCases
} from './exercises'

const CASE_IDENTIFIER_PATTERN = /^case-\d+-[a-z0-9]{0,7}$/

const sampleExercise: WordFormExercise = {
	enabled: true,
	id: 'verbs-be',
	type: 'word-form',
	language: 'el',
	title: 'Είμαι',
	description: 'Ρήμα είμαι',
	tags: ['verbs', 'a1'],
	difficulty: 'a1',
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

	it('detects Greek tone marks', () => {
		expect(hasGreekTones('είμαι')).toBe(true)
		expect(hasGreekTones('ειμαι')).toBe(false)
		expect(hasGreekTones('μιλάω')).toBe(true)
		expect(hasGreekTones('μιλαω')).toBe(false)
	})

	describe('checkAnswer with allowSkipTone = false (strict mode)', () => {
		it('requires exact match with tones', () => {
			expect(checkAnswer('είμαι', ['είμαι'], false)).toBe(true)
			expect(checkAnswer('ειμαι', ['είμαι'], false)).toBe(false)
		})
	})

	describe('checkAnswer with allowSkipTone = true', () => {
		it('accepts answers without tones', () => {
			expect(checkAnswer('ειμαι', ['είμαι'], true)).toBe(true)
			expect(checkAnswer('μιλαω', ['μιλάω'], true)).toBe(true)
		})

		it('requires correct tones when user provides them', () => {
			expect(checkAnswer('είμαι', ['είμαι'], true)).toBe(true)
			expect(checkAnswer('εἰμαι', ['είμαι'], true)).toBe(false)
		})

		it('rejects wrong tones', () => {
			// Wrong tone position should fail
			expect(checkAnswer('ειμαί', ['είμαι'], true)).toBe(false)
		})

		it('works with multiple correct answers', () => {
			expect(checkAnswer('μιλαω', ['μιλάω', 'μιλώ'], true)).toBe(true)
			expect(checkAnswer('μιλάω', ['μιλάω', 'μιλώ'], true)).toBe(true)
			expect(checkAnswer('μιλώ', ['μιλάω', 'μιλώ'], true)).toBe(true)
		})
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

describe('extractExerciseMetadata', () => {
	it('preserves optional translations while deriving totals', () => {
		const exerciseWithTranslations: WordFormExercise = {
			...sampleExercise,
			titleI18n: {en: 'Be'},
			descriptionI18n: {en: 'To be'},
			settings: {...sampleExercise.settings} as ExerciseSettings
		}

		const metadata = extractExerciseMetadata(exerciseWithTranslations)

		expect(metadata).toMatchObject({
			id: 'verbs-be',
			totalBlocks: 2,
			totalCases: 3,
			titleI18n: {en: 'Be'},
			descriptionI18n: {en: 'To be'}
		})
	})
})

describe('shuffleExerciseCases', () => {
	it('avoids mutating source exercise when shuffling is disabled', () => {
		const shuffled = shuffleExerciseCases(sampleExercise)

		const originalFirstBlock = sampleExercise.blocks[0]
		const shuffledFirstBlock = shuffled.blocks[0]

		if (!(originalFirstBlock && shuffledFirstBlock)) {
			throw new Error('Expected exercise blocks to be defined')
		}

		expect(shuffled).toBe(sampleExercise)
		expect(shuffledFirstBlock.cases).toBe(originalFirstBlock.cases)
	})

	it('shuffles cases when shuffle setting is enabled', () => {
		const exerciseWithShuffle: WordFormExercise = {
			...sampleExercise,
			blocks: sampleExercise.blocks.map(block => ({
				...block,
				cases: block.cases.map(caseItem => ({...caseItem}))
			})),
			settings: {
				...sampleExercise.settings,
				shuffleCases: true
			} as ExerciseSettings
		}

		const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(1)

		const shuffled = shuffleExerciseCases(exerciseWithShuffle)
		const shuffledFirstBlock = shuffled.blocks[0]
		const originalFirstBlock = exerciseWithShuffle.blocks[0]

		if (!(shuffledFirstBlock && originalFirstBlock)) {
			throw new Error('Expected shuffled blocks to be defined')
		}

		expect(shuffled).not.toBe(exerciseWithShuffle)
		expect(shuffledFirstBlock.cases).not.toBe(originalFirstBlock.cases)

		randomSpy.mockRestore()
	})
})

describe('Exercise filtering utilities', () => {
	const baseMetadata = extractExerciseMetadata(sampleExercise)
	const secondMetadata: ExerciseMetadata = {
		...baseMetadata,
		id: 'verbs-past',
		tags: ['verbs', 'past'],
		difficulty: 'b1'
	}

	const exercisesMetadata: ExerciseMetadata[] = [baseMetadata, secondMetadata]

	it('filters by tags when tags are provided', () => {
		const filtered = filterExercisesByTags(exercisesMetadata, ['past'])
		expect(filtered).toHaveLength(1)
		expect(filtered[0]?.id).toBe('verbs-past')
	})

	it('returns all exercises when tag filter is empty', () => {
		expect(filterExercisesByTags(exercisesMetadata, [])).toBe(exercisesMetadata)
	})

	it('filters by difficulty and respects null filter', () => {
		expect(filterExercisesByDifficulty(exercisesMetadata, 'b1')).toHaveLength(1)
		expect(filterExercisesByDifficulty(exercisesMetadata, null)).toBe(
			exercisesMetadata
		)
	})

	it('collects all unique tags in sorted order', () => {
		expect(getAllTags(exercisesMetadata)).toEqual(['a1', 'past', 'verbs'])
	})
})

describe('Exercise formatting helpers', () => {
	it('formats durations with second and minute granularity', () => {
		expect(formatDuration(30_000)).toBe('30s')
		expect(formatDuration(90_000)).toBe('1m 30s')
	})

	it('generates unique ids with the expected structure', () => {
		const id = generateId('case')
		expect(id).toMatch(CASE_IDENTIFIER_PATTERN)
	})
})
