import {afterEach, beforeEach, expect, it, vi} from 'vitest'
import {resolveInitialSettings, useSettingsStore} from '@/stores/settings'
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

it('resolves initial settings from browser preferences when available', () => {
	const originalNavigator = window.navigator
	const originalMatchMedia = window.matchMedia

	const mockNavigator = {
		...originalNavigator,
		languages: ['ru-RU', 'en-US'],
		language: 'ru-RU'
	}

	const mockMatchMedia = vi
		.fn<(query: string) => MediaQueryList>()
		.mockImplementation(query => ({
			matches: query === '(prefers-color-scheme: dark)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(() => true)
		}))

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: mockNavigator
	})

	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: mockMatchMedia
	})

	const settings = resolveInitialSettings()

	expect(settings.theme).toBe('dark')
	expect(settings.uiLanguage).toBe('ru')
	expect(settings.userLanguage).toBe('ru')

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: originalNavigator
	})

	if (originalMatchMedia) {
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			value: originalMatchMedia
		})
	} else {
		Reflect.deleteProperty(window, 'matchMedia')
	}
})

it('falls back to English when browser languages are unsupported', () => {
	const originalNavigator = window.navigator

	const mockNavigator = {
		...originalNavigator,
		languages: ['de-DE', 'fr-FR'],
		language: 'de-DE'
	}

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: mockNavigator
	})

	const settings = resolveInitialSettings()

	expect(settings.uiLanguage).toBe('en')
	expect(settings.userLanguage).toBe('en')

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: originalNavigator
	})
})
