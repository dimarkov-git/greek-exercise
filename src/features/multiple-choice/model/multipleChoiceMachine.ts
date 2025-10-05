/**
 * Multiple-choice exercise state machine
 *
 * Manages state transitions and logic for multiple-choice exercises.
 */

import type {ExerciseStatus} from '@/entities/exercise'
import {DEFAULT_EXERCISE_SETTINGS} from '@/shared/model'
import type {MultipleChoiceExercise, MultipleChoiceQuestion} from './types'

export interface MultipleChoiceStats {
	correct: number
	incorrect: number
	skipped: number
}

export interface MultipleChoiceMachineState {
	exercise: MultipleChoiceExercise
	status: ExerciseStatus
	currentQuestionIndex: number
	selectedOptionId: string | null
	isCorrect: boolean | null
	autoAdvanceEnabled: boolean
	startedAt: number
	totalQuestions: number
	stats: MultipleChoiceStats
	showHint: boolean
}

export type MultipleChoiceMachineAction =
	| {type: 'SELECT_OPTION'; optionId: string}
	| {type: 'CHECK_ANSWER'}
	| {type: 'ADVANCE'}
	| {type: 'SKIP'}
	| {type: 'COMPLETE'}
	| {type: 'RESTART'; exercise: MultipleChoiceExercise}
	| {type: 'RESTART_WITH_SETTINGS'; exercise: MultipleChoiceExercise}
	| {type: 'TOGGLE_AUTO_ADVANCE'}
	| {type: 'TOGGLE_HINT'}
	| {
			type: 'UPDATE_SETTINGS'
			settings: Partial<MultipleChoiceExercise['settings']>
	  }

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = result[i]
		const other = result[j]
		if (temp !== undefined && other !== undefined) {
			result[i] = other
			result[j] = temp
		}
	}
	return result
}

/**
 * Shuffle questions if settings allow
 */
function shuffleQuestions(
	exercise: MultipleChoiceExercise
): MultipleChoiceExercise {
	const settings = exercise.settings || DEFAULT_EXERCISE_SETTINGS

	if (settings.shuffleCases) {
		return {
			...exercise,
			questions: shuffleArray(exercise.questions)
		}
	}

	return exercise
}

/**
 * Create initial state for the exercise
 */
function createInitialState(
	exercise: MultipleChoiceExercise
): MultipleChoiceMachineState {
	const shuffled = shuffleQuestions(exercise)
	const settings = shuffled.settings || DEFAULT_EXERCISE_SETTINGS

	return {
		exercise: shuffled,
		status: 'WAITING_INPUT',
		currentQuestionIndex: 0,
		selectedOptionId: null,
		isCorrect: null,
		autoAdvanceEnabled: settings.autoAdvance ?? true,
		startedAt: Date.now(),
		totalQuestions: shuffled.questions.length,
		stats: {correct: 0, incorrect: 0, skipped: 0},
		showHint: false
	}
}

/**
 * Check if selected answer is correct
 */
function checkAnswer(
	state: MultipleChoiceMachineState
): MultipleChoiceMachineState {
	const currentQuestion = state.exercise.questions[state.currentQuestionIndex]
	if (!currentQuestion) {
		return state
	}
	const isCorrect = state.selectedOptionId === currentQuestion.correctOptionId

	return {
		...state,
		status: isCorrect ? 'CORRECT_ANSWER' : 'WRONG_ANSWER',
		isCorrect,
		stats: {
			...state.stats,
			correct: isCorrect ? state.stats.correct + 1 : state.stats.correct,
			incorrect: isCorrect ? state.stats.incorrect : state.stats.incorrect + 1
		}
	}
}

/**
 * Advance to next question
 */
function handleAdvance(
	state: MultipleChoiceMachineState
): MultipleChoiceMachineState {
	const nextIndex = state.currentQuestionIndex + 1

	// Check if we've completed all questions
	if (nextIndex >= state.totalQuestions) {
		return {
			...state,
			status: 'COMPLETED'
		}
	}

	return {
		...state,
		status: 'WAITING_INPUT',
		currentQuestionIndex: nextIndex,
		selectedOptionId: null,
		isCorrect: null,
		showHint: false
	}
}

/**
 * Skip current question
 */
function handleSkip(
	state: MultipleChoiceMachineState
): MultipleChoiceMachineState {
	const nextIndex = state.currentQuestionIndex + 1

	// Check if we've completed all questions
	if (nextIndex >= state.totalQuestions) {
		return {
			...state,
			status: 'COMPLETED',
			stats: {
				...state.stats,
				skipped: state.stats.skipped + 1
			}
		}
	}

	return {
		...state,
		status: 'WAITING_INPUT',
		currentQuestionIndex: nextIndex,
		selectedOptionId: null,
		isCorrect: null,
		showHint: false,
		stats: {
			...state.stats,
			skipped: state.stats.skipped + 1
		}
	}
}

/**
 * Main reducer for multiple-choice state machine
 */
export function multipleChoiceReducer(
	state: MultipleChoiceMachineState,
	action: MultipleChoiceMachineAction
): MultipleChoiceMachineState {
	switch (action.type) {
		case 'SELECT_OPTION':
			return {
				...state,
				selectedOptionId: action.optionId
			}

		case 'CHECK_ANSWER':
			return checkAnswer(state)

		case 'ADVANCE':
			return handleAdvance(state)

		case 'SKIP':
			return handleSkip(state)

		case 'COMPLETE':
			return {
				...state,
				status: 'COMPLETED'
			}

		case 'RESTART':
		case 'RESTART_WITH_SETTINGS':
			return createInitialState(action.exercise)

		case 'TOGGLE_AUTO_ADVANCE':
			return {
				...state,
				autoAdvanceEnabled: !state.autoAdvanceEnabled
			}

		case 'TOGGLE_HINT':
			return {
				...state,
				showHint: !state.showHint
			}

		case 'UPDATE_SETTINGS':
			return {
				...state,
				exercise: {
					...state.exercise,
					settings: {
						...state.exercise.settings,
						...action.settings
					}
				},
				// Update autoAdvanceEnabled if it's in the settings
				...(action.settings?.autoAdvance !== undefined
					? {autoAdvanceEnabled: action.settings.autoAdvance}
					: {})
			}

		default:
			return state
	}
}

/**
 * Initialize state
 */
export function initializeMultipleChoiceState(
	exercise: MultipleChoiceExercise
): MultipleChoiceMachineState {
	return createInitialState(exercise)
}

/**
 * Selectors
 */

export function selectCurrentQuestion(
	state: MultipleChoiceMachineState
): MultipleChoiceQuestion | undefined {
	return state.exercise.questions[state.currentQuestionIndex]
}

export function selectProgress(state: MultipleChoiceMachineState): {
	current: number
	total: number
	completed: number
	percentage: number
} {
	const completed = state.currentQuestionIndex
	const current = Math.min(state.currentQuestionIndex + 1, state.totalQuestions)
	const total = state.totalQuestions
	const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

	return {completed, current, total, percentage}
}

export function selectStats(
	state: MultipleChoiceMachineState
): MultipleChoiceStats {
	return state.stats
}

export function selectCanSubmit(state: MultipleChoiceMachineState): boolean {
	return state.status === 'WAITING_INPUT' && state.selectedOptionId !== null
}

export function selectCanSkip(state: MultipleChoiceMachineState): boolean {
	const settings = state.exercise.settings || DEFAULT_EXERCISE_SETTINGS
	return state.status === 'WAITING_INPUT' && (settings.allowSkip ?? false)
}

export function selectCanAdvance(state: MultipleChoiceMachineState): boolean {
	return state.status === 'CORRECT_ANSWER' || state.status === 'WRONG_ANSWER'
}
