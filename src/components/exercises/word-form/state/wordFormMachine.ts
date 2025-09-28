import {
	type ExerciseStatus,
	getExerciseSettings,
	type WordFormBlock,
	type WordFormCase,
	type WordFormExercise
} from '@/entities/exercise'
import {
	getCaseByIndices,
	getCompletedCasesCount,
	getNextIndices,
	getTotalCases,
	shuffleExerciseCases
} from '@/utils/exercises'

export interface WordFormStats {
	correct: number
	incorrect: number
}

export interface WordFormHintVisibility {
	name: boolean
	prompt: boolean
	additional: boolean
}

export interface WordFormMachineState {
	exercise: WordFormExercise
	status: ExerciseStatus
	currentBlockIndex: number
	currentCaseIndex: number
	userAnswer: string
	originalUserAnswer: string
	isCorrect: boolean | null
	showAnswer: boolean
	incorrectAttempts: number
	autoAdvanceEnabled: boolean
	startedAt: number
	totalCases: number
	stats: WordFormStats
	hints: WordFormHintVisibility
}

export type WordFormMachineAction =
	| {type: 'SET_STATUS'; status: ExerciseStatus}
	| {type: 'SET_USER_ANSWER'; value: string}
	| {type: 'ANSWER_CORRECT'; answer: string; incrementCorrect: boolean}
	| {type: 'ANSWER_INCORRECT'; answer: string; incrementIncorrect: boolean}
	| {type: 'ADVANCE'; next: {blockIndex: number; caseIndex: number}}
	| {type: 'COMPLETE'}
	| {type: 'RESTART'; exercise: WordFormExercise}
	| {type: 'RESET_FROM_PROPS'; exercise: WordFormExercise}
	| {type: 'TOGGLE_AUTO_ADVANCE'}
	| {type: 'TOGGLE_HINT'; hintType: 'name' | 'prompt' | 'additional'}
	| {type: 'REQUIRE_CORRECTION'}
	| {type: 'REQUIRE_CONTINUE'}

function createInitialState(exercise: WordFormExercise): WordFormMachineState {
	const shuffled = shuffleExerciseCases(exercise)
	const settings = getExerciseSettings(shuffled)

	return {
		exercise: shuffled,
		status: 'WAITING_INPUT',
		currentBlockIndex: 0,
		currentCaseIndex: 0,
		userAnswer: '',
		originalUserAnswer: '',
		isCorrect: null,
		showAnswer: false,
		incorrectAttempts: 0,
		autoAdvanceEnabled: settings.autoAdvance,
		startedAt: Date.now(),
		totalCases: getTotalCases(shuffled),
		stats: {correct: 0, incorrect: 0},
		hints: {
			name: false,
			prompt: false,
			additional: false
		}
	}
}

function handleAnswerCorrect(
	state: WordFormMachineState,
	action: Extract<WordFormMachineAction, {type: 'ANSWER_CORRECT'}>
): WordFormMachineState {
	const correct = action.incrementCorrect
		? state.stats.correct + 1
		: state.stats.correct

	return {
		...state,
		status: 'CORRECT_ANSWER',
		userAnswer: action.answer,
		isCorrect: true,
		stats: {
			...state.stats,
			correct
		}
	}
}

function handleAnswerIncorrect(
	state: WordFormMachineState,
	action: Extract<WordFormMachineAction, {type: 'ANSWER_INCORRECT'}>
): WordFormMachineState {
	const incorrect = action.incrementIncorrect
		? state.stats.incorrect + 1
		: state.stats.incorrect

	return {
		...state,
		status: 'WRONG_ANSWER',
		userAnswer: action.answer,
		originalUserAnswer: action.incrementIncorrect
			? action.answer
			: state.originalUserAnswer,
		isCorrect: false,
		showAnswer: action.incrementIncorrect ? true : state.showAnswer,
		incorrectAttempts: state.incorrectAttempts + 1,
		stats: {
			...state.stats,
			incorrect
		}
	}
}

function handleAdvance(
	state: WordFormMachineState,
	action: Extract<WordFormMachineAction, {type: 'ADVANCE'}>
): WordFormMachineState {
	return {
		...state,
		status: 'WAITING_INPUT',
		currentBlockIndex: action.next.blockIndex,
		currentCaseIndex: action.next.caseIndex,
		userAnswer: '',
		originalUserAnswer: '',
		isCorrect: null,
		showAnswer: false,
		incorrectAttempts: 0
	}
}

function handleToggleHint(
	state: WordFormMachineState,
	action: Extract<WordFormMachineAction, {type: 'TOGGLE_HINT'}>
): WordFormMachineState {
	return {
		...state,
		hints: {
			...state.hints,
			[action.hintType]: !state.hints[action.hintType]
		}
	}
}

export function wordFormReducer(
	state: WordFormMachineState,
	action: WordFormMachineAction
): WordFormMachineState {
	switch (action.type) {
		case 'SET_STATUS':
			return {...state, status: action.status}
		case 'SET_USER_ANSWER':
			return {...state, userAnswer: action.value}
		case 'ANSWER_CORRECT':
			return handleAnswerCorrect(state, action)
		case 'ANSWER_INCORRECT':
			return handleAnswerIncorrect(state, action)
		case 'ADVANCE':
			return handleAdvance(state, action)
		case 'COMPLETE':
			return {
				...state,
				status: 'COMPLETED'
			}
		case 'RESTART':
		case 'RESET_FROM_PROPS':
			return createInitialState(action.exercise)
		case 'TOGGLE_AUTO_ADVANCE':
			return {
				...state,
				autoAdvanceEnabled: !state.autoAdvanceEnabled
			}
		case 'TOGGLE_HINT':
			return handleToggleHint(state, action)
		case 'REQUIRE_CORRECTION':
			return {
				...state,
				status: 'REQUIRE_CORRECTION'
			}
		case 'REQUIRE_CONTINUE':
			return {
				...state,
				status: 'REQUIRE_CONTINUE'
			}
		default:
			return state
	}
}

export function initializeWordFormState(
	exercise: WordFormExercise
): WordFormMachineState {
	return createInitialState(exercise)
}

export function selectCurrentBlock(
	state: WordFormMachineState
): WordFormBlock | undefined {
	return state.exercise.blocks[state.currentBlockIndex]
}

export function selectCurrentCase(
	state: WordFormMachineState
): WordFormCase | undefined {
	return getCaseByIndices(
		state.exercise,
		state.currentBlockIndex,
		state.currentCaseIndex
	)
}

export function selectProgress(state: WordFormMachineState): {
	completed: number
	current: number
	total: number
} {
	const completed = getCompletedCasesCount(
		state.exercise,
		state.currentBlockIndex,
		state.currentCaseIndex
	)
	const total = state.totalCases
	const current = total > 0 ? Math.min(completed + 1, total) : 0

	return {completed, current, total}
}

export function selectNextIndices(
	state: WordFormMachineState
): {blockIndex: number; caseIndex: number} | null {
	return getNextIndices(
		state.exercise,
		state.currentBlockIndex,
		state.currentCaseIndex
	)
}

export function selectStats(state: WordFormMachineState): WordFormStats {
	return state.stats
}

export function selectHintVisibility(
	state: WordFormMachineState
): WordFormHintVisibility {
	return state.hints
}
