import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const learnPageTranslations = createTranslationDictionary([
	'learnExercise',
	'jsonView',
	'tableView',
	'exerciseStructure',
	'startExercise',
	'exercise.backToLibrary',
	'exercise.unsupportedType',
	'exercise.notImplemented',
	'exercise.difficulty',
	'exercise.minutes',
	'exercise.blocks',
	'exercise.cases',
	'exercise.currentSettings',
	'exercise.settingsInfo',
	'interfaceLanguage',
	'userLanguage',
	'theme',
	'lightTheme',
	'darkTheme',
	'ui.leftArrow',
	'ui.playIcon',
	'ui.hashSymbol'
] as const)

export type LearnPageTranslationKey = DictionaryKeys<
	typeof learnPageTranslations
>
