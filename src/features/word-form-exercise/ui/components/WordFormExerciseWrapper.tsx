import type {WordFormExercise as WordFormExerciseType} from '@/entities/exercise'
import {useWordFormExercise} from '../../model/hooks/useWordFormExercise'
import {ExerciseRenderer} from './ExerciseRenderer'

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

	return (
		<ExerciseRenderer
			{...hookResult}
			{...(props.onExit ? {onExit: props.onExit} : {})}
		/>
	)
}
