/**
 * Multiple-choice exercise types (stub)
 *
 * Placeholder types for multiple-choice exercises.
 * Full implementation coming in Phase 7.3.
 */

import type {ExerciseMetadata, ExerciseSettings} from '@/entities/exercise'

/**
 * Multiple-choice exercise structure (stub)
 */
export interface MultipleChoiceExercise {
	id: string
	type: 'multiple-choice'
	title: string
	description?: string
	metadata: ExerciseMetadata
	settings: ExerciseSettings
	// Additional fields will be added in Phase 7.3
}
