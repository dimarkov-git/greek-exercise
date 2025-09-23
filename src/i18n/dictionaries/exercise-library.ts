import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const exerciseLibraryTranslations = createTranslationDictionary([
	'exerciseLibrary',
	'exerciseLibraryDesc',
	'settings',
	'hintLanguage',
	'userLanguageDescription',
	'exerciseCount',
	'noExercisesFound',
	'noExercisesFoundDesc',
	'clearFilters',
	'startExercise',
	'learn',
	'filters',
	'difficulty',
	'tags',
	'language',
	'all',
	'ui.searchEmoji',
	'ui.documentEmoji',
	'ui.booksEmoji',
	'ui.timerEmoji',
	'exercise.cases',
	'exercise.blocks',
	'exercise.minutes',
	'ui.hashSymbol',
	'ui.plusSymbol',
	'ui.expand',
	'ui.collapse',
	'ui.colon',
	'difficulty.a0',
	'difficulty.a1',
	'difficulty.a2',
	'difficulty.b1',
	'difficulty.b2',
	'difficulty.c1',
	'difficulty.c2'
] as const)

export type ExerciseLibraryTranslationKey = DictionaryKeys<
	typeof exerciseLibraryTranslations
>
