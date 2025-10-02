/**
 * Word-form exercise feature
 *
 * Implements Greek word conjugation and declension exercises.
 * Supports multiple correct answers, hints in multiple languages, and progress tracking.
 */

// Register this exercise type in the global registry
import {exerciseTypeRegistry} from '@/entities/exercise'
import {WordFormLearnView} from './ui/WordFormLearnView'
import {WordFormRenderer} from './ui/WordFormRenderer'

// Auto-register on module import
exerciseTypeRegistry.register('word-form', {
	renderer: WordFormRenderer,
	learnView: WordFormLearnView
	// libraryCard is optional - uses default card
})

// Export state management
export {useWordFormExercise} from './model/hooks/useWordFormExercise'
export * from './model/machine/wordFormMachine'

// Export UI components for internal use
export {CompletionScreen} from './ui/components/CompletionScreen'
export {ExerciseContent} from './ui/components/ExerciseContent'
export {ExerciseRenderer} from './ui/components/ExerciseRenderer'
export {WordFormExercise} from './ui/components/WordFormExercise'
export {WordFormExerciseWrapper} from './ui/components/WordFormExerciseWrapper'
export {WordFormFeedback} from './ui/components/WordFormFeedback'
export {WordFormInput} from './ui/components/WordFormInput'
// Export hint system (will be moved to shared later)
export type {PulseState} from './ui/hint-system'
export {HintSystem} from './ui/hint-system/components/HintSystem'
export {PulseEffect} from './ui/hint-system/components/PulseEffect'
export {useHintState} from './ui/hint-system/hooks/useHintState'
export {usePulseEffect} from './ui/hint-system/hooks/usePulseEffect'
export {WordFormLearnView} from './ui/WordFormLearnView'
// Export main components
export {WordFormRenderer} from './ui/WordFormRenderer'
