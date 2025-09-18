import {useCallback} from 'react'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import {checkAnswer} from '@/utils/exercises'

interface UseAnswerHandlerProps {
	exercise: WordFormExercise
	state: ExerciseState
	status: ExerciseStatus
	currentCase: WordFormCase | undefined
	setState: React.Dispatch<React.SetStateAction<ExerciseState>>
	setStatus: React.Dispatch<React.SetStateAction<ExerciseStatus>>
	setCorrectCount: React.Dispatch<React.SetStateAction<number>>
	setIncorrectCount: React.Dispatch<React.SetStateAction<number>>
	triggerPulse: (isCorrect: boolean) => void
	handleContinue: () => void
}

export function useAnswerHandler({
	exercise,
	state,
	status,
	currentCase,
	setState,
	setStatus,
	setCorrectCount,
	setIncorrectCount,
	triggerPulse,
	handleContinue
}: UseAnswerHandlerProps) {
	const handleSubmitAnswer = useCallback(
		(answer: string) => {
			if (status !== 'WAITING_INPUT') return

			setStatus('CHECKING')

			const isCorrect = currentCase
				? checkAnswer(answer, currentCase.correct)
				: false

			setState(prev => ({
				...prev,
				userAnswer: answer,
				isCorrect
			}))

			if (isCorrect) {
				setCorrectCount(prev => prev + 1)
				triggerPulse(true)
				setStatus('CORRECT_ANSWER')

				if (state.autoAdvanceEnabled) {
					setTimeout(() => {
						handleContinue()
					}, exercise.settings.autoAdvanceDelayMs)
				}
			} else {
				setIncorrectCount(prev => prev + 1)
				triggerPulse(false)
				setState(prev => ({
					...prev,
					showAnswer: true,
					incorrectAttempts: prev.incorrectAttempts + 1
				}))
				setStatus('WRONG_ANSWER')

				setTimeout(() => {
					setStatus('REQUIRE_CORRECTION')
				}, 2000)
			}
		},
		[
			status,
			currentCase,
			state.autoAdvanceEnabled,
			exercise.settings.autoAdvanceDelayMs,
			triggerPulse,
			handleContinue,
			setCorrectCount,
			setIncorrectCount,
			setState,
			setStatus
		]
	)

	return {handleSubmitAnswer}
}
