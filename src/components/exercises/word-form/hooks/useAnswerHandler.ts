import {useCallback, useEffect, useRef} from 'react'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import {getExerciseSettings} from '@/types/exercises'
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

interface CorrectAnswerOptions {
	status: ExerciseStatus
	setCorrectCount: React.Dispatch<React.SetStateAction<number>>
	triggerPulse: (isCorrect: boolean) => void
	setStatus: React.Dispatch<React.SetStateAction<ExerciseStatus>>
	autoAdvanceEnabled: boolean
	handleContinue: () => void
	autoAdvanceDelayMs: number
	setTimer: (callback: () => void, delay: number) => void
}

function handleCorrectAnswer({
	status,
	setCorrectCount,
	triggerPulse,
	setStatus,
	autoAdvanceEnabled,
	handleContinue,
	autoAdvanceDelayMs,
	setTimer
}: CorrectAnswerOptions) {
	// Only increment correct count on first correct answer, not corrections
	if (status === 'WAITING_INPUT') {
		setCorrectCount(prev => prev + 1)
	}
	triggerPulse(true)
	setStatus('CORRECT_ANSWER')

	if (autoAdvanceEnabled) {
		setTimer(() => {
			handleContinue()
		}, autoAdvanceDelayMs)
	} else {
		// When autoAdvance is disabled, wait for user to continue manually
		setTimer(() => {
			setStatus('REQUIRE_CONTINUE')
		}, 1000) // Brief delay to show green feedback
	}
}

interface IncorrectAnswerOptions {
	status: ExerciseStatus
	setIncorrectCount: React.Dispatch<React.SetStateAction<number>>
	setState: React.Dispatch<React.SetStateAction<ExerciseState>>
	triggerPulse: (isCorrect: boolean) => void
	setStatus: React.Dispatch<React.SetStateAction<ExerciseStatus>>
	answer: string
	answerIsCorrect: boolean
}

function handleIncorrectAnswer({
	status,
	setIncorrectCount,
	setState,
	triggerPulse,
	setStatus,
	answer,
	answerIsCorrect
}: IncorrectAnswerOptions) {
	// Only increment incorrect count and set showAnswer on first wrong answer
	if (status === 'WAITING_INPUT') {
		setIncorrectCount(prev => prev + 1)
		setState(prev => ({
			...prev,
			userAnswer: answer,
			isCorrect: answerIsCorrect,
			showAnswer: true,
			incorrectAttempts: prev.incorrectAttempts + 1
		}))
	} else {
		// In REQUIRE_CORRECTION state, just increment attempts
		setState(prev => ({
			...prev,
			userAnswer: answer,
			isCorrect: answerIsCorrect,
			incorrectAttempts: prev.incorrectAttempts + 1
		}))
	}
	triggerPulse(false)
	setStatus('WRONG_ANSWER')

	setTimeout(() => {
		setStatus('REQUIRE_CORRECTION')
	}, 2000)
}

function useTimer() {
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	// Clear timer on component unmount
	useEffect(
		() => () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		},
		[]
	)

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
			timerRef.current = null
		}
	}, [])

	const setTimer = useCallback(
		(callback: () => void, delay: number) => {
			clearTimer()
			timerRef.current = setTimeout(callback, delay)
		},
		[clearTimer]
	)

	return {setTimer}
}

function useProcessAnswer({
	status,
	state,
	exercise,
	setState,
	setStatus,
	setCorrectCount,
	setIncorrectCount,
	triggerPulse,
	handleContinue,
	setTimer
}: Omit<UseAnswerHandlerProps, 'currentCase'> & {
	setTimer: (callback: () => void, delay: number) => void
}) {
	return useCallback(
		(answer: string, caseData: WordFormCase) => {
			let isCorrect: boolean
			try {
				isCorrect = checkAnswer(answer, caseData.correct)
			} catch {
				isCorrect = false
			}

			setState(prev => ({
				...prev,
				userAnswer: answer,
				isCorrect
			}))

			if (isCorrect) {
				handleCorrectAnswer({
					status,
					setCorrectCount,
					triggerPulse,
					setStatus,
					autoAdvanceEnabled: state.autoAdvanceEnabled,
					handleContinue,
					autoAdvanceDelayMs: getExerciseSettings(exercise).autoAdvanceDelayMs,
					setTimer
				})
			} else {
				handleIncorrectAnswer({
					status,
					setIncorrectCount,
					setState,
					triggerPulse,
					setStatus,
					answer,
					answerIsCorrect: isCorrect
				})
			}
		},
		[
			status,
			state.autoAdvanceEnabled,
			triggerPulse,
			handleContinue,
			setCorrectCount,
			setIncorrectCount,
			setState,
			setStatus,
			setTimer,
			exercise
		]
	)
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
	const {setTimer} = useTimer()

	const processAnswer = useProcessAnswer({
		exercise,
		state,
		status,
		setState,
		setStatus,
		setCorrectCount,
		setIncorrectCount,
		triggerPulse,
		handleContinue,
		setTimer
	})

	const validateInput = useCallback(
		(answer: string) =>
			(status === 'WAITING_INPUT' || status === 'REQUIRE_CORRECTION') &&
			answer.trim() &&
			currentCase,
		[status, currentCase]
	)

	const handleSubmitAnswer = useCallback(
		(answer: string) => {
			if (!currentCase) return

			// If in REQUIRE_CONTINUE state, just continue to next question
			if (status === 'REQUIRE_CONTINUE') {
				handleContinue()
				return
			}

			if (!validateInput(answer)) return

			setStatus('CHECKING')
			processAnswer(answer, currentCase)
		},
		[
			validateInput,
			currentCase,
			setStatus,
			processAnswer,
			status,
			handleContinue
		]
	)

	return {handleSubmitAnswer}
}
