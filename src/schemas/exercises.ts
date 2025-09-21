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

// Exercise settings schema
export const ExerciseSettingsSchema = v.object({
	autoAdvance: v.boolean(),
	autoAdvanceDelayMs: v.pipe(v.number(), v.minValue(0)),
	allowSkip: v.boolean(),
	shuffleCases: v.boolean()
})

// Individual case schema
export const WordFormCaseSchema = v.object({
	id: v.string(),
	prompt: v.string(),
	promptHintI18n: v.optional(I18nStringSchema),
	correct: v.pipe(v.array(v.string()), v.minLength(1)),
	hint: v.optional(v.string()),
	hintI18n: v.optional(I18nStringSchema)
})

// Exercise block schema
export const WordFormBlockSchema = v.object({
	id: v.string(),
	name: v.string(),
	nameHintI18n: v.optional(I18nStringSchema),
	cases: v.pipe(v.array(WordFormCaseSchema), v.minLength(1))
})

// Complete exercise schema
export const WordFormExerciseSchema = v.object({
	enabled: v.boolean(),
	id: v.string(),
	type: v.literal('word-form'),
	title: v.string(),
	titleI18n: v.optional(I18nStringSchema),
	description: v.string(),
	descriptionI18n: v.optional(I18nStringSchema),
	tags: v.optional(v.array(v.string()), []),
	difficulty: DifficultySchema,
	estimatedTimeMinutes: v.pipe(v.number(), v.minValue(0)),
	settings: v.optional(ExerciseSettingsSchema),
	blocks: v.pipe(v.array(WordFormBlockSchema), v.minLength(1))
})

// Exercise metadata schema (for list display)
export const ExerciseMetadataSchema = v.object({
	id: v.string(),
	type: v.picklist([
		'word-form',
		'translation',
		'flashcard',
		'multiple-choice'
	]),
	title: v.string(),
	titleI18n: v.optional(I18nStringSchema),
	description: v.string(),
	descriptionI18n: v.optional(I18nStringSchema),
	tags: v.array(v.string()),
	difficulty: DifficultySchema,
	estimatedTimeMinutes: v.pipe(v.number(), v.minValue(0)),
	totalBlocks: v.pipe(v.number(), v.minValue(0)),
	totalCases: v.pipe(v.number(), v.minValue(0)),
	enabled: v.boolean()
})

// Exercise list schema
export const ExercisesListSchema = v.array(ExerciseMetadataSchema)

// Validation utility functions
export function validateWordFormExercise(data: unknown) {
	return v.parse(WordFormExerciseSchema, data)
}

export function validateExercisesList(data: unknown) {
	return v.parse(ExercisesListSchema, data)
}

export function validateWordFormBlock(data: unknown) {
	return v.parse(WordFormBlockSchema, data)
}
