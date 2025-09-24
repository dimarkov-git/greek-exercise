import {afterEach, beforeEach, expect, it} from 'vitest'
import {useSettingsStore} from '@/stores/settings'
import {DEFAULT_SETTINGS, type Language, type Theme} from '@/types/settings'

const STORAGE_KEY = 'greek-exercise-settings'

beforeEach(() => {
	localStorage.clear()
	useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
})

afterEach(() => {
	localStorage.clear()
	useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
})

it('initialises with default settings', () => {
	const state = useSettingsStore.getState()
	expect(state).toMatchObject(DEFAULT_SETTINGS)
})

it('updates and persists UI language changes', () => {
	const {setUiLanguage} = useSettingsStore.getState()
	const nextLanguage: Language = 'ru'

	setUiLanguage(nextLanguage)

	const updatedState = useSettingsStore.getState()
	expect(updatedState.uiLanguage).toBe(nextLanguage)

	const stored = localStorage.getItem(STORAGE_KEY)
	expect(stored).not.toBeNull()

	const parsed = JSON.parse(stored ?? '{}') as {
		state?: {uiLanguage?: Language}
	}
	expect(parsed.state?.uiLanguage).toBe(nextLanguage)
})

it('updates theme and user language together then resets to defaults', () => {
	const {setTheme, setUserLanguage, resetSettings} = useSettingsStore.getState()

	const nextTheme: Theme = 'dark'
	const nextUserLanguage: Language = 'ru'

	setTheme(nextTheme)
	setUserLanguage(nextUserLanguage)

	let state = useSettingsStore.getState()
	expect(state.theme).toBe(nextTheme)
	expect(state.userLanguage).toBe(nextUserLanguage)

	resetSettings()

	state = useSettingsStore.getState()
	expect(state).toMatchObject(DEFAULT_SETTINGS)

	const stored = localStorage.getItem(STORAGE_KEY)
	expect(stored).not.toBeNull()

	const parsed = JSON.parse(stored ?? '{}') as {
		state?: {theme?: Theme; userLanguage?: Language}
	}

	expect(parsed.state?.theme).toBe(DEFAULT_SETTINGS.theme)
	expect(parsed.state?.userLanguage).toBe(DEFAULT_SETTINGS.userLanguage)
})
