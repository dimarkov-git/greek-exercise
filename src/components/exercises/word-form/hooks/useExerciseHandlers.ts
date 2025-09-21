import {useCallback} from 'react'
import type {
	ExerciseEvent,
	ExerciseState,
	ExerciseStatus,
	WordFormCase,
	WordFormExercise as WordFormExerciseType
} from '@/types/exercises'
import {getExerciseSettings} from '@/types/exercises'
import {useAnswerHandler} from './useAnswerHandler'
import {useExerciseState} from './useExerciseState'

interface UseExerciseHandlersProps {
	exercise: WordFormExerciseType
	state: ExerciseState
	status: ExerciseStatus
	currentCase: WordFormCase | undefined
	setState: React.Dispatch<React.SetStateAction<ExerciseState>>
	setStatus: React.Dispatch<React.SetStateAction<ExerciseStatus>>
	setCorrectCount: React.Dispatch<React.SetStateAction<number>>
	setIncorrectCount: React.Dispatch<React.SetStateAction<number>>
	setStartTime: React.Dispatch<React.SetStateAction<number>>
	triggerPulse: (isCorrect: boolean) => void
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

export function useExerciseHandlers(props: UseExerciseHandlersProps) {
	const {
		handleContinue,
		handleRestart,
		handleToggleAutoAdvance,
		handleToggleHint
	} = useExerciseState(props)

	const {handleSubmitAnswer} = useAnswerHandler({
		...props,
		handleContinue
	})

	const handleEvent = useCallback(
		(event: ExerciseEvent) => {
			switch (event.type) {
				case 'SUBMIT_ANSWER':
					return handleSubmitAnswer(event.answer)
				case 'CONTINUE':
					return handleContinue()
				case 'SKIP':
					if (getExerciseSettings(props.exercise).allowSkip) handleContinue()
					return
				case 'RESTART':
					return handleRestart()
				case 'TOGGLE_AUTO_ADVANCE':
					return handleToggleAutoAdvance()
				case 'TOGGLE_HINT':
					return handleToggleHint()
				default:
					return
			}
		},
		[
			handleSubmitAnswer,
			handleContinue,
			handleRestart,
			handleToggleAutoAdvance,
			handleToggleHint,
			props.exercise
		]
	)

	return {
		handleEvent,
		handleSubmitAnswer,
		handleContinue,
		handleRestart,
		handleToggleAutoAdvance
	}
}
