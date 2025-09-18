import {useCallback} from 'react'
import {usePulseEffect} from '@/hooks/usePulseEffect'
import type {WordFormExercise as WordFormExerciseType} from '@/types/exercises'
import {useExerciseHandlers} from './useExerciseHandlers'
import {useExerciseInitialization} from './useExerciseInitialization'

interface UseWordFormExerciseProps {
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
}

export function useWordFormExercise({
	exercise: rawExercise,
	onComplete
}: UseWordFormExerciseProps) {
	const {pulseState, triggerPulse, clearPulse} = usePulseEffect()
	const initialization = useExerciseInitialization({exercise: rawExercise})
	const {handleEvent} = useExerciseHandlers({
		...initialization,
		triggerPulse,
		onComplete
	})

	const handleSubmit = useCallback(
		(answer: string) =>
			handleEvent({type: 'SUBMIT_ANSWER', answer: answer.trim()}),
		[handleEvent]
	)

	const handleAutoAdvanceToggle = useCallback(
		() => handleEvent({type: 'TOGGLE_AUTO_ADVANCE'}),
		[handleEvent]
	)

	return {
		...initialization,
		pulseState,
		clearPulse,
		handleEvent,
		handleSubmit,
		handleAutoAdvanceToggle
	}
}
