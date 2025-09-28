import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {
	type AppSettings,
	DEFAULT_SETTINGS,
	type Language,
	type Theme,
	UI_LANGUAGES,
	USER_LANGUAGES
} from '@/shared/model/settings'

type SupportedLanguages = readonly Language[]

const UI_LANGUAGE_CODES: SupportedLanguages = UI_LANGUAGES.map(
	language => language.code
)
const USER_LANGUAGE_CODES: SupportedLanguages = USER_LANGUAGES.map(
	language => language.code
)
const LANGUAGE_TAG_SEPARATOR = /[-_]/

function getNavigatorLanguagePreferences(): readonly string[] {
	if (typeof navigator === 'undefined') {
		return []
	}

	const languages = (navigator.languages ?? []).filter(
		(language): language is string =>
			typeof language === 'string' && language.length > 0
	)
	if (languages.length > 0) {
		return languages
	}

	if (typeof navigator.language === 'string' && navigator.language.length > 0) {
		return [navigator.language]
	}

	return []
}

function normaliseLanguageTag(tag: string | undefined): string | null {
	if (!tag) {
		return null
	}

	const lowerCased = tag.toLowerCase()
	if (lowerCased.length === 0) {
		return null
	}

	const [base] = lowerCased.split(LANGUAGE_TAG_SEPARATOR)
	return base ?? null
}

function resolveLanguagePreference(
	supportedLanguages: SupportedLanguages,
	fallback: Language
): Language {
	const preferences = getNavigatorLanguagePreferences()

	for (const preference of preferences) {
		const normalised = normaliseLanguageTag(preference)
		if (!normalised) {
			continue
		}

		if (supportedLanguages.includes(normalised as Language)) {
			return normalised as Language
		}
	}

	return fallback
}

function resolveThemePreference(fallback: Theme): Theme {
	if (
		typeof window === 'undefined' ||
		typeof window.matchMedia !== 'function'
	) {
		return fallback
	}

	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark'
	}

	return fallback
}

export function resolveInitialSettings(): AppSettings {
	return {
		theme: resolveThemePreference(DEFAULT_SETTINGS.theme),
		uiLanguage: resolveLanguagePreference(
			UI_LANGUAGE_CODES,
			DEFAULT_SETTINGS.uiLanguage
		),
		userLanguage: resolveLanguagePreference(
			USER_LANGUAGE_CODES,
			DEFAULT_SETTINGS.userLanguage
		)
	}
}

const INITIAL_SETTINGS = resolveInitialSettings()

interface SettingsStore extends AppSettings {
	readonly setUiLanguage: (language: Language) => void
	readonly setUserLanguage: (language: Language) => void
	readonly setTheme: (theme: Theme) => void
	readonly resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		set => ({
			...INITIAL_SETTINGS,
			setUiLanguage: (uiLanguage: Language) => set({uiLanguage}),
			setUserLanguage: (userLanguage: Language) => set({userLanguage}),
			setTheme: (theme: Theme) => set({theme}),
			resetSettings: () => set(() => resolveInitialSettings())
		}),
		{
			name: 'greek-exercise-settings'
		}
	)
)
