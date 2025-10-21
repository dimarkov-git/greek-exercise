import type {CustomExerciseJSON} from './custom-exercises-store'
import type {WordFormExerciseWithDefaults} from './domain-types'
import type {FlashcardExerciseJSON} from './flashcard-types'
import type {ExerciseMetadataDto} from './schemas'
import type {WordFormExerciseJSON} from './types'

function normalizeTags(tags: readonly string[] | undefined): string[] {
	if (!tags) {
		return []
	}

	return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b))
}

export function wordFormExerciseJsonToMetadata(
	exercise: WordFormExerciseJSON
): ExerciseMetadataDto {
	const totalBlocks = exercise.blocks.length
	const totalCases = exercise.blocks.reduce(
		(count, block) => count + block.cases.length,
		0
	)

	return {
		id: exercise.id,
		type: 'word-form',
		language: exercise.language,
		title: exercise.title,
		titleI18n: exercise.titleI18n,
		description: exercise.description,
		descriptionI18n: exercise.descriptionI18n,
		tags: normalizeTags(exercise.tags),
		difficulty: exercise.difficulty,
		totalBlocks,
		totalCases,
		enabled: exercise.enabled
	}
}

export function wordFormExerciseJsonToExercise(
	exercise: WordFormExerciseJSON
): WordFormExerciseWithDefaults {
	return {
		...exercise,
		tags: normalizeTags(exercise.tags),
		settings: exercise.settings
	}
}

export function flashcardExerciseJsonToMetadata(
	exercise: FlashcardExerciseJSON
): ExerciseMetadataDto {
	const totalBlocks = 1
	const totalCases = exercise.cards.length

	return {
		id: exercise.id,
		type: 'flashcard',
		language: exercise.language,
		title: exercise.title,
		titleI18n: exercise.titleI18n,
		description: exercise.description,
		descriptionI18n: exercise.descriptionI18n,
		tags: normalizeTags(exercise.tags),
		difficulty: exercise.difficulty,
		totalBlocks,
		totalCases,
		enabled: exercise.enabled
	}
}

export function customExerciseJsonToMetadata(
	exercise: CustomExerciseJSON
): ExerciseMetadataDto {
	switch (exercise.type) {
		case 'word-form':
			return wordFormExerciseJsonToMetadata(exercise)
		case 'flashcard':
			return flashcardExerciseJsonToMetadata(exercise)
		default:
			// TypeScript exhaustiveness check - this should never happen
			return exercise satisfies never
	}
}
