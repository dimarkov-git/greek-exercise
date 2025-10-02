/**
 * Word-form exercise learn view
 *
 * Adapter component that implements the ExerciseLearnViewProps contract
 * for word-form exercises. This is the main entry point for learning/studying
 * word-form exercises.
 */

import type {
	ExerciseLearnViewProps,
	WordFormExercise
} from '@/entities/exercise'
import {JsonView, TableView} from './learn-view'

/**
 * Word-form exercise learn view component
 *
 * Implements the universal ExerciseLearnViewProps interface for word-form exercises.
 * This component is registered in the exercise type registry and is used by
 * LearnPage to render word-form exercise study views.
 *
 * Displays exercise structure in two modes:
 * - table: Human-readable tabular view with all questions and answers
 * - json: Raw JSON view for technical analysis or copying
 *
 * @param props - Exercise learn view props
 * @returns Rendered learn view
 *
 * @example
 * ```typescript
 * <WordFormLearnView
 *   exercise={exercise}
 *   viewMode="table"
 * />
 * ```
 */
export function WordFormLearnView({
	exercise,
	viewMode
}: ExerciseLearnViewProps<WordFormExercise>) {
	if (viewMode === 'json') {
		return <JsonView exercise={exercise} />
	}

	return <TableView exercise={exercise} />
}
