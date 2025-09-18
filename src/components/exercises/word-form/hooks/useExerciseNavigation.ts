import {useCallback} from 'react'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormExercise
} from '@/types/exercises'
import {getNextIndices} from '@/utils/exercises'

interface UseExerciseNavigationProps {
	exercise: WordFormExercise
	state: ExerciseState
	setState: React.Dispatch<React.SetStateAction<ExerciseState>>
	setStatus: React.Dispatch<React.SetStateAction<ExerciseStatus>>
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

export function useExerciseNavigation({
	exercise,
	state,
	setState,
	setStatus,
	correctCount,
	incorrectCount,
	onComplete
}: UseExerciseNavigationProps) {
	const handleContinue = useCallback(() => {
		const nextIndices = getNextIndices(
			exercise,
			state.currentBlockIndex,
			state.currentCaseIndex
		)

		if (nextIndices) {
			setState(prev => ({
				...prev,
				currentBlockIndex: nextIndices.blockIndex,
				currentCaseIndex: nextIndices.caseIndex,
				userAnswer: '',
				isCorrect: null,
				showAnswer: false,
				incorrectAttempts: 0
			}))
			setStatus('WAITING_INPUT')
		} else {
			setStatus('COMPLETED')
			onComplete?.({
				exerciseId: exercise.id,
				totalCases: state.totalCases,
				correctAnswers: correctCount,
				incorrectAnswers: incorrectCount
			})
		}
	}, [
		exercise,
		state.currentBlockIndex,
		state.currentCaseIndex,
		state.totalCases,
		correctCount,
		incorrectCount,
		onComplete,
		setState,
		setStatus
	])

	return {handleContinue}
}
