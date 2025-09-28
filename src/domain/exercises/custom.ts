import type {ExerciseMetadataDto} from '@/schemas/exercises'
import type {WordFormExerciseJSON} from '@/types/exercises'

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
		estimatedTimeMinutes: exercise.estimatedTimeMinutes,
		totalBlocks,
		totalCases,
		enabled: exercise.enabled
	}
}
