import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const headerNavigationTranslations = createTranslationDictionary([
	'navigation.home',
	'navigation.library',
	'navigation.builder'
] as const)

export type HeaderNavigationTranslationKey = DictionaryKeys<
	typeof headerNavigationTranslations
>

export const mobileMenuTranslations = createTranslationDictionary([
	'navigation.home',
	'navigation.library',
	'navigation.builder',
	'navigation.testSection',
	'settings'
] as const)

export type MobileMenuTranslationKey = DictionaryKeys<
	typeof mobileMenuTranslations
>

export const mobileMenuButtonTranslations = createTranslationDictionary([
	'navigation.menu',
	'navigation.close'
] as const)

export type MobileMenuButtonTranslationKey = DictionaryKeys<
	typeof mobileMenuButtonTranslations
>

export const headerLogoTranslations = createTranslationDictionary([
	'app.logoInitials',
	'app.title'
] as const)

export type HeaderLogoTranslationKey = DictionaryKeys<
	typeof headerLogoTranslations
>

export const mainNavigationTranslations = createTranslationDictionary([
	'exerciseLibrary',
	'exerciseLibraryDesc',
	'exerciseBuilder',
	'exerciseBuilderDesc',
	'testSection',
	'testSectionDesc'
] as const)

export type MainNavigationTranslationKey = DictionaryKeys<
	typeof mainNavigationTranslations
>

export const footerTranslations = createTranslationDictionary(
	['footer.copyright', 'footer.madeWith', 'footer.github'] as const,
	{
		fixedLanguageKeys: {
			'footer.madeWith': 'el'
		}
	}
)

export type FooterTranslationKey = DictionaryKeys<typeof footerTranslations>

export const settingsLabelTranslations = createTranslationDictionary([
	'settings'
] as const)

export type SettingsLabelTranslationKey = DictionaryKeys<
	typeof settingsLabelTranslations
>
