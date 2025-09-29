import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const settingsLabelTranslations = createTranslationDictionary([
	'settings'
] as const)

export type SettingsLabelTranslationKey = DictionaryKeys<
	typeof settingsLabelTranslations
>
