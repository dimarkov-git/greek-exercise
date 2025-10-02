/**
 * Word-form exercise renderer
 *
 * Adapter component that implements the ExerciseRendererProps contract
 * for word-form exercises. This is the main entry point for executing
 * word-form exercises.
 */

import type {ExerciseRendererProps, WordFormExercise} from '@/entities/exercise'
import {WordFormExerciseWrapper} from './components/WordFormExerciseWrapper'

/**
 * Word-form exercise renderer component
 *
 * Implements the universal ExerciseRendererProps interface for word-form exercises.
 * This component is registered in the exercise type registry and is used by
 * ExercisePage to render word-form exercises.
 *
 * @param props - Exercise renderer props
 * @returns Rendered word-form exercise
 *
 * @example
 * ```typescript
 * <WordFormRenderer
 *   exercise={exercise}
 *   onComplete={handleComplete}
 *   onExit={handleExit}
 * />
 * ```
 */
export function WordFormRenderer({
	exercise,
	onComplete,
	onExit
}: ExerciseRendererProps<WordFormExercise>) {
	return (
		<WordFormExerciseWrapper
			exercise={exercise}
			onComplete={onComplete}
			onExit={onExit}
		/>
	)
}
