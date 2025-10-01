import type {TranslationDictionary} from '@/shared/lib/i18n'

export const exerciseLibraryTranslations = {
	// Library Header
	exerciseLibrary: 'exerciseLibrary',
	exerciseLibraryDesc: 'exerciseLibraryDesc',

	// User Settings
	settings: 'settings',
	userLanguageDescription: 'userLanguageDescription',
	hintLanguage: 'hintLanguage',

	// Exercise Filters
	filters: 'filters',
	difficulty: 'difficulty',
	language: 'language',
	tags: 'tags',
	all: 'all',

	// Exercise Grid
	exerciseCount: 'exerciseCount',
	startExercise: 'startExercise',
	learn: 'learn',
	noExercisesFound: 'noExercisesFound',
	noExercisesFoundDesc: 'noExercisesFoundDesc',
	clearFilters: 'clearFilters',

	// UI Elements
	'ui.expand': 'ui.expand',
	'ui.collapse': 'ui.collapse',
	'ui.colon': 'ui.colon',
	'ui.hashSymbol': 'ui.hashSymbol',
	'ui.plusSymbol': 'ui.plusSymbol',
	'ui.documentEmoji': 'ui.documentEmoji',
	'ui.booksEmoji': 'ui.booksEmoji',
	'ui.timerEmoji': 'ui.timerEmoji',
	'ui.searchEmoji': 'ui.searchEmoji',

	// Exercise metadata
	'exercise.cases': 'exercise.cases',
	'exercise.blocks': 'exercise.blocks',
	'exercise.minutes': 'exercise.minutes',

	// Builder
	'builder.customBadge': 'builder.customBadge',

	// Difficulty levels
	'difficulty.a0': 'difficulty.a0',
	'difficulty.a1': 'difficulty.a1',
	'difficulty.a2': 'difficulty.a2',
	'difficulty.b1': 'difficulty.b1',
	'difficulty.b2': 'difficulty.b2',
	'difficulty.c1': 'difficulty.c1',
	'difficulty.c2': 'difficulty.c2'
} as const satisfies TranslationDictionary
