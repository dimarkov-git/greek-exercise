export type Language = 'el' | 'ru' | 'en'

export type Theme = 'light' | 'dark'

export interface AppSettings {
	uiLanguage: Language
	userLanguage: Language
	theme: Theme
}

export interface LanguageOption {
	code: Language
	name: string
	flag: string
}

export const USER_LANGUAGES: LanguageOption[] = [
	{code: 'ru', name: 'Русский', flag: '🇷🇺'},
	{code: 'en', name: 'English', flag: '🇺🇸'}
]

export const UI_LANGUAGES: LanguageOption[] = [
	{code: 'el', name: 'Ελληνικά', flag: '🇬🇷'},
	{code: 'ru', name: 'Русский', flag: '🇷🇺'},
	{code: 'en', name: 'English', flag: '🇺🇸'}
]

export const DEFAULT_SETTINGS: AppSettings = {
	uiLanguage: 'el',
	userLanguage: 'en',
	theme: 'light'
}
