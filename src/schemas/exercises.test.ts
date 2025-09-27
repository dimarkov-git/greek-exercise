import * as v from 'valibot'
import {expect, it} from 'vitest'
import {
	ExerciseMetadataSchema,
	ExercisesListSchema,
	WordFormBlockSchema,
	WordFormCaseSchema,
	WordFormExerciseSchema
} from './exercises'

const baseCase = {
	id: 'case-1',
	prompt: 'εγώ ___',
	correct: ['είμαι']
}

const baseBlock = {
	id: 'block-1',
	name: 'Ενεστώτας',
	cases: [baseCase]
}

const baseExercise = {
	enabled: true,
	id: 'verbs-be',
	type: 'word-form' as const,
	language: 'el' as const,
	title: 'Είμαι',
	description: 'Κλίση του ρήματος',
	tags: ['verbs'],
	difficulty: 'a1' as const,
	estimatedTimeMinutes: 5,
	blocks: [baseBlock]
}

it('accepts well-formed case, block, and exercise payloads', () => {
	expect(v.parse(WordFormCaseSchema, baseCase).id).toBe('case-1')
	expect(v.parse(WordFormBlockSchema, baseBlock).cases).toHaveLength(1)
	expect(
		v.parse(WordFormExerciseSchema, baseExercise).blocks[0]?.cases[0]?.id
	).toBe('case-1')
})

it('rejects exercises missing required fields', () => {
	expect(() =>
		v.parse(WordFormExerciseSchema, {...baseExercise, blocks: []})
	).toThrow()
	expect(() =>
		v.parse(WordFormCaseSchema, {...baseCase, correct: []})
	).toThrow()
})

it('validates metadata lists for the exercise library', () => {
	const metadata = {
		id: 'verbs-be',
		type: 'word-form',
		language: 'el',
		title: 'Είμαι',
		description: 'Κλίση του ρήματος',
		tags: ['verbs'],
		difficulty: 'a1',
		estimatedTimeMinutes: 5,
		totalBlocks: 1,
		totalCases: 1,
		enabled: true
	}

	expect(v.parse(ExerciseMetadataSchema, metadata).id).toBe('verbs-be')
	expect(v.parse(ExercisesListSchema, [metadata])).toHaveLength(1)
	expect(() =>
		v.parse(ExercisesListSchema, [{...metadata, totalCases: -1}])
	).toThrow()
})
