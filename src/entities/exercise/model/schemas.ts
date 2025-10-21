import * as v from 'valibot'

// Base schemas
const LanguageSchema = v.picklist(['el', 'ru', 'en'] as const)
const DifficultySchema = v.picklist([
	'a0',
	'a1',
	'a2',
	'b1',
	'b2',
	'c1',
	'c2'
] as const)

// Schema for multilingual strings (Record<Language, string>)
const I18nStringSchema = v.record(LanguageSchema, v.string())

// Base exercise settings schema (all fields optional for partial overrides)
export const ExerciseSettingsSchema = v.object({
	autoAdvance: v.optional(v.boolean()),
	autoAdvanceDelayMs: v.optional(v.pipe(v.number(), v.minValue(0))),
	allowSkip: v.optional(v.boolean()),
	shuffleCases: v.optional(v.boolean())
})

// Word-form settings schema
export const WordFormSettingsSchema = v.object({
	autoAdvance: v.optional(v.boolean()),
	autoAdvanceDelayMs: v.optional(v.pipe(v.number(), v.minValue(0))),
	allowSkip: v.optional(v.boolean()),
	shuffleCases: v.optional(v.boolean()),
	shuffleBlocks: v.optional(v.boolean()),
	allowSkipTone: v.optional(v.boolean())
})

// Flashcard settings schema
export const FlashcardSettingsSchema = v.object({
	autoAdvance: v.optional(v.boolean()),
	autoAdvanceDelayMs: v.optional(v.pipe(v.number(), v.minValue(0))),
	allowSkip: v.optional(v.boolean()),
	shuffleCases: v.optional(v.boolean()),
	shuffleCards: v.optional(v.boolean())
})

// Multiple-choice settings schema
export const MultipleChoiceSettingsSchema = v.object({
	autoAdvance: v.optional(v.boolean()),
	autoAdvanceDelayMs: v.optional(v.pipe(v.number(), v.minValue(0))),
	allowSkip: v.optional(v.boolean()),
	shuffleCases: v.optional(v.boolean()),
	shuffleQuestions: v.optional(v.boolean()),
	shuffleAnswers: v.optional(v.boolean())
})

// Individual case schema
export const WordFormCaseSchema = v.object({
	id: v.string(),
	prompt: v.string(),
	promptHintI18n: v.optional(I18nStringSchema),
	correct: v.pipe(v.array(v.string()), v.minLength(1))
})

// Exercise block schema
export const WordFormBlockSchema = v.object({
	id: v.string(),
	name: v.string(),
	nameHintI18n: v.optional(I18nStringSchema),
	cases: v.pipe(v.array(WordFormCaseSchema), v.minLength(1))
})

// Complete word-form exercise schema
export const WordFormExerciseSchema = v.object({
	enabled: v.boolean(),
	id: v.string(),
	type: v.literal('word-form'),
	language: LanguageSchema,
	title: v.string(),
	titleI18n: v.optional(I18nStringSchema),
	description: v.string(),
	descriptionI18n: v.optional(I18nStringSchema),
	tags: v.optional(v.array(v.string()), []),
	difficulty: DifficultySchema,
	settings: v.optional(WordFormSettingsSchema),
	blocks: v.pipe(v.array(WordFormBlockSchema), v.minLength(1))
})

// Flashcard schema
export const FlashCardSchema = v.object({
	id: v.string(),
	front: v.string(),
	backHintI18n: I18nStringSchema
})

// SRS settings schema
export const SRSSettingsSchema = v.object({
	newCardsPerDay: v.optional(v.pipe(v.number(), v.minValue(1))),
	reviewsPerDay: v.optional(v.pipe(v.number(), v.minValue(1))),
	graduatingInterval: v.optional(v.pipe(v.number(), v.minValue(1))),
	easyInterval: v.optional(v.pipe(v.number(), v.minValue(1)))
})

// Complete flashcard exercise schema
export const FlashcardExerciseSchema = v.object({
	enabled: v.boolean(),
	id: v.string(),
	type: v.literal('flashcard'),
	language: LanguageSchema,
	title: v.string(),
	titleI18n: v.optional(I18nStringSchema),
	description: v.string(),
	descriptionI18n: v.optional(I18nStringSchema),
	tags: v.optional(v.array(v.string()), []),
	difficulty: DifficultySchema,
	settings: v.optional(FlashcardSettingsSchema),
	cards: v.pipe(v.array(FlashCardSchema), v.minLength(1)),
	srsSettings: v.optional(SRSSettingsSchema)
})

// Exercise metadata schema (for list display)
export const ExerciseMetadataSchema = v.object({
	id: v.string(),
	type: v.picklist(['word-form', 'flashcard', 'multiple-choice']),
	language: LanguageSchema,
	title: v.string(),
	titleI18n: v.optional(I18nStringSchema),
	description: v.string(),
	descriptionI18n: v.optional(I18nStringSchema),
	tags: v.array(v.string()),
	difficulty: DifficultySchema,
	totalBlocks: v.pipe(v.number(), v.minValue(0)),
	totalCases: v.pipe(v.number(), v.minValue(0)),
	enabled: v.boolean()
})

// Exercise list schema
export const ExercisesListSchema = v.array(ExerciseMetadataSchema)

export type ExerciseSettingsDto = v.InferOutput<typeof ExerciseSettingsSchema>
export type WordFormCaseDto = v.InferOutput<typeof WordFormCaseSchema>
export type WordFormBlockDto = v.InferOutput<typeof WordFormBlockSchema>
export type WordFormExerciseDto = v.InferOutput<typeof WordFormExerciseSchema>
export type FlashCardDto = v.InferOutput<typeof FlashCardSchema>
export type SRSSettingsDto = v.InferOutput<typeof SRSSettingsSchema>
export type FlashcardExerciseDto = v.InferOutput<typeof FlashcardExerciseSchema>
export type ExerciseMetadataDto = v.InferOutput<typeof ExerciseMetadataSchema>
export type ExercisesListDto = v.InferOutput<typeof ExercisesListSchema>

// Validation utility functions
export function validateWordFormExercise(data: unknown): WordFormExerciseDto {
	return v.parse(WordFormExerciseSchema, data)
}

export function validateFlashcardExercise(data: unknown): FlashcardExerciseDto {
	return v.parse(FlashcardExerciseSchema, data)
}

export function validateExercisesList(data: unknown): ExercisesListDto {
	return v.parse(ExercisesListSchema, data)
}

export function validateWordFormBlock(data: unknown): WordFormBlockDto {
	return v.parse(WordFormBlockSchema, data)
}

export function validateExerciseMetadata(data: unknown): ExerciseMetadataDto {
	return v.parse(ExerciseMetadataSchema, data)
}

// Multiple-choice schemas
export const MultipleChoiceOptionSchema = v.object({
	id: v.string(),
	text: v.string(),
	textI18n: v.optional(I18nStringSchema)
})

export const MultipleChoiceQuestionSchema = v.object({
	id: v.string(),
	text: v.string(),
	textI18n: v.optional(I18nStringSchema),
	options: v.pipe(
		v.array(MultipleChoiceOptionSchema),
		v.minLength(2),
		v.maxLength(6)
	),
	correctOptionId: v.string(),
	hint: v.optional(v.string()),
	hintI18n: v.optional(I18nStringSchema)
})

export const MultipleChoiceExerciseSchema = v.object({
	enabled: v.boolean(),
	id: v.string(),
	type: v.literal('multiple-choice'),
	language: LanguageSchema,
	title: v.string(),
	titleI18n: v.optional(I18nStringSchema),
	description: v.string(),
	descriptionI18n: v.optional(I18nStringSchema),
	tags: v.optional(v.array(v.string()), []),
	difficulty: DifficultySchema,
	settings: v.optional(MultipleChoiceSettingsSchema),
	questions: v.pipe(v.array(MultipleChoiceQuestionSchema), v.minLength(1))
})

export type MultipleChoiceOptionDto = v.InferOutput<
	typeof MultipleChoiceOptionSchema
>
export type MultipleChoiceQuestionDto = v.InferOutput<
	typeof MultipleChoiceQuestionSchema
>
export type MultipleChoiceExerciseDto = v.InferOutput<
	typeof MultipleChoiceExerciseSchema
>

export function validateMultipleChoiceExercise(
	data: unknown
): MultipleChoiceExerciseDto {
	return v.parse(MultipleChoiceExerciseSchema, data)
}
