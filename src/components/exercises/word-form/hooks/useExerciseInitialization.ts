import {useEffect, useState} from 'react'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormExercise as WordFormExerciseType
} from '@/types/exercises'
import {
	getCaseByIndices,
	getCompletedCasesCount,
	getTotalCases,
	shuffleExerciseCases
} from '@/utils/exercises'

interface UseExerciseInitializationProps {
	exercise: WordFormExerciseType
}

export function useExerciseInitialization({
	exercise: rawExercise
}: UseExerciseInitializationProps) {
	const [exercise] = useState(() => shuffleExerciseCases(rawExercise))
	const [state, setState] = useState<ExerciseState>({
		currentBlockIndex: 0,
		currentCaseIndex: 0,
		userAnswer: '',
		showAnswer: false,
		isCorrect: null,
		completedCases: 0,
		totalCases: getTotalCases(exercise),
		autoAdvanceEnabled: exercise.settings.autoAdvance,
		incorrectAttempts: 0,
		showNameHint: false,
		showPromptHint: false,
		showAdditionalHint: false
	})

	const [status, setStatus] = useState<ExerciseStatus>('WAITING_INPUT')
	const [startTime, setStartTime] = useState(Date.now())
	const [correctCount, setCorrectCount] = useState(0)
	const [incorrectCount, setIncorrectCount] = useState(0)

	const currentCase = getCaseByIndices(
		exercise,
		state.currentBlockIndex,
		state.currentCaseIndex
	)
	const currentBlock = exercise.blocks[state.currentBlockIndex]

	useEffect(() => {
		const completed = getCompletedCasesCount(
			exercise,
			state.currentBlockIndex,
			state.currentCaseIndex
		)
		setState(prev => ({...prev, completedCases: completed}))
	}, [exercise, state.currentBlockIndex, state.currentCaseIndex])

	return {
		exercise,
		state,
		setState,
		status,
		setStatus,
		startTime,
		setStartTime,
		correctCount,
		setCorrectCount,
		incorrectCount,
		setIncorrectCount,
		currentCase,
		currentBlock
	}
}
