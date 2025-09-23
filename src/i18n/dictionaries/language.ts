import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const languageSelectorTranslations = createTranslationDictionary([
	'interfaceLanguage'
] as const)

export type LanguageSelectorTranslationKey = DictionaryKeys<
	typeof languageSelectorTranslations
>

export const userLanguageSelectorTranslations = createTranslationDictionary([
	'userLanguageLabel'
] as const)

export type UserLanguageSelectorTranslationKey = DictionaryKeys<
	typeof userLanguageSelectorTranslations
>

export const languageDropdownTranslations = createTranslationDictionary([
	'header.selectLanguage',
	'ui.dropdownArrow',
	'ui.selectedLanguage'
] as const)

export type LanguageDropdownTranslationKey = DictionaryKeys<
	typeof languageDropdownTranslations
>
