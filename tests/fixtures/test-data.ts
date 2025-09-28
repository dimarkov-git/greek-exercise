/**
 * Test data constants for stable, predictable testing
 */

import verbsBeJson from '../../src/shared/test/msw/data/exercises/verbs-be.json' with {
	type: 'json'
}

import verbsHaveJson from '../../src/shared/test/msw/data/exercises/verbs-have.json' with {
	type: 'json'
}

interface WordFormExerciseCase {
	readonly correct: readonly string[]
}

interface WordFormExerciseBlock {
	readonly cases: readonly WordFormExerciseCase[]
}

interface WordFormExercise {
	readonly blocks: readonly WordFormExerciseBlock[]
}

const asWordFormExercise = (exercise: unknown): WordFormExercise =>
	exercise as WordFormExercise

const flattenPrimaryAnswers = (exercise: WordFormExercise): string[] =>
	exercise.blocks.flatMap(block =>
		block.cases
			.map(exerciseCase => exerciseCase.correct[0])
			.filter((answer): answer is string => Boolean(answer))
	)

const getLastCaseAlternatives = (
	exercise: WordFormExercise
): readonly string[] => {
	const lastBlock = exercise.blocks.at(-1)
	if (!lastBlock) return []

	const lastCase = lastBlock.cases.at(-1)
	return lastCase?.correct ?? []
}

const verbsBeExercise = asWordFormExercise(verbsBeJson)
const verbsHaveExercise = asWordFormExercise(verbsHaveJson)

const verbsBePrimaryAnswers = flattenPrimaryAnswers(verbsBeExercise)
const verbsHavePrimaryAnswers = flattenPrimaryAnswers(verbsHaveExercise)
const verbsHaveFinalCaseAlternatives =
	getLastCaseAlternatives(verbsHaveExercise)

export const LANGUAGES = {
	ui: {
		greek: 'el' as const,
		english: 'en' as const,
		russian: 'ru' as const
	},
	user: {
		english: 'en' as const,
		russian: 'ru' as const
	}
} as const

export const THEMES = {
	light: 'light' as const,
	dark: 'dark' as const
} as const

export const EXERCISE_DATA = {
	verbsBe: {
		correctAnswers: verbsBePrimaryAnswers,
		alternativeAnswers: {
			toneFree: ['ειμαι', 'εισαι', 'ειναι', 'ειμαστε', 'ειστε', 'ειναι']
		},
		wrongAnswers: ['λάθος', 'ακόμα λάθος', 'test']
	},
	verbsHave: {
		correctAnswers: verbsHavePrimaryAnswers,
		alternativeAnswers: {
			finalQuestion: verbsHaveFinalCaseAlternatives
		},
		wrongAnswers: ['λάθος', 'test', 'wrong']
	}
} as const

export const EXERCISE_STATUS = {
	waitingInput: 'WAITING_INPUT' as const,
	checking: 'CHECKING' as const,
	correctAnswer: 'CORRECT_ANSWER' as const,
	wrongAnswer: 'WRONG_ANSWER' as const,
	requireCorrection: 'REQUIRE_CORRECTION' as const,
	requireContinue: 'REQUIRE_CONTINUE' as const,
	completed: 'COMPLETED' as const
} as const

export const VIEWPORT_SIZES = {
	mobile: {width: 375, height: 667},
	tablet: {width: 768, height: 1024},
	desktop: {width: 1280, height: 800}
} as const

/**
 * UI text constants for language-specific content validation
 */
export const UI_TEXT = {
	headings: {
		greek: 'Μάθε Ελληνικά',
		english: 'Learn Greek',
		russian: 'Учим греческий'
	},
	menuLabels: {
		// Regex pattern for menu button in all supported languages
		menuButton: /menu|μενού|меню/i
	},
	progress: {
		// Regex pattern for progress text like "2 of 6", "2 из 6", "2 από 6"
		ofPattern: /of|из|από/,
		// Helper function to create progress pattern for specific numbers
		createPattern: (currentQuestion: number) =>
			new RegExp(`${currentQuestion}.*(of|из|από).*\\d+`)
	}
} as const

export const TIMEOUTS = {
	fast: 1000,
	normal: 2000,
	slow: 3000,
	autoAdvance: 4000,
	completion: 10_000
} as const
