/**
 * Flashcard exercise feature (stub)
 *
 * Placeholder for flashcard exercises with spaced repetition.
 * Full implementation coming in Phase 7.2.
 */

import {exerciseTypeRegistry} from '@/entities/exercise'
import {FlashcardLearnView} from './ui/FlashcardLearnView'
import {FlashcardRenderer} from './ui/FlashcardRenderer'

// Auto-register flashcard type
exerciseTypeRegistry.register('flashcard', {
	renderer: FlashcardRenderer,
	learnView: FlashcardLearnView
	// libraryCard is optional - uses default card
})

export {FlashcardLearnView} from './ui/FlashcardLearnView'
// Export components
export {FlashcardRenderer} from './ui/FlashcardRenderer'
