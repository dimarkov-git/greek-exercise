import type {WordFormExercise as WordFormExerciseType} from '@/types/exercises'
import {WordFormExerciseWrapper} from './WordFormExerciseWrapper'

interface WordFormExerciseProps {
	exercise: WordFormExerciseType
	onComplete?: (result: {
		exerciseId: string
		totalCases: number
		correctAnswers: number
		incorrectAnswers: number
		timeSpentMs?: number
		accuracy?: number
	}) => void
	onExit?: () => void
}

export function WordFormExercise(props: WordFormExerciseProps) {
	return <WordFormExerciseWrapper {...props} />
}
