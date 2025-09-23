import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {AppSettings, Language, Theme} from '@/types/settings'
import {DEFAULT_SETTINGS} from '@/types/settings'

interface SettingsStore extends AppSettings {
	readonly setUiLanguage: (language: Language) => void
	readonly setUserLanguage: (language: Language) => void
	readonly setTheme: (theme: Theme) => void
	readonly resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		set => ({
			...DEFAULT_SETTINGS,
			setUiLanguage: (uiLanguage: Language) => set({uiLanguage}),
			setUserLanguage: (userLanguage: Language) => set({userLanguage}),
			setTheme: (theme: Theme) => set({theme}),
			resetSettings: () => set(() => ({...DEFAULT_SETTINGS}))
		}),
		{
			name: 'greek-exercise-settings'
		}
	)
)
