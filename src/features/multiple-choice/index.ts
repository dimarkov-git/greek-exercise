/**
 * Multiple-choice exercise feature (stub)
 *
 * Placeholder for multiple-choice exercises.
 * Full implementation coming in Phase 7.3.
 */

import {exerciseTypeRegistry} from '@/entities/exercise'
import {MultipleChoiceLearnView} from './ui/MultipleChoiceLearnView'
import {MultipleChoiceRenderer} from './ui/MultipleChoiceRenderer'

// Auto-register multiple-choice type
exerciseTypeRegistry.register('multiple-choice', {
	renderer: MultipleChoiceRenderer,
	learnView: MultipleChoiceLearnView
	// libraryCard is optional - uses default card
})

// Re-export types from entities (for convenience)
export type {
	MultipleChoiceExercise,
	MultipleChoiceOption,
	MultipleChoiceQuestion
} from '@/entities/exercise'
// Export components
export {MultipleChoiceLearnView} from './ui/MultipleChoiceLearnView'
export {MultipleChoiceRenderer} from './ui/MultipleChoiceRenderer'
