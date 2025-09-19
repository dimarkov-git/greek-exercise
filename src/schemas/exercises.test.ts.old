import * as v from 'valibot'
import {describe, expect, it} from 'vitest'
import {
	ExerciseMetadataSchema,
	ExerciseSettingsSchema,
	ExercisesListSchema,
	validateExercisesList,
	validateWordFormBlock,
	validateWordFormExercise,
	WordFormBlockSchema,
	WordFormCaseSchema,
	WordFormExerciseSchema
} from './exercises'

describe('Valibot Exercise Schemas', () => {
	describe('ExerciseSettingsSchema', () => {
		const validSettings = {
			autoAdvance: true,
			autoAdvanceDelayMs: 1500,
			allowSkip: false,
			shuffleCases: false
		}

		it('should validate correct settings', () => {
			expect(() => v.parse(ExerciseSettingsSchema, validSettings)).not.toThrow()
		})

		it('should reject missing required fields', () => {
			const {autoAdvance, ...incomplete} = validSettings
			expect(() => v.parse(ExerciseSettingsSchema, incomplete)).toThrow()
		})

		it('should reject invalid types', () => {
			const invalidSettings = {
				...validSettings,
				autoAdvance: 'true' // Should be boolean
			}
			expect(() => v.parse(ExerciseSettingsSchema, invalidSettings)).toThrow()
		})

		it('should reject non-numeric delay', () => {
			const invalidSettings = {
				...validSettings,
				autoAdvanceDelayMs: '1500' // Should be number
			}
			expect(() => v.parse(ExerciseSettingsSchema, invalidSettings)).toThrow()
		})
	})

	describe('WordFormCaseSchema', () => {
		const validCase = {
			id: 'case-1',
			prompt: 'εγώ ___',
			promptHintI18n: {
				el: 'εγώ',
				en: 'I',
				ru: 'я'
			},
			correct: ['είμαι'],
			hint: null,
			hintI18n: null
		}

		it('should validate correct case', () => {
			expect(() => v.parse(WordFormCaseSchema, validCase)).not.toThrow()
		})

		it('should validate case with additional hint', () => {
			const caseWithHint = {
				...validCase,
				hint: 'Additional Greek hint',
				hintI18n: {
					el: 'Πρόσθετη υπόδειξη',
					en: 'Additional hint',
					ru: 'Дополнительная подсказка'
				}
			}
			expect(() => v.parse(WordFormCaseSchema, caseWithHint)).not.toThrow()
		})

		it('should validate multiple correct answers', () => {
			const multipleAnswers = {
				...validCase,
				correct: ['είμαι', 'ειμαι']
			}
			expect(() => v.parse(WordFormCaseSchema, multipleAnswers)).not.toThrow()
		})

		it('should reject missing required fields', () => {
			const {id, ...incomplete} = validCase
			expect(() => v.parse(WordFormCaseSchema, incomplete)).toThrow()
		})

		it('should reject empty correct answers array', () => {
			const emptyCorrect = {
				...validCase,
				correct: []
			}
			expect(() => v.parse(WordFormCaseSchema, emptyCorrect)).toThrow()
		})

		it('should reject invalid language codes in promptHintI18n', () => {
			const invalidLang = {
				...validCase,
				promptHintI18n: {
					el: 'εγώ',
					en: 'I',
					fr: 'je' // Invalid language code
				}
			}
			expect(() => v.parse(WordFormCaseSchema, invalidLang)).toThrow()
		})

		it('should accept partial language translations in promptHintI18n', () => {
			const partialLang = {
				...validCase,
				promptHintI18n: {
					el: 'εγώ',
					en: 'I'
					// Missing 'ru' - this should be allowed
				}
			}
			expect(() => v.parse(WordFormCaseSchema, partialLang)).not.toThrow()
		})

		it('should reject non-string values in correct array', () => {
			const invalidCorrect = {
				...validCase,
				correct: ['είμαι', 123] // Mixed types
			}
			expect(() => v.parse(WordFormCaseSchema, invalidCorrect)).toThrow()
		})
	})

	describe('WordFormBlockSchema', () => {
		const validBlock = {
			id: 'block-1',
			name: 'είμαι (Ενεστώτας)',
			nameHintI18n: {
				el: 'είμαι (Ενεστώτας)',
				en: 'to be (present tense)',
				ru: 'быть (настоящее время)'
			},
			cases: [
				{
					id: 'case-1',
					prompt: 'εγώ ___',
					promptHintI18n: {
						el: 'εγώ',
						en: 'I',
						ru: 'я'
					},
					correct: ['είμαι'],
					hint: null,
					hintI18n: null
				}
			]
		}

		it('should validate correct block', () => {
			expect(() => v.parse(WordFormBlockSchema, validBlock)).not.toThrow()
		})

		it('should validate block with multiple cases', () => {
			const multiCaseBlock = {
				...validBlock,
				cases: [
					...validBlock.cases,
					{
						id: 'case-2',
						prompt: 'εσύ ___',
						promptHintI18n: {
							el: 'εσύ',
							en: 'you',
							ru: 'ты'
						},
						correct: ['είσαι'],
						hint: null,
						hintI18n: null
					}
				]
			}
			expect(() => v.parse(WordFormBlockSchema, multiCaseBlock)).not.toThrow()
		})

		it('should reject empty cases array', () => {
			const emptyCases = {
				...validBlock,
				cases: []
			}
			expect(() => v.parse(WordFormBlockSchema, emptyCases)).toThrow()
		})

		it('should reject invalid case in cases array', () => {
			const invalidCase = {
				...validBlock,
				cases: [
					{
						id: 'case-1',
						// Missing required fields
						correct: ['είμαι']
					}
				]
			}
			expect(() => v.parse(WordFormBlockSchema, invalidCase)).toThrow()
		})
	})

	describe('WordFormExerciseSchema', () => {
		const validExercise = {
			enabled: true,
			id: 'verbs-be',
			type: 'word-form' as const,
			title: 'Εξάσκηση ρήματος είμαι',
			titleI18n: {
				el: 'Εξάσκηση ρήματος είμαι',
				en: "Verb 'to be' practice",
				ru: "Практика глагола 'быть'"
			},
			description: 'Κατακτήστε την κλίση του ρήματος είμαι',
			descriptionI18n: {
				el: 'Κατακτήστε την κλίση του ρήματος είμαι',
				en: "Master conjugation of the verb 'to be'",
				ru: "Освойте спряжение глагола 'быть'"
			},
			buttonText: 'Ξεκινήστε την άσκηση',
			buttonTextI18n: {
				el: 'Ξεκινήστε την άσκηση',
				en: 'Start exercise',
				ru: 'Начать упражнение'
			},
			tags: ['verbs', 'irregular-verbs', 'basic'],
			difficulty: 'beginner' as const,
			estimatedTimeMinutes: 5,
			settings: {
				autoAdvance: true,
				autoAdvanceDelayMs: 1500,
				allowSkip: false,
				shuffleCases: false
			},
			blocks: [
				{
					id: 'be-present',
					name: 'είμαι (Ενεστώτας)',
					nameHintI18n: {
						el: 'είμαι (Ενεστώτας)',
						en: 'to be (present tense)',
						ru: 'быть (настоящее время)'
					},
					cases: [
						{
							id: 'be-present-1s',
							prompt: 'εγώ ___',
							promptHintI18n: {
								el: 'εγώ',
								en: 'I am',
								ru: 'я есть'
							},
							correct: ['είμαι'],
							hint: null,
							hintI18n: null
						}
					]
				}
			]
		}

		it('should validate complete exercise', () => {
			expect(() => v.parse(WordFormExerciseSchema, validExercise)).not.toThrow()
		})

		it('should reject invalid exercise type', () => {
			const invalidType = {
				...validExercise,
				type: 'invalid-type'
			}
			expect(() => v.parse(WordFormExerciseSchema, invalidType)).toThrow()
		})

		it('should reject invalid difficulty level', () => {
			const invalidDifficulty = {
				...validExercise,
				difficulty: 'expert'
			}
			expect(() => v.parse(WordFormExerciseSchema, invalidDifficulty)).toThrow()
		})

		it('should validate all valid difficulty levels', () => {
			const difficulties = ['beginner', 'intermediate', 'advanced'] as const
			for (const difficulty of difficulties) {
				const exerciseWithDifficulty = {
					...validExercise,
					difficulty
				}
				expect(() =>
					v.parse(WordFormExerciseSchema, exerciseWithDifficulty)
				).not.toThrow()
			}
		})

		it('should reject negative estimated time', () => {
			const negativeTime = {
				...validExercise,
				estimatedTimeMinutes: -5
			}
			expect(() => v.parse(WordFormExerciseSchema, negativeTime)).toThrow()
		})

		it('should reject empty blocks array', () => {
			const emptyBlocks = {
				...validExercise,
				blocks: []
			}
			expect(() => v.parse(WordFormExerciseSchema, emptyBlocks)).toThrow()
		})

		it('should validate disabled exercise', () => {
			const disabledExercise = {
				...validExercise,
				enabled: false
			}
			expect(() =>
				v.parse(WordFormExerciseSchema, disabledExercise)
			).not.toThrow()
		})
	})

	describe('ExerciseMetadataSchema', () => {
		const validMetadata = {
			id: 'verbs-be',
			type: 'word-form' as const,
			title: 'Εξάσκηση ρήματος είμαι',
			titleI18n: {
				el: 'Εξάσκηση ρήματος είμαι',
				en: "Verb 'to be' practice",
				ru: "Практика глагола 'быть'"
			},
			description: 'Κατακτήστε την κλίση του ρήματος είμαι',
			descriptionI18n: {
				el: 'Κατακτήστε την κλίση του ρήματος είμαι',
				en: "Master conjugation of the verb 'to be'",
				ru: "Освойте спряжение глагола 'быть'"
			},
			tags: ['verbs', 'irregular-verbs'],
			difficulty: 'beginner' as const,
			estimatedTimeMinutes: 5,
			totalBlocks: 2,
			totalCases: 6,
			enabled: true
		}

		it('should validate correct metadata', () => {
			expect(() => v.parse(ExerciseMetadataSchema, validMetadata)).not.toThrow()
		})

		it('should validate all exercise types', () => {
			const types = [
				'word-form',
				'translation',
				'flashcard',
				'multiple-choice'
			] as const
			for (const type of types) {
				const metadataWithType = {
					...validMetadata,
					type
				}
				expect(() =>
					v.parse(ExerciseMetadataSchema, metadataWithType)
				).not.toThrow()
			}
		})

		it('should reject negative totalBlocks', () => {
			const negativeBlocks = {
				...validMetadata,
				totalBlocks: -1
			}
			expect(() => v.parse(ExerciseMetadataSchema, negativeBlocks)).toThrow()
		})

		it('should reject negative totalCases', () => {
			const negativeCases = {
				...validMetadata,
				totalCases: -1
			}
			expect(() => v.parse(ExerciseMetadataSchema, negativeCases)).toThrow()
		})
	})

	describe('ExercisesListSchema', () => {
		const validList = [
			{
				id: 'verbs-be',
				type: 'word-form' as const,
				title: 'Verb Exercise',
				titleI18n: {
					el: 'Ρήμα',
					en: 'Verb',
					ru: 'Глагол'
				},
				description: 'Description',
				descriptionI18n: {
					el: 'Περιγραφή',
					en: 'Description',
					ru: 'Описание'
				},
				tags: ['verbs'],
				difficulty: 'beginner' as const,
				estimatedTimeMinutes: 5,
				totalBlocks: 1,
				totalCases: 3,
				enabled: true
			}
		]

		it('should validate list of exercises', () => {
			expect(() => v.parse(ExercisesListSchema, validList)).not.toThrow()
		})

		it('should validate empty array', () => {
			expect(() => v.parse(ExercisesListSchema, [])).not.toThrow()
		})

		it('should reject array with invalid exercise', () => {
			const invalidList = [
				{
					id: 'invalid-exercise'
					// Missing required fields
				}
			]
			expect(() => v.parse(ExercisesListSchema, invalidList)).toThrow()
		})

		it('should reject non-array input', () => {
			expect(() => v.parse(ExercisesListSchema, 'not an array')).toThrow()
		})
	})

	describe('Validation utility functions', () => {
		const validExercise = {
			enabled: true,
			id: 'test-exercise',
			type: 'word-form' as const,
			title: 'Test Exercise',
			titleI18n: {el: 'Test', en: 'Test', ru: 'Test'},
			description: 'Description',
			descriptionI18n: {el: 'Desc', en: 'Desc', ru: 'Desc'},
			buttonText: 'Start',
			buttonTextI18n: {el: 'Start', en: 'Start', ru: 'Start'},
			tags: ['test'],
			difficulty: 'beginner' as const,
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
					name: 'Block',
					nameHintI18n: {el: 'Block', en: 'Block', ru: 'Block'},
					cases: [
						{
							id: 'case-1',
							prompt: 'prompt',
							promptHintI18n: {el: 'hint', en: 'hint', ru: 'hint'},
							correct: ['answer'],
							hint: null,
							hintI18n: null
						}
					]
				}
			]
		}

		const validBlock = {
			id: 'block-1',
			name: 'Block',
			nameHintI18n: {el: 'Block', en: 'Block', ru: 'Block'},
			cases: [
				{
					id: 'case-1',
					prompt: 'prompt',
					promptHintI18n: {el: 'hint', en: 'hint', ru: 'hint'},
					correct: ['answer'],
					hint: null,
					hintI18n: null
				}
			]
		}

		const validExercisesList = [
			{
				id: 'ex1',
				type: 'word-form' as const,
				title: 'Exercise 1',
				titleI18n: {el: 'Ex 1', en: 'Ex 1', ru: 'Ex 1'},
				description: 'Description 1',
				descriptionI18n: {el: 'Desc 1', en: 'Desc 1', ru: 'Desc 1'},
				tags: ['test'],
				difficulty: 'beginner' as const,
				estimatedTimeMinutes: 5,
				totalBlocks: 1,
				totalCases: 1,
				enabled: true
			}
		]

		describe('validateWordFormExercise', () => {
			it('should validate correct exercise', () => {
				expect(() => validateWordFormExercise(validExercise)).not.toThrow()
			})

			it('should throw for invalid exercise', () => {
				expect(() => validateWordFormExercise({invalid: true})).toThrow()
			})
		})

		describe('validateWordFormBlock', () => {
			it('should validate correct block', () => {
				expect(() => validateWordFormBlock(validBlock)).not.toThrow()
			})

			it('should throw for invalid block', () => {
				expect(() => validateWordFormBlock({invalid: true})).toThrow()
			})
		})

		describe('validateExercisesList', () => {
			it('should validate correct exercises list', () => {
				expect(() => validateExercisesList(validExercisesList)).not.toThrow()
			})

			it('should throw for invalid exercises list', () => {
				expect(() => validateExercisesList('not an array')).toThrow()
			})
		})
	})

	describe('Edge cases and error handling', () => {
		it('should handle null input gracefully', () => {
			expect(() => v.parse(WordFormExerciseSchema, null)).toThrow()
		})

		it('should handle undefined input gracefully', () => {
			expect(() => v.parse(WordFormExerciseSchema, undefined)).toThrow()
		})

		it('should handle empty object', () => {
			expect(() => v.parse(WordFormExerciseSchema, {})).toThrow()
		})

		it('should handle deeply nested invalid data', () => {
			const invalidExercise = {
				enabled: true,
				id: 'test',
				type: 'word-form',
				title: 'Test',
				titleI18n: {el: 'Test', en: 'Test', ru: 'Test'},
				description: 'Test',
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
						name: 'Block',
						nameHintI18n: {el: 'Block', en: 'Block', ru: 'Block'},
						cases: [
							{
								id: 'case-1',
								prompt: 'prompt',
								promptHintI18n: {
									el: 'hint',
									en: 'hint'
									// Missing 'ru' - should fail validation
								},
								correct: [], // Empty array should fail validation
								hint: null,
								hintI18n: null
							}
						]
					}
				]
			}
			expect(() => v.parse(WordFormExerciseSchema, invalidExercise)).toThrow()
		})

		it('should provide meaningful error messages', () => {
			try {
				v.parse(WordFormExerciseSchema, {})
			} catch (error) {
				expect(error).toBeInstanceOf(v.ValiError)
			}
		})
	})
})
