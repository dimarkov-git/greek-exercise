import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {AppSettings, Language, Theme} from '@/types/settings'
import {DEFAULT_SETTINGS} from '@/types/settings'

interface SettingsStore extends AppSettings {
	setUiLanguage: (language: Language) => void
	setUserLanguage: (language: Language) => void
	setTheme: (theme: Theme) => void
	resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		set => ({
			...DEFAULT_SETTINGS,

			setUiLanguage: (uiLanguage: Language) => set({uiLanguage}),

			setUserLanguage: (userLanguage: Language) => set({userLanguage}),

			setTheme: (theme: Theme) => {
				set({theme})
				document.documentElement.setAttribute('data-theme', theme)
			},

			resetSettings: () => set(DEFAULT_SETTINGS)
		}),
		{
			name: 'greek-exercise-settings',
			onRehydrateStorage: () => state => {
				if (state?.theme) {
					document.documentElement.setAttribute('data-theme', state.theme)
				}
			}
		}
	)
)
