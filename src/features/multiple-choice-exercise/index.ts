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

export {MultipleChoiceLearnView} from './ui/MultipleChoiceLearnView'
// Export components
export {MultipleChoiceRenderer} from './ui/MultipleChoiceRenderer'
