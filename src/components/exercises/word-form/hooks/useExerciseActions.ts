import {useCallback} from 'react'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormExercise
} from '@/types/exercises'
import {getTotalCases, shuffleExerciseCases} from '@/utils/exercises'

interface UseExerciseActionsProps {
	exercise: WordFormExercise
	setState: React.Dispatch<React.SetStateAction<ExerciseState>>
	setStatus: React.Dispatch<React.SetStateAction<ExerciseStatus>>
	setCorrectCount: React.Dispatch<React.SetStateAction<number>>
	setIncorrectCount: React.Dispatch<React.SetStateAction<number>>
	setStartTime: React.Dispatch<React.SetStateAction<number>>
}

export function useExerciseActions({
	exercise,
	setState,
	setStatus,
	setCorrectCount,
	setIncorrectCount,
	setStartTime
}: UseExerciseActionsProps) {
	const handleRestart = useCallback(() => {
		const shuffled = shuffleExerciseCases(exercise)
		setState({
			currentBlockIndex: 0,
			currentCaseIndex: 0,
			userAnswer: '',
			isCorrect: null,
			showAnswer: false,
			incorrectAttempts: 0,
			totalCases: getTotalCases(shuffled),
			completedCases: 0,
			autoAdvanceEnabled: true,
			showNameHint: false,
			showPromptHint: false,
			showAdditionalHint: false
		})
		setCorrectCount(0)
		setIncorrectCount(0)
		setStatus('WAITING_INPUT')
		setStartTime(Date.now())
	}, [
		exercise,
		setCorrectCount,
		setIncorrectCount,
		setStartTime,
		setState,
		setStatus
	])

	const handleToggleAutoAdvance = useCallback(() => {
		setState(prev => ({
			...prev,
			autoAdvanceEnabled: !prev.autoAdvanceEnabled
		}))
	}, [setState])

	const handleToggleHint = useCallback(() => {
		setState(prev => ({
			...prev,
			showNameHint: !prev.showNameHint
		}))
	}, [setState])

	return {
		handleRestart,
		handleToggleAutoAdvance,
		handleToggleHint
	}
}
