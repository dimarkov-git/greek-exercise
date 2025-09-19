/**
 * Test data constants for stable, predictable testing
 */

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
		correctAnswers: [
			'είμαι', // I am
			'είσαι', // you are
			'είναι', // he/she/it is
			'είμαστε', // we are
			'είστε', // you are (plural)
			'είναι' // they are
		],
		alternativeAnswers: {
			// Answers without tones should also work
			toneFree: ['ειμαι', 'εισαι', 'ειναι', 'ειμαστε', 'ειστε', 'ειναι']
		},
		wrongAnswers: ['λάθος', 'ακόμα λάθος', 'test']
	},
	verbsHave: {
		correctAnswers: [
			'έχω', // I have
			'έχεις', // you have
			'έχει', // he/she/it has
			'έχουμε', // we have
			'έχετε', // you have (plural)
			'έχουν' // they have (primary)
		],
		alternativeAnswers: {
			finalQuestion: ['έχουν', 'έχουνε'] // Alternative forms for "they have"
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
	completed: 'COMPLETED' as const
} as const

export const VIEWPORT_SIZES = {
	mobile: {width: 375, height: 667},
	tablet: {width: 768, height: 1024},
	desktop: {width: 1280, height: 800}
} as const

export const TIMEOUTS = {
	fast: 1000,
	normal: 2000,
	slow: 3000,
	autoAdvance: 2000,
	completion: 10_000
} as const
