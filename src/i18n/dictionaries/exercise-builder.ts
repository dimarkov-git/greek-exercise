import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const exerciseBuilderTranslations = createTranslationDictionary([
	'exerciseBuilder',
	'exerciseBuilderDesc',
	'ui.toolsEmoji',
	'comingSoon',
	'ui.backToHome'
] as const)

export type ExerciseBuilderTranslationKey = DictionaryKeys<
	typeof exerciseBuilderTranslations
>
