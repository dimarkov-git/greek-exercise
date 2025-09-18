import type {WordFormExercise as WordFormExerciseType} from '@/types/exercises'
import {ExerciseRenderer} from './ExerciseRenderer'
import {useWordFormExercise} from './hooks/useWordFormExercise'

interface WordFormExerciseWrapperProps {
	exercise: WordFormExerciseType
	onComplete?:
		| ((result: {
				exerciseId: string
				totalCases: number
				correctAnswers: number
				incorrectAnswers: number
				timeSpentMs?: number
				accuracy?: number
		  }) => void)
		| undefined
	onExit?: () => void
}

export function WordFormExerciseWrapper(props: WordFormExerciseWrapperProps) {
	const hookResult = useWordFormExercise({
		exercise: props.exercise,
		onComplete: props.onComplete
	})

	return <ExerciseRenderer {...hookResult} onExit={props.onExit} />
}
