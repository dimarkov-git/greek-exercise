import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const themeToggleTranslations = createTranslationDictionary([
	'lightTheme',
	'darkTheme',
	'ui.sunEmoji',
	'ui.moonEmoji'
] as const)

export type ThemeToggleTranslationKey = DictionaryKeys<
	typeof themeToggleTranslations
>
