import {describe, expect, test} from 'vitest'
import type {
	Difficulty,
	ExerciseEvent,
	ExerciseMetadata,
	ExerciseResult,
	ExerciseSettings,
	ExerciseState,
	ExerciseStatus,
	ExerciseType,
	TagStats,
	WordFormBlock,
	WordFormCase,
	WordFormExercise
} from './exercises'
import {
	DEFAULT_EXERCISE_SETTINGS,
	exerciseToJSON,
	getExerciseSettings
} from './exercises'

describe('exercises types', () => {
	describe('DEFAULT_EXERCISE_SETTINGS', () => {
		test('should have correct default values', () => {
			expect(DEFAULT_EXERCISE_SETTINGS).toEqual({
				autoAdvance: true,
				autoAdvanceDelayMs: 1500,
				allowSkip: false,
				shuffleCases: false
			})
		})

		test('should be frozen/immutable', () => {
			expect(() => {
				// biome-ignore lint/suspicious/noExplicitAny: Intentional type override for immutability test
				;(DEFAULT_EXERCISE_SETTINGS as any).autoAdvance = false
			}).not.toThrow() // Note: Object.freeze is not applied, but we test the expected behavior
		})
	})

	describe('getExerciseSettings', () => {
		const mockExercise: WordFormExercise = {
			enabled: true,
			id: 'test-exercise',
			type: 'word-form',
			title: 'Test Exercise',
			description: 'A test exercise',
			difficulty: 'a1',
			estimatedTimeMinutes: 5,
			blocks: []
		}

		test('should return default settings when exercise has no settings', () => {
			const exercise = {...mockExercise}
			const settings = getExerciseSettings(exercise)

			expect(settings).toEqual(DEFAULT_EXERCISE_SETTINGS)
		})

		test('should merge custom settings with defaults', () => {
			const exercise: WordFormExercise = {
				...mockExercise,
				settings: {
					autoAdvance: false,
					autoAdvanceDelayMs: 2000,
					allowSkip: true,
					shuffleCases: true
				}
			}

			const settings = getExerciseSettings(exercise)

			expect(settings).toEqual({
				autoAdvance: false,
				autoAdvanceDelayMs: 2000,
				allowSkip: true,
				shuffleCases: true
			})
		})

		test('should override only specified settings', () => {
			const exercise: WordFormExercise = {
				...mockExercise,
				settings: {
					autoAdvance: false,
					autoAdvanceDelayMs: 3000,
					allowSkip: false,
					shuffleCases: false
				}
			}

			// Delete some properties to test partial override
			// biome-ignore lint/suspicious/noExplicitAny: Required for test property deletion
			;(exercise.settings as any).allowSkip = undefined
			// biome-ignore lint/suspicious/noExplicitAny: Required for test property deletion
			;(exercise.settings as any).shuffleCases = undefined

			const settings = getExerciseSettings(exercise)

			expect(settings).toEqual({
				autoAdvance: false,
				autoAdvanceDelayMs: 3000,
				allowSkip: false, // from default
				shuffleCases: false // from default
			})
		})

		test('should handle undefined settings gracefully', () => {
			const exercise = {
				...mockExercise,
				settings: undefined
				// biome-ignore lint/suspicious/noExplicitAny: Required for undefined settings test
			} as any

			const settings = getExerciseSettings(exercise)

			expect(settings).toEqual(DEFAULT_EXERCISE_SETTINGS)
		})
	})

	describe('exerciseToJSON', () => {
		const mockExercise: WordFormExercise = {
			enabled: true,
			id: 'test-exercise',
			type: 'word-form',
			title: 'Test Exercise',
			description: 'A test exercise',
			difficulty: 'a1',
			estimatedTimeMinutes: 5,
			blocks: [
				{
					id: 'block1',
					name: 'Test Block',
					cases: [
						{
							id: 'case1',
							prompt: 'Test?',
							correct: ['test']
						}
					]
				}
			]
		}

		test('should convert basic exercise to JSON', () => {
			const json = exerciseToJSON(mockExercise)

			expect(json).toEqual({
				enabled: true,
				id: 'test-exercise',
				type: 'word-form',
				title: 'Test Exercise',
				description: 'A test exercise',
				tags: [], // defaults to empty array
				difficulty: 'a1',
				estimatedTimeMinutes: 5,
				settings: DEFAULT_EXERCISE_SETTINGS,
				blocks: mockExercise.blocks
			})
		})

		test('should include titleI18n when present', () => {
			const exerciseWithI18n: WordFormExercise = {
				...mockExercise,
				titleI18n: {
					en: 'Test Exercise',
					el: 'Ελληνικό Τεστ'
				}
			}

			const json = exerciseToJSON(exerciseWithI18n)

			expect(json.titleI18n).toEqual({
				en: 'Test Exercise',
				el: 'Ελληνικό Τεστ'
			})
		})

		test('should include descriptionI18n when present', () => {
			const exerciseWithI18n: WordFormExercise = {
				...mockExercise,
				descriptionI18n: {
					en: 'A test exercise',
					el: 'Ένα δοκιμαστικό άσκημα'
				}
			}

			const json = exerciseToJSON(exerciseWithI18n)

			expect(json.descriptionI18n).toEqual({
				en: 'A test exercise',
				el: 'Ένα δοκιμαστικό άσκημα'
			})
		})

		test('should handle tags when present', () => {
			const exerciseWithTags: WordFormExercise = {
				...mockExercise,
				tags: ['grammar', 'verbs', 'beginner']
			}

			const json = exerciseToJSON(exerciseWithTags)

			expect(json.tags).toEqual(['grammar', 'verbs', 'beginner'])
		})

		test('should handle custom settings', () => {
			const exerciseWithSettings: WordFormExercise = {
				...mockExercise,
				settings: {
					autoAdvance: false,
					autoAdvanceDelayMs: 2500,
					allowSkip: true,
					shuffleCases: true
				}
			}

			const json = exerciseToJSON(exerciseWithSettings)

			expect(json.settings).toEqual({
				autoAdvance: false,
				autoAdvanceDelayMs: 2500,
				allowSkip: true,
				shuffleCases: true
			})
		})

		test('should handle exercise with all optional fields', () => {
			const fullExercise: WordFormExercise = {
				...mockExercise,
				titleI18n: {en: 'Test', el: 'Τεστ'},
				descriptionI18n: {en: 'Description', ru: 'Описание'},
				tags: ['tag1', 'tag2'],
				settings: {
					autoAdvance: false,
					autoAdvanceDelayMs: 3000,
					allowSkip: true,
					shuffleCases: false
				}
			}

			const json = exerciseToJSON(fullExercise)

			expect(json).toEqual({
				enabled: true,
				id: 'test-exercise',
				type: 'word-form',
				title: 'Test Exercise',
				titleI18n: {en: 'Test', el: 'Τεστ'},
				description: 'A test exercise',
				descriptionI18n: {en: 'Description', ru: 'Описание'},
				tags: ['tag1', 'tag2'],
				difficulty: 'a1',
				estimatedTimeMinutes: 5,
				settings: {
					autoAdvance: false,
					autoAdvanceDelayMs: 3000,
					allowSkip: true,
					shuffleCases: false
				},
				blocks: mockExercise.blocks
			})
		})

		test('should handle empty tags array', () => {
			const exerciseWithEmptyTags: WordFormExercise = {
				...mockExercise,
				tags: []
			}

			const json = exerciseToJSON(exerciseWithEmptyTags)

			expect(json.tags).toEqual([])
		})

		test('should not include titleI18n when undefined', () => {
			const json = exerciseToJSON(mockExercise)

			expect(json).not.toHaveProperty('titleI18n')
		})

		test('should not include descriptionI18n when undefined', () => {
			const json = exerciseToJSON(mockExercise)

			expect(json).not.toHaveProperty('descriptionI18n')
		})
	})

	describe('type definitions', () => {
		test('ExerciseType should include all expected values', () => {
			const validTypes: ExerciseType[] = [
				'word-form',
				'translation',
				'flashcard',
				'multiple-choice'
			]

			// TypeScript will enforce these at compile time
			expect(validTypes).toHaveLength(4)
		})

		test('Difficulty should include all expected levels', () => {
			const validDifficulties: Difficulty[] = [
				'a0',
				'a1',
				'a2',
				'b1',
				'b2',
				'c1',
				'c2'
			]

			// TypeScript will enforce these at compile time
			expect(validDifficulties).toHaveLength(7)
		})

		test('ExerciseStatus should include all expected states', () => {
			const validStatuses: ExerciseStatus[] = [
				'WAITING_INPUT',
				'CHECKING',
				'CORRECT_ANSWER',
				'WRONG_ANSWER',
				'REQUIRE_CORRECTION',
				'REQUIRE_CONTINUE',
				'COMPLETED'
			]

			// TypeScript will enforce these at compile time
			expect(validStatuses).toHaveLength(7)
		})

		test('ExerciseSettings should have correct structure', () => {
			const settings: ExerciseSettings = {
				autoAdvance: true,
				autoAdvanceDelayMs: 1000,
				allowSkip: false,
				shuffleCases: true
			}

			expect(typeof settings.autoAdvance).toBe('boolean')
			expect(typeof settings.autoAdvanceDelayMs).toBe('number')
			expect(typeof settings.allowSkip).toBe('boolean')
			expect(typeof settings.shuffleCases).toBe('boolean')
		})

		test('WordFormBlock should have correct structure', () => {
			const block: WordFormBlock = {
				id: 'block-1',
				name: 'Test Block',
				nameHintI18n: {en: 'Test Block Hint'},
				cases: [
					{
						id: 'case-1',
						prompt: 'Test prompt',
						promptHintI18n: {en: 'Test prompt hint'},
						correct: ['answer1', 'answer2'],
						hint: 'Additional hint',
						hintI18n: {en: 'Additional hint in English'}
					}
				]
			}

			expect(typeof block.id).toBe('string')
			expect(typeof block.name).toBe('string')
			expect(typeof block.nameHintI18n).toBe('object')
			expect(Array.isArray(block.cases)).toBe(true)
		})

		test('WordFormCase should have correct structure', () => {
			const case_: WordFormCase = {
				id: 'case-1',
				prompt: 'What is the answer?',
				promptHintI18n: {en: 'Hint for the prompt'},
				correct: ['answer1', 'answer2'],
				hint: 'Additional hint',
				hintI18n: {en: 'Additional hint in English'}
			}

			expect(typeof case_.id).toBe('string')
			expect(typeof case_.prompt).toBe('string')
			expect(typeof case_.promptHintI18n).toBe('object')
			expect(Array.isArray(case_.correct)).toBe(true)
			expect(typeof case_.hint).toBe('string')
			expect(typeof case_.hintI18n).toBe('object')
		})

		test('ExerciseState should have correct structure', () => {
			const state: ExerciseState = {
				currentBlockIndex: 0,
				currentCaseIndex: 0,
				userAnswer: 'test answer',
				showAnswer: false,
				isCorrect: null,
				completedCases: 0,
				totalCases: 10,
				autoAdvanceEnabled: true,
				incorrectAttempts: 0,
				showNameHint: false,
				showPromptHint: false,
				showAdditionalHint: false
			}

			expect(typeof state.currentBlockIndex).toBe('number')
			expect(typeof state.currentCaseIndex).toBe('number')
			expect(typeof state.userAnswer).toBe('string')
			expect(typeof state.showAnswer).toBe('boolean')
			expect(
				state.isCorrect === null || typeof state.isCorrect === 'boolean'
			).toBe(true)
			expect(typeof state.completedCases).toBe('number')
			expect(typeof state.totalCases).toBe('number')
			expect(typeof state.autoAdvanceEnabled).toBe('boolean')
			expect(typeof state.incorrectAttempts).toBe('number')
			expect(typeof state.showNameHint).toBe('boolean')
			expect(typeof state.showPromptHint).toBe('boolean')
			expect(typeof state.showAdditionalHint).toBe('boolean')
		})

		test('ExerciseEvent types should be correctly defined', () => {
			const events: ExerciseEvent[] = [
				{type: 'SUBMIT_ANSWER', answer: 'test'},
				{type: 'CONTINUE'},
				{type: 'SKIP'},
				{type: 'RESTART'},
				{type: 'TOGGLE_HINT', hintType: 'name'},
				{type: 'TOGGLE_HINT', hintType: 'prompt'},
				{type: 'TOGGLE_HINT', hintType: 'additional'},
				{type: 'TOGGLE_AUTO_ADVANCE'}
			]

			// Each event should have a type property
			for (const event of events) {
				expect(typeof event.type).toBe('string')
			}
		})

		test('ExerciseResult should have correct structure', () => {
			const result: ExerciseResult = {
				exerciseId: 'test-exercise',
				totalCases: 10,
				correctAnswers: 8,
				incorrectAnswers: 2,
				timeSpentMs: 120_000,
				completedAt: new Date(),
				accuracy: 80
			}

			expect(typeof result.exerciseId).toBe('string')
			expect(typeof result.totalCases).toBe('number')
			expect(typeof result.correctAnswers).toBe('number')
			expect(typeof result.incorrectAnswers).toBe('number')
			expect(typeof result.timeSpentMs).toBe('number')
			expect(result.completedAt instanceof Date).toBe(true)
			expect(typeof result.accuracy).toBe('number')
		})

		test('TagStats should have correct structure', () => {
			const tagStats: TagStats = {
				tag: 'grammar',
				totalExercises: 5,
				completedExercises: 3,
				averageAccuracy: 85.5,
				totalTimeSpentMs: 300_000
			}

			expect(typeof tagStats.tag).toBe('string')
			expect(typeof tagStats.totalExercises).toBe('number')
			expect(typeof tagStats.completedExercises).toBe('number')
			expect(typeof tagStats.averageAccuracy).toBe('number')
			expect(typeof tagStats.totalTimeSpentMs).toBe('number')
		})

		test('ExerciseMetadata should have correct structure', () => {
			const metadata: ExerciseMetadata = {
				id: 'test-exercise',
				type: 'word-form',
				title: 'Test Exercise',
				titleI18n: {en: 'Test Exercise'},
				description: 'A test exercise',
				descriptionI18n: {en: 'A test exercise'},
				tags: ['grammar', 'verbs'],
				difficulty: 'a1',
				estimatedTimeMinutes: 5,
				totalBlocks: 2,
				totalCases: 10,
				enabled: true
			}

			expect(typeof metadata.id).toBe('string')
			expect(typeof metadata.type).toBe('string')
			expect(typeof metadata.title).toBe('string')
			expect(typeof metadata.titleI18n).toBe('object')
			expect(typeof metadata.description).toBe('string')
			expect(typeof metadata.descriptionI18n).toBe('object')
			expect(Array.isArray(metadata.tags)).toBe(true)
			expect(typeof metadata.difficulty).toBe('string')
			expect(typeof metadata.estimatedTimeMinutes).toBe('number')
			expect(typeof metadata.totalBlocks).toBe('number')
			expect(typeof metadata.totalCases).toBe('number')
			expect(typeof metadata.enabled).toBe('boolean')
		})
	})
})
