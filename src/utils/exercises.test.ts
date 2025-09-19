import {describe, expect, it} from 'vitest'
import type {WordFormExercise} from '@/types/exercises'
import {
	calculateAccuracy,
	checkAnswer,
	extractExerciseMetadata,
	filterExercisesByDifficulty,
	filterExercisesByTags,
	formatDuration,
	getAllTags,
	getCaseByIndices,
	getCompletedCasesCount,
	getNextIndices,
	getTotalCases,
	normalizeGreekText,
	normalizeGreekTextWithoutTones,
	shuffleExerciseCases
} from './exercises'

describe('Greek text processing', () => {
	describe('normalizeGreekText', () => {
		it('should trim whitespace', () => {
			expect(normalizeGreekText('  είμαι  ')).toBe('είμαι')
		})

		it('should convert to lowercase', () => {
			expect(normalizeGreekText('ΕΊΜΑΙ')).toBe('είμαι')
		})

		it('should normalize Unicode (NFD to NFC)', () => {
			// Test with decomposed Unicode (NFD) vs composed (NFC)
			const composed = 'είμαι' // NFC
			const decomposed = 'είμαι' // NFD (visually same but different Unicode)
			expect(normalizeGreekText(decomposed)).toBe(composed)
		})

		it('should handle empty string', () => {
			expect(normalizeGreekText('')).toBe('')
		})

		it('should handle mixed case with accents', () => {
			expect(normalizeGreekText('Είμαι')).toBe('είμαι')
		})
	})

	describe('normalizeGreekTextWithoutTones', () => {
		it('should remove tone marks from lowercase vowels', () => {
			expect(normalizeGreekTextWithoutTones('ά')).toBe('α')
			expect(normalizeGreekTextWithoutTones('έ')).toBe('ε')
			expect(normalizeGreekTextWithoutTones('ή')).toBe('η')
			expect(normalizeGreekTextWithoutTones('ί')).toBe('ι')
			expect(normalizeGreekTextWithoutTones('ό')).toBe('ο')
			expect(normalizeGreekTextWithoutTones('ύ')).toBe('υ')
			expect(normalizeGreekTextWithoutTones('ώ')).toBe('ω')
		})

		it('should remove tone marks from uppercase vowels', () => {
			expect(normalizeGreekTextWithoutTones('Ά')).toBe('α')
			expect(normalizeGreekTextWithoutTones('Έ')).toBe('ε')
			expect(normalizeGreekTextWithoutTones('Ή')).toBe('η')
			expect(normalizeGreekTextWithoutTones('Ί')).toBe('ι')
			expect(normalizeGreekTextWithoutTones('Ό')).toBe('ο')
			expect(normalizeGreekTextWithoutTones('Ύ')).toBe('υ')
			expect(normalizeGreekTextWithoutTones('Ώ')).toBe('ω')
		})

		it('should handle diaeresis with tone marks', () => {
			expect(normalizeGreekTextWithoutTones('ΰ')).toBe('υ')
			expect(normalizeGreekTextWithoutTones('ΐ')).toBe('ι')
		})

		it('should normalize full words', () => {
			expect(normalizeGreekTextWithoutTones('είμαι')).toBe('ειμαι')
			expect(normalizeGreekTextWithoutTones('ήμουν')).toBe('ημουν')
			expect(normalizeGreekTextWithoutTones('ΕΊΜΑΙ')).toBe('ειμαι')
		})

		it('should preserve non-Greek characters', () => {
			expect(normalizeGreekTextWithoutTones('hello είμαι')).toBe('hello ειμαι')
		})

		it('should handle empty string', () => {
			expect(normalizeGreekTextWithoutTones('')).toBe('')
		})
	})

	describe('checkAnswer', () => {
		it('should accept correct answers with exact match', () => {
			expect(checkAnswer('είμαι', ['είμαι'])).toBe(true)
		})

		it('should accept multiple correct answers', () => {
			expect(checkAnswer('είμαι', ['είμαι', 'ειμαι'])).toBe(true)
			expect(checkAnswer('ειμαι', ['είμαι', 'ειμαι'])).toBe(true)
		})

		it('should be case insensitive', () => {
			expect(checkAnswer('ΕΊΜΑΙ', ['είμαι'])).toBe(true)
			expect(checkAnswer('Είμαι', ['είμαι'])).toBe(true)
		})

		it('should trim whitespace from user input', () => {
			expect(checkAnswer('  είμαι  ', ['είμαι'])).toBe(true)
		})

		it('should reject incorrect answers', () => {
			expect(checkAnswer('είσαι', ['είμαι'])).toBe(false)
		})

		it('should ignore tones when ignoreTones is true', () => {
			expect(checkAnswer('ειμαι', ['είμαι'], true)).toBe(true)
			expect(checkAnswer('είμαι', ['ειμαι'], true)).toBe(true)
		})

		it('should respect tones when ignoreTones is false', () => {
			expect(checkAnswer('ειμαι', ['είμαι'], false)).toBe(false)
			expect(checkAnswer('είμαι', ['είμαι'], false)).toBe(true)
		})

		it('should handle empty answer', () => {
			expect(checkAnswer('', ['είμαι'])).toBe(false)
		})

		it('should handle empty correct answers array', () => {
			expect(checkAnswer('είμαι', [])).toBe(false)
		})
	})
})

describe('Exercise navigation and calculation', () => {
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
		tags: ['test', 'beginner'],
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
						id: 'case-1-1',
						prompt: 'εγώ ___',
						promptHintI18n: {el: 'I', en: 'I', ru: 'я'},
						correct: ['είμαι'],
						hint: null,
						hintI18n: null
					},
					{
						id: 'case-1-2',
						prompt: 'εσύ ___',
						promptHintI18n: {el: 'you', en: 'you', ru: 'ты'},
						correct: ['είσαι'],
						hint: null,
						hintI18n: null
					}
				]
			},
			{
				id: 'block-2',
				name: 'Block 2',
				nameHintI18n: {el: 'Block 2', en: 'Block 2', ru: 'Block 2'},
				cases: [
					{
						id: 'case-2-1',
						prompt: 'αυτός ___',
						promptHintI18n: {el: 'he', en: 'he', ru: 'он'},
						correct: ['είναι'],
						hint: null,
						hintI18n: null
					}
				]
			}
		]
	}

	describe('getTotalCases', () => {
		it('should calculate total cases across all blocks', () => {
			expect(getTotalCases(mockExercise)).toBe(3)
		})

		it('should return 0 for exercise with no blocks', () => {
			const emptyExercise = {...mockExercise, blocks: []}
			expect(getTotalCases(emptyExercise)).toBe(0)
		})
	})

	describe('getCaseByIndices', () => {
		it('should return correct case for valid indices', () => {
			const case_ = getCaseByIndices(mockExercise, 0, 0)
			expect(case_).toEqual({
				id: 'case-1-1',
				prompt: 'εγώ ___',
				promptHintI18n: {el: 'I', en: 'I', ru: 'я'},
				correct: ['είμαι'],
				hint: null,
				hintI18n: null
			})
		})

		it('should return undefined for invalid block index', () => {
			expect(getCaseByIndices(mockExercise, 5, 0)).toBeUndefined()
		})

		it('should return undefined for invalid case index', () => {
			expect(getCaseByIndices(mockExercise, 0, 5)).toBeUndefined()
		})

		it('should handle negative indices', () => {
			expect(getCaseByIndices(mockExercise, -1, 0)).toBeUndefined()
			expect(getCaseByIndices(mockExercise, 0, -1)).toBeUndefined()
		})
	})

	describe('getNextIndices', () => {
		it('should return next case in same block', () => {
			const next = getNextIndices(mockExercise, 0, 0)
			expect(next).toEqual({blockIndex: 0, caseIndex: 1})
		})

		it('should move to next block when current block is finished', () => {
			const next = getNextIndices(mockExercise, 0, 1)
			expect(next).toEqual({blockIndex: 1, caseIndex: 0})
		})

		it('should return null when exercise is finished', () => {
			const next = getNextIndices(mockExercise, 1, 0)
			expect(next).toBeNull()
		})

		it('should return null for invalid indices', () => {
			expect(getNextIndices(mockExercise, 5, 0)).toBeNull()
		})
	})

	describe('getCompletedCasesCount', () => {
		it('should return 0 at start of first block', () => {
			expect(getCompletedCasesCount(mockExercise, 0, 0)).toBe(0)
		})

		it('should count completed cases in same block', () => {
			expect(getCompletedCasesCount(mockExercise, 0, 1)).toBe(1)
		})

		it('should count completed cases across blocks', () => {
			expect(getCompletedCasesCount(mockExercise, 1, 0)).toBe(2)
		})

		it('should handle final case', () => {
			expect(getCompletedCasesCount(mockExercise, 1, 1)).toBe(3)
		})
	})

	describe('extractExerciseMetadata', () => {
		it('should extract correct metadata', () => {
			const metadata = extractExerciseMetadata(mockExercise)
			expect(metadata).toEqual({
				id: 'test-exercise',
				type: 'word-form',
				title: 'Test Exercise',
				titleI18n: {el: 'Test', en: 'Test', ru: 'Test'},
				description: 'Test Description',
				descriptionI18n: {el: 'Test', en: 'Test', ru: 'Test'},
				tags: ['test', 'beginner'],
				difficulty: 'beginner',
				estimatedTimeMinutes: 5,
				totalBlocks: 2,
				totalCases: 3,
				enabled: true
			})
		})
	})
})

describe('Exercise shuffling and filtering', () => {
	const mockExercises = [
		{
			id: 'ex1',
			type: 'word-form' as const,
			title: 'Exercise 1',
			titleI18n: {el: 'Ex 1', en: 'Ex 1', ru: 'Ex 1'},
			description: 'Description 1',
			descriptionI18n: {el: 'Desc 1', en: 'Desc 1', ru: 'Desc 1'},
			tags: ['verbs', 'beginner'],
			difficulty: 'beginner' as const,
			estimatedTimeMinutes: 5,
			totalBlocks: 1,
			totalCases: 3,
			enabled: true
		},
		{
			id: 'ex2',
			type: 'word-form' as const,
			title: 'Exercise 2',
			titleI18n: {el: 'Ex 2', en: 'Ex 2', ru: 'Ex 2'},
			description: 'Description 2',
			descriptionI18n: {el: 'Desc 2', en: 'Desc 2', ru: 'Desc 2'},
			tags: ['nouns', 'intermediate'],
			difficulty: 'intermediate' as const,
			estimatedTimeMinutes: 10,
			totalBlocks: 2,
			totalCases: 6,
			enabled: true
		},
		{
			id: 'ex3',
			type: 'word-form' as const,
			title: 'Exercise 3',
			titleI18n: {el: 'Ex 3', en: 'Ex 3', ru: 'Ex 3'},
			description: 'Description 3',
			descriptionI18n: {el: 'Desc 3', en: 'Desc 3', ru: 'Desc 3'},
			tags: ['verbs', 'advanced'],
			difficulty: 'advanced' as const,
			estimatedTimeMinutes: 15,
			totalBlocks: 3,
			totalCases: 9,
			enabled: false
		}
	]

	describe('filterExercisesByTags', () => {
		it('should return all exercises when no tags selected', () => {
			const filtered = filterExercisesByTags(mockExercises, [])
			expect(filtered).toEqual(mockExercises)
		})

		it('should filter by single tag', () => {
			const filtered = filterExercisesByTags(mockExercises, ['verbs'])
			expect(filtered).toHaveLength(2)
			expect(filtered.map(ex => ex.id)).toEqual(['ex1', 'ex3'])
		})

		it('should filter by multiple tags (OR logic)', () => {
			const filtered = filterExercisesByTags(mockExercises, ['verbs', 'nouns'])
			expect(filtered).toHaveLength(3)
		})

		it('should return empty array when no matches', () => {
			const filtered = filterExercisesByTags(mockExercises, ['nonexistent'])
			expect(filtered).toHaveLength(0)
		})
	})

	describe('filterExercisesByDifficulty', () => {
		it('should return all exercises when no difficulty selected', () => {
			const filtered = filterExercisesByDifficulty(mockExercises, null)
			expect(filtered).toEqual(mockExercises)
		})

		it('should filter by difficulty level', () => {
			const filtered = filterExercisesByDifficulty(mockExercises, 'beginner')
			expect(filtered).toHaveLength(1)
			expect(filtered[0]?.id).toBe('ex1')
		})

		it('should return empty array when no matches', () => {
			const filtered = filterExercisesByDifficulty(mockExercises, 'expert')
			expect(filtered).toHaveLength(0)
		})
	})

	describe('getAllTags', () => {
		it('should extract unique tags from all exercises', () => {
			const tags = getAllTags(mockExercises)
			expect(tags.sort()).toEqual([
				'advanced',
				'beginner',
				'intermediate',
				'nouns',
				'verbs'
			])
		})

		it('should return empty array for empty exercise list', () => {
			const tags = getAllTags([])
			expect(tags).toEqual([])
		})
	})

	describe('shuffleExerciseCases', () => {
		const testExercise: WordFormExercise = {
			enabled: true,
			id: 'test-shuffle',
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
							id: 'case-1-1',
							prompt: 'εγώ ___',
							promptHintI18n: {el: 'I', en: 'I', ru: 'я'},
							correct: ['είμαι'],
							hint: null,
							hintI18n: null
						},
						{
							id: 'case-1-2',
							prompt: 'εσύ ___',
							promptHintI18n: {el: 'you', en: 'you', ru: 'ты'},
							correct: ['είσαι'],
							hint: null,
							hintI18n: null
						}
					]
				},
				{
					id: 'block-2',
					name: 'Block 2',
					nameHintI18n: {el: 'Block 2', en: 'Block 2', ru: 'Block 2'},
					cases: [
						{
							id: 'case-2-1',
							prompt: 'αυτός ___',
							promptHintI18n: {el: 'he', en: 'he', ru: 'он'},
							correct: ['είναι'],
							hint: null,
							hintI18n: null
						}
					]
				}
			]
		}

		const shuffleableExercise = {
			...testExercise,
			settings: {
				...testExercise.settings,
				shuffleCases: true
			}
		}

		it('should shuffle cases when shuffleCases is enabled', () => {
			// Since shuffling is random, we'll test that structure is preserved
			const shuffled = shuffleExerciseCases(shuffleableExercise)

			expect(shuffled.blocks).toHaveLength(2)
			expect(shuffled.blocks[0]?.cases).toHaveLength(2)
			expect(shuffled.blocks[1]?.cases).toHaveLength(1)

			// All case IDs should still be present
			const originalCaseIds = testExercise.blocks.flatMap(block =>
				block.cases.map(case_ => case_.id)
			)
			const shuffledCaseIds = shuffled.blocks.flatMap(block =>
				block.cases.map(case_ => case_.id)
			)
			expect(shuffledCaseIds.sort()).toEqual(originalCaseIds.sort())
		})

		it('should not shuffle when shuffleCases is disabled', () => {
			const notShuffled = shuffleExerciseCases(testExercise)
			expect(notShuffled).toEqual(testExercise)
		})
	})
})

describe('Utility functions', () => {
	describe('calculateAccuracy', () => {
		it('should calculate correct percentage', () => {
			expect(calculateAccuracy(8, 10)).toBe(80)
		})

		it('should round to nearest integer', () => {
			expect(calculateAccuracy(1, 3)).toBe(33)
			expect(calculateAccuracy(2, 3)).toBe(67)
		})

		it('should return 0 when no total answers', () => {
			expect(calculateAccuracy(5, 0)).toBe(0)
		})

		it('should handle perfect score', () => {
			expect(calculateAccuracy(10, 10)).toBe(100)
		})

		it('should handle zero correct answers', () => {
			expect(calculateAccuracy(0, 10)).toBe(0)
		})
	})

	describe('formatDuration', () => {
		it('should format seconds only for durations under 1 minute', () => {
			expect(formatDuration(30_000)).toBe('30s')
			expect(formatDuration(59_000)).toBe('59s')
		})

		it('should format minutes and seconds for longer durations', () => {
			expect(formatDuration(60_000)).toBe('1m 0s')
			expect(formatDuration(90_000)).toBe('1m 30s')
			expect(formatDuration(125_000)).toBe('2m 5s')
		})

		it('should handle zero duration', () => {
			expect(formatDuration(0)).toBe('0s')
		})

		it('should handle very long durations', () => {
			expect(formatDuration(3_660_000)).toBe('61m 0s')
		})
	})
})
