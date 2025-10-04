/**
 * Multiple-choice exercise hook
 *
 * Main React hook for managing multiple-choice exercise state and interactions.
 */

import {useCallback, useEffect, useReducer, useRef} from 'react'
import type {ExerciseResult} from '@/entities/exercise'
import {
	initializeMultipleChoiceState,
	type MultipleChoiceMachineState,
	multipleChoiceReducer,
	selectCanAdvance,
	selectCanSkip,
	selectCanSubmit,
	selectCurrentQuestion,
	selectProgress,
	selectStats
} from './multipleChoiceMachine'
import type {MultipleChoiceExercise} from './types'

/**
 * View state returned by the hook
 */
export interface MultipleChoiceViewState {
	exercise: MultipleChoiceExercise
	currentQuestion: ReturnType<typeof selectCurrentQuestion>
	selectedOptionId: string | null
	isCorrect: boolean | null
	status: MultipleChoiceMachineState['status']
	progress: ReturnType<typeof selectProgress>
	stats: ReturnType<typeof selectStats>
	showHint: boolean
	autoAdvanceEnabled: boolean
	canSubmit: boolean
	canSkip: boolean
	canAdvance: boolean
	startedAt: number
}

/**
 * Hook for managing multiple-choice exercise sessions
 *
 * @param exercise - Multiple-choice exercise to practice
 * @param onComplete - Callback when exercise is completed
 * @returns View state and action handlers
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Main hook with initialization and handlers
export function useMultipleChoiceExercise(
	exercise: MultipleChoiceExercise,
	onComplete?: (result: Omit<ExerciseResult, 'completedAt'>) => void
) {
	const [state, dispatch] = useReducer(
		multipleChoiceReducer,
		exercise,
		initializeMultipleChoiceState
	)

	const completionHandledRef = useRef(false)

	// Handle option selection
	const handleSelectOption = useCallback((optionId: string) => {
		dispatch({type: 'SELECT_OPTION', optionId})
	}, [])

	// Handle answer check
	const handleCheckAnswer = useCallback(() => {
		if (!selectCanSubmit(state)) return

		dispatch({type: 'CHECK_ANSWER'})
	}, [state])

	// Handle advance to next question
	const handleAdvance = useCallback(() => {
		dispatch({type: 'ADVANCE'})
	}, [])

	// Handle skip question
	const handleSkip = useCallback(() => {
		if (!selectCanSkip(state)) return

		dispatch({type: 'SKIP'})
	}, [state])

	// Handle restart
	const handleRestart = useCallback(() => {
		completionHandledRef.current = false
		dispatch({type: 'RESTART', exercise})
	}, [exercise])

	// Handle toggle auto-advance
	const handleToggleAutoAdvance = useCallback(() => {
		dispatch({type: 'TOGGLE_AUTO_ADVANCE'})
	}, [])

	// Handle toggle hint
	const handleToggleHint = useCallback(() => {
		dispatch({type: 'TOGGLE_HINT'})
	}, [])

	// Auto-advance after correct answer
	useEffect(() => {
		if (
			state.autoAdvanceEnabled &&
			state.status === 'CORRECT_ANSWER' &&
			selectCanAdvance(state)
		) {
			const settings = exercise.settings
			const delay = settings?.autoAdvanceDelayMs ?? 1500

			const timeoutId = setTimeout(() => {
				dispatch({type: 'ADVANCE'})
			}, delay)

			return () => {
				clearTimeout(timeoutId)
			}
		}

		return
	}, [state.status, state.autoAdvanceEnabled, exercise.settings, state])

	// Handle completion
	useEffect(() => {
		if (state.status === 'COMPLETED' && !completionHandledRef.current) {
			completionHandledRef.current = true

			const total = state.stats.correct + state.stats.incorrect
			const accuracy =
				total > 0 ? Math.round((state.stats.correct / total) * 100) : undefined

			const result: Omit<ExerciseResult, 'completedAt'> = {
				exerciseId: exercise.id,
				totalCases: state.totalQuestions,
				correctAnswers: state.stats.correct,
				incorrectAnswers: state.stats.incorrect,
				timeSpentMs: Date.now() - state.startedAt,
				...(accuracy !== undefined ? {accuracy} : {})
			}

			onComplete?.(result)
		}
	}, [
		state.status,
		state.stats,
		state.totalQuestions,
		state.startedAt,
		exercise.id,
		onComplete
	])

	// Build view state
	const viewState: MultipleChoiceViewState = {
		exercise,
		currentQuestion: selectCurrentQuestion(state),
		selectedOptionId: state.selectedOptionId,
		isCorrect: state.isCorrect,
		status: state.status,
		progress: selectProgress(state),
		stats: selectStats(state),
		showHint: state.showHint,
		autoAdvanceEnabled: state.autoAdvanceEnabled,
		canSubmit: selectCanSubmit(state),
		canSkip: selectCanSkip(state),
		canAdvance: selectCanAdvance(state),
		startedAt: state.startedAt
	}

	return {
		state: viewState,
		handleSelectOption,
		handleCheckAnswer,
		handleAdvance,
		handleSkip,
		handleRestart,
		handleToggleAutoAdvance,
		handleToggleHint
	}
}
