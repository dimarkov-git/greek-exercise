import type {
	ExerciseState,
	ExerciseStatus,
	WordFormExercise
} from '@/types/exercises'
import {useExerciseActions} from './useExerciseActions'
import {useExerciseNavigation} from './useExerciseNavigation'

interface UseExerciseStateProps {
	exercise: WordFormExercise
	state: ExerciseState
	setState: React.Dispatch<React.SetStateAction<ExerciseState>>
	setStatus: React.Dispatch<React.SetStateAction<ExerciseStatus>>
	setCorrectCount: React.Dispatch<React.SetStateAction<number>>
	setIncorrectCount: React.Dispatch<React.SetStateAction<number>>
	setStartTime: React.Dispatch<React.SetStateAction<number>>
	correctCount: number
	incorrectCount: number
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
}

export function useExerciseState(props: UseExerciseStateProps) {
	const {handleContinue} = useExerciseNavigation(props)
	const {handleRestart, handleToggleAutoAdvance, handleToggleHint} =
		useExerciseActions(props)

	return {
		handleContinue,
		handleRestart,
		handleToggleAutoAdvance,
		handleToggleHint
	}
}
