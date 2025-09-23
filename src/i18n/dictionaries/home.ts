import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const homePageTranslations = createTranslationDictionary([
	'app.title',
	'app.subtitle'
] as const)

export type HomePageTranslationKey = DictionaryKeys<typeof homePageTranslations>
