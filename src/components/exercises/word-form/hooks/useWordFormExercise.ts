import {
	type Dispatch,
	type MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef
} from 'react'
import {usePulseEffect} from '@/hooks/usePulseEffect'
import type {
	ExerciseEvent,
	WordFormExercise as WordFormExerciseType
} from '@/types/exercises'
import {type ExerciseStatus, getExerciseSettings} from '@/types/exercises'
import {checkAnswer} from '@/utils/exercises'
import {
	initializeWordFormState,
	selectCurrentBlock,
	selectCurrentCase,
	selectHintVisibility,
	selectNextIndices,
	selectProgress,
	selectStats,
	type WordFormHintVisibility,
	type WordFormMachineAction,
	type WordFormMachineState,
	type WordFormStats,
	wordFormReducer
} from '../state/wordFormMachine'

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

export interface WordFormViewState {
	answer: {
		value: string
		isCorrect: boolean | null
		showAnswer: boolean
		incorrectAttempts: number
	}
	autoAdvanceEnabled: boolean
	status: ExerciseStatus
	progress: {
		completed: number
		current: number
		total: number
	}
	stats: WordFormStats
	hints: WordFormHintVisibility
	startedAt: number
	exercise: WordFormExerciseType
	currentBlock: ReturnType<typeof selectCurrentBlock>
	currentCase: ReturnType<typeof selectCurrentCase>
}

function useLatest<T>(value: T) {
	const ref = useRef(value)
	useEffect(() => {
		ref.current = value
	}, [value])
	return ref
}

function useInitializedWordFormState(exercise: WordFormExerciseType) {
	const [state, dispatch] = useReducer(
		wordFormReducer,
		exercise,
		initializeWordFormState
	)
	const latestExerciseRef = useLatest(exercise)
	const initialRenderRef = useRef(true)

	useEffect(() => {
		if (initialRenderRef.current) {
			initialRenderRef.current = false
			return
		}
		dispatch({type: 'RESET_FROM_PROPS', exercise})
	}, [exercise])

	return {state, dispatch, latestExerciseRef}
}

function useDerivedWordFormData(state: WordFormMachineState) {
        const currentBlock = useMemo(
                () => selectCurrentBlock(state),
                [state.exercise, state.currentBlockIndex]
        )
        const currentCase = useMemo(
                () => selectCurrentCase(state),
                [state.exercise, state.currentBlockIndex, state.currentCaseIndex]
        )
        const progress = useMemo(
                () => selectProgress(state),
                [
                        state.exercise,
                        state.currentBlockIndex,
                        state.currentCaseIndex,
                        state.totalCases
                ]
        )
        const stats = useMemo(() => selectStats(state), [state.stats])
        const hints = useMemo(() => selectHintVisibility(state), [state.hints])

        return {currentBlock, currentCase, progress, stats, hints}
}

function useAnswerChange(dispatch: Dispatch<WordFormMachineAction>) {
	return useCallback(
		(value: string) => {
			dispatch({type: 'SET_USER_ANSWER', value})
		},
		[dispatch]
	)
}

function useAutoAdvanceToggle(dispatch: Dispatch<WordFormMachineAction>) {
	return useCallback(() => {
		dispatch({type: 'TOGGLE_AUTO_ADVANCE'})
	}, [dispatch])
}

function useContinueHandler({
	state,
	dispatch,
	onComplete
}: {
	state: WordFormMachineState
	dispatch: Dispatch<WordFormMachineAction>
	onComplete?: UseWordFormExerciseProps['onComplete']
}) {
	return useCallback(() => {
		const next = selectNextIndices(state)
		if (next) {
			dispatch({type: 'ADVANCE', next})
			return
		}

		const timeSpentMs = Date.now() - state.startedAt
		const accuracy =
			state.totalCases > 0
				? Math.round((state.stats.correct / state.totalCases) * 100)
				: undefined

		dispatch({type: 'COMPLETE'})
		onComplete?.({
			exerciseId: state.exercise.id,
			totalCases: state.totalCases,
			correctAnswers: state.stats.correct,
			incorrectAnswers: state.stats.incorrect,
			timeSpentMs,
			...(accuracy !== undefined ? {accuracy} : {})
		})
	}, [state, dispatch, onComplete])
}

function useSkipHandler({
	state,
	triggerPulse,
	handleContinue,
	skipTimeoutRef
}: {
	state: WordFormMachineState
	triggerPulse: (state: 'correct' | 'incorrect' | 'skip') => void
	handleContinue: () => void
	skipTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>
}) {
	return useCallback(() => {
		const settings = getExerciseSettings(state.exercise)
		if (!settings.allowSkip) {
			return
		}

		triggerPulse('skip')
		if (skipTimeoutRef.current) {
			clearTimeout(skipTimeoutRef.current)
		}

		skipTimeoutRef.current = setTimeout(() => {
			handleContinue()
		}, 600)
	}, [state.exercise, triggerPulse, handleContinue, skipTimeoutRef])
}

function useSubmitHandler({
	state,
	dispatch,
	triggerPulse,
	handleContinue
}: {
	state: WordFormMachineState
	dispatch: Dispatch<WordFormMachineAction>
	triggerPulse: (state: 'correct' | 'incorrect' | 'skip') => void
	handleContinue: () => void
}) {
	return useCallback(
		(rawAnswer: string) => {
			const caseData = selectCurrentCase(state)
			const trimmedAnswer = rawAnswer.trim()

			if (!caseData || trimmedAnswer.length === 0) {
				return
			}

			if (state.status === 'REQUIRE_CONTINUE') {
				handleContinue()
				return
			}

			if (
				state.status !== 'WAITING_INPUT' &&
				state.status !== 'REQUIRE_CORRECTION'
			) {
				return
			}

			dispatch({type: 'SET_STATUS', status: 'CHECKING'})

			const isCorrect = (() => {
				try {
					return checkAnswer(trimmedAnswer, caseData.correct)
				} catch {
					return false
				}
			})()

			if (isCorrect) {
				triggerPulse('correct')
				dispatch({
					type: 'ANSWER_CORRECT',
					answer: trimmedAnswer,
					incrementCorrect: state.status === 'WAITING_INPUT'
				})
			} else {
				triggerPulse('incorrect')
				dispatch({
					type: 'ANSWER_INCORRECT',
					answer: trimmedAnswer,
					incrementIncorrect: state.status === 'WAITING_INPUT'
				})
			}
		},
		[state, dispatch, triggerPulse, handleContinue]
	)
}

function useStatusEffects({
	state,
	dispatch,
	handleContinue
}: {
	state: WordFormMachineState
	dispatch: Dispatch<WordFormMachineAction>
	handleContinue: () => void
}) {
	useEffect(() => {
		const {exercise, status, autoAdvanceEnabled} = state
		const settings = getExerciseSettings(exercise)

		if (status === 'CORRECT_ANSWER') {
			if (autoAdvanceEnabled) {
				const timeout = setTimeout(() => {
					handleContinue()
				}, settings.autoAdvanceDelayMs)

				return () => {
					clearTimeout(timeout)
				}
			}

			const timeout = setTimeout(() => {
				dispatch({type: 'REQUIRE_CONTINUE'})
			}, 1000)

			return () => {
				clearTimeout(timeout)
			}
		}

		if (status === 'WRONG_ANSWER') {
			const timeout = setTimeout(() => {
				dispatch({type: 'REQUIRE_CORRECTION'})
			}, 2000)

			return () => {
				clearTimeout(timeout)
			}
		}
		return
        }, [
                dispatch,
                handleContinue,
                state.autoAdvanceEnabled,
                state.exercise,
                state.status
        ])
}

function useWordFormEventHandler({
	handleSubmit,
	handleContinue,
	handleSkip,
	handleAutoAdvanceToggle,
	latestExerciseRef,
	dispatch
}: {
	handleSubmit: (answer: string) => void
	handleContinue: () => void
	handleSkip: () => void
	handleAutoAdvanceToggle: () => void
	latestExerciseRef: MutableRefObject<WordFormExerciseType>
	dispatch: Dispatch<WordFormMachineAction>
}) {
	return useCallback(
		(event: ExerciseEvent) => {
			switch (event.type) {
				case 'SUBMIT_ANSWER':
					handleSubmit(event.answer)
					break
				case 'CONTINUE':
					handleContinue()
					break
				case 'SKIP':
					handleSkip()
					break
				case 'RESTART':
					dispatch({
						type: 'RESTART',
						exercise: latestExerciseRef.current
					})
					break
				case 'TOGGLE_AUTO_ADVANCE':
					handleAutoAdvanceToggle()
					break
				case 'TOGGLE_HINT':
					dispatch({
						type: 'TOGGLE_HINT',
						hintType: event.hintType
					})
					break
				default:
					break
			}
		},
		[
			handleSubmit,
			handleContinue,
			handleSkip,
			handleAutoAdvanceToggle,
			latestExerciseRef,
			dispatch
		]
	)
}

function useSkipTimerCleanup(
	skipTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>
) {
	useEffect(
		() => () => {
			if (skipTimeoutRef.current) {
				clearTimeout(skipTimeoutRef.current)
			}
		},
		[skipTimeoutRef]
	)
}

interface UseWordFormHandlersArgs {
	state: WordFormMachineState
	dispatch: Dispatch<WordFormMachineAction>
	onComplete: UseWordFormExerciseProps['onComplete']
	triggerPulse: (state: 'correct' | 'incorrect' | 'skip') => void
	skipTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>
	latestExerciseRef: MutableRefObject<WordFormExerciseType>
}

function useWordFormHandlers({
	state,
	dispatch,
	onComplete,
	triggerPulse,
	skipTimeoutRef,
	latestExerciseRef
}: UseWordFormHandlersArgs) {
	const handleAnswerChange = useAnswerChange(dispatch)
	const handleAutoAdvanceToggle = useAutoAdvanceToggle(dispatch)
	const handleContinue = useContinueHandler({state, dispatch, onComplete})
	const handleSkip = useSkipHandler({
		state,
		triggerPulse,
		handleContinue,
		skipTimeoutRef
	})
	const handleSubmit = useSubmitHandler({
		state,
		dispatch,
		triggerPulse,
		handleContinue
	})

	useStatusEffects({state, dispatch, handleContinue})

	const handleEvent = useWordFormEventHandler({
		handleSubmit,
		handleContinue,
		handleSkip,
		handleAutoAdvanceToggle,
		latestExerciseRef,
		dispatch
	})

	return {
		handleAnswerChange,
		handleAutoAdvanceToggle,
		handleSubmit,
		handleEvent
	}
}

interface UseWordFormViewModelArgs {
	state: WordFormMachineState
	currentBlock: ReturnType<typeof selectCurrentBlock>
	currentCase: ReturnType<typeof selectCurrentCase>
	progress: ReturnType<typeof selectProgress>
	stats: WordFormStats
	hints: WordFormHintVisibility
}

function useWordFormViewModel({
	state,
	currentBlock,
	currentCase,
	progress,
	stats,
	hints
}: UseWordFormViewModelArgs): WordFormViewState {
	return useMemo(
		() => ({
			answer: {
				value: state.userAnswer,
				isCorrect: state.isCorrect,
				showAnswer: state.showAnswer,
				incorrectAttempts: state.incorrectAttempts
			},
			autoAdvanceEnabled: state.autoAdvanceEnabled,
			status: state.status,
			progress,
			stats,
			hints,
			startedAt: state.startedAt,
			exercise: state.exercise,
			currentBlock,
			currentCase
		}),
		[
			state.userAnswer,
			state.isCorrect,
			state.showAnswer,
			state.incorrectAttempts,
			state.autoAdvanceEnabled,
			state.status,
			progress,
			stats,
			hints,
			state.startedAt,
			state.exercise,
			currentBlock,
			currentCase
		]
	)
}

export function useWordFormExercise({
	exercise: rawExercise,
	onComplete
}: UseWordFormExerciseProps) {
	const {state, dispatch, latestExerciseRef} =
		useInitializedWordFormState(rawExercise)
	const {pulseState, triggerPulse, clearPulse} = usePulseEffect()
	const skipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useSkipTimerCleanup(skipTimeoutRef)

	const {currentBlock, currentCase, progress, stats, hints} =
		useDerivedWordFormData(state)

	const {
		handleAnswerChange,
		handleAutoAdvanceToggle,
		handleSubmit,
		handleEvent
	} = useWordFormHandlers({
		state,
		dispatch,
		onComplete,
		triggerPulse,
		skipTimeoutRef,
		latestExerciseRef
	})

	const viewState = useWordFormViewModel({
		state,
		currentBlock,
		currentCase,
		progress,
		stats,
		hints
	})

	return {
		state: viewState,
		pulseState,
		clearPulse,
		handleEvent,
		handleSubmit,
		handleAutoAdvanceToggle,
		handleAnswerChange
	}
}
