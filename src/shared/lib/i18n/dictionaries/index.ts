import {exerciseUiTranslations as exerciseUiTranslationsImpl} from './exercise'
import {exerciseBuilderTranslations as exerciseBuilderTranslationsImpl} from './exercise-builder'
import {exerciseLibraryTranslations as exerciseLibraryTranslationsImpl} from './exercise-library'
import {homePageTranslations as homePageTranslationsImpl} from './home'
import {
	languageSelectorTranslations as languageSelectorTranslationsImpl,
	userLanguageSelectorTranslations as userLanguageSelectorTranslationsImpl
} from './language'
import {settingsLabelTranslations as settingsLabelTranslationsImpl} from './layout'
import {learnPageTranslations as learnPageTranslationsImpl} from './learn-page'
import {
	jsonViewTranslations as jsonViewTranslationsImpl,
	tableViewTranslations as tableViewTranslationsImpl,
	viewToggleTranslations as viewToggleTranslationsImpl
} from './learn-ui'
import {testShowcaseTranslations as testShowcaseTranslationsImpl} from './test-showcase'
import {themeToggleTranslations as themeToggleTranslationsImpl} from './theme'

export const exerciseBuilderTranslations = exerciseBuilderTranslationsImpl
export const exerciseLibraryTranslations = exerciseLibraryTranslationsImpl
export const exerciseUiTranslations = exerciseUiTranslationsImpl
export const homePageTranslations = homePageTranslationsImpl
export const jsonViewTranslations = jsonViewTranslationsImpl
export const languageSelectorTranslations = languageSelectorTranslationsImpl
export const learnPageTranslations = learnPageTranslationsImpl
export const settingsLabelTranslations = settingsLabelTranslationsImpl
export const tableViewTranslations = tableViewTranslationsImpl
export const themeToggleTranslations = themeToggleTranslationsImpl
export const userLanguageSelectorTranslations =
	userLanguageSelectorTranslationsImpl
export const viewToggleTranslations = viewToggleTranslationsImpl
export const testShowcaseTranslations = testShowcaseTranslationsImpl

export type ExerciseBuilderTranslationKey =
	import('./exercise-builder').ExerciseBuilderTranslationKey
export type ExerciseLibraryTranslationKey =
	import('./exercise-library').ExerciseLibraryTranslationKey
export type ExerciseUiTranslationKey =
	import('./exercise').ExerciseUiTranslationKey
export type HomePageTranslationKey = import('./home').HomePageTranslationKey
export type JsonViewTranslationKey = import('./learn-ui').JsonViewTranslationKey
export type LanguageSelectorTranslationKey =
	import('./language').LanguageSelectorTranslationKey
export type LearnPageTranslationKey =
	import('./learn-page').LearnPageTranslationKey
export type SettingsLabelTranslationKey =
	import('./layout').SettingsLabelTranslationKey
export type TableViewTranslationKey =
	import('./learn-ui').TableViewTranslationKey
export type ThemeToggleTranslationKey =
	import('./theme').ThemeToggleTranslationKey
export type UserLanguageSelectorTranslationKey =
	import('./language').UserLanguageSelectorTranslationKey
export type ViewToggleTranslationKey =
	import('./learn-ui').ViewToggleTranslationKey
export type TestShowcaseTranslationKey =
	import('./test-showcase').TestShowcaseTranslationKey
