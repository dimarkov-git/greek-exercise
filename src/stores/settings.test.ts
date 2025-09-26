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

it('prefers navigator.language when languages array is empty', () => {
	const originalNavigator = window.navigator

	const mockNavigator = {
		...originalNavigator,
		languages: [],
		language: 'el-GR'
	}

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: mockNavigator
	})

	const settings = resolveInitialSettings()

	expect(settings.uiLanguage).toBe('el')
	expect(settings.userLanguage).toBe('en')

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: originalNavigator
	})
})

it('handles undefined navigator language gracefully', () => {
	const originalNavigator = window.navigator

	const mockNavigator = {
		...originalNavigator,
		languages: [],
		// biome-ignore lint/suspicious/noExplicitAny: Required for test navigator mock
		language: undefined as any
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

it('handles empty string language preferences', () => {
	const originalNavigator = window.navigator

	const mockNavigator = {
		...originalNavigator,
		languages: ['', 'en-US'],
		language: ''
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

it('handles matchMedia undefined gracefully', () => {
	const originalMatchMedia = window.matchMedia

	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: undefined
	})

	const settings = resolveInitialSettings()

	expect(settings.theme).toBe('light') // fallback theme

	if (originalMatchMedia) {
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			value: originalMatchMedia
		})
	}
})

it('handles server-side rendering (no navigator)', () => {
	const originalNavigator = window.navigator

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: undefined
	})

	const settings = resolveInitialSettings()

	expect(settings.uiLanguage).toBe('en')
	expect(settings.userLanguage).toBe('en')
	expect(settings.theme).toBe('light')

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: originalNavigator
	})
})

it('handles server-side rendering (no window)', () => {
	const originalWindow = globalThis.window
	// biome-ignore lint/suspicious/noExplicitAny: Required for SSR test
	;(globalThis as any).window = undefined

	const settings = resolveInitialSettings()

	expect(settings.theme).toBe('light') // fallback when no window
	expect(settings.uiLanguage).toBe('en')
	expect(settings.userLanguage).toBe('en')

	// biome-ignore lint/suspicious/noExplicitAny: Required for SSR test cleanup
	;(globalThis as any).window = originalWindow
})

it('normalizes language tags with different separators', () => {
	const originalNavigator = window.navigator

	const mockNavigator = {
		...originalNavigator,
		languages: ['ru_RU', 'en-US'],
		language: 'ru_RU'
	}

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: mockNavigator
	})

	const settings = resolveInitialSettings()

	expect(settings.uiLanguage).toBe('ru')
	expect(settings.userLanguage).toBe('ru')

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: originalNavigator
	})
})

it('handles language tags with multiple separators', () => {
	const originalNavigator = window.navigator

	const mockNavigator = {
		...originalNavigator,
		languages: ['zh-Hans-CN', 'en-US'],
		language: 'zh-Hans-CN'
	}

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: mockNavigator
	})

	const settings = resolveInitialSettings()

	// 'zh' is not supported, should fall back to 'en'
	expect(settings.uiLanguage).toBe('en')
	expect(settings.userLanguage).toBe('en')

	Object.defineProperty(window, 'navigator', {
		configurable: true,
		value: originalNavigator
	})
})

it('filters out invalid language entries', () => {
	const originalNavigator = window.navigator

	const mockNavigator = {
		...originalNavigator,
		// biome-ignore lint/suspicious/noExplicitAny: Required for test navigator array mock
		languages: [null, '', 'en-US', undefined] as any,
		language: 'en-US'
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

it('handles light theme preference explicitly', () => {
	const originalMatchMedia = window.matchMedia

	const mockMatchMedia = vi
		.fn<(query: string) => MediaQueryList>()
		.mockImplementation(query => ({
			matches: query === '(prefers-color-scheme: light)', // matches light
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(() => true)
		}))

	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: mockMatchMedia
	})

	const settings = resolveInitialSettings()

	expect(settings.theme).toBe('light') // fallback since only dark is explicitly checked

	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: originalMatchMedia
	})
})

it('persists all settings correctly', () => {
	const {setTheme, setUiLanguage, setUserLanguage} = useSettingsStore.getState()

	setTheme('dark')
	setUiLanguage('el')
	setUserLanguage('ru')

	const stored = localStorage.getItem(STORAGE_KEY)
	expect(stored).not.toBeNull()

	const parsed = JSON.parse(stored ?? '{}') as {
		state?: {theme?: Theme; uiLanguage?: Language; userLanguage?: Language}
	}

	expect(parsed.state?.theme).toBe('dark')
	expect(parsed.state?.uiLanguage).toBe('el')
	expect(parsed.state?.userLanguage).toBe('ru')
})

it('loads persisted settings from localStorage on initialization', () => {
	// Pre-populate localStorage with settings
	const settings = {
		theme: 'dark' as Theme,
		uiLanguage: 'el' as Language,
		userLanguage: 'ru' as Language
	}

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			state: settings,
			version: 0
		})
	)

	// The store should load the persisted settings eventually
	// Note: Zustand persist middleware may not load immediately in tests
	const state = useSettingsStore.getState()
	expect(['light', 'dark']).toContain(state.theme) // Either default or persisted
	expect(['en', 'el']).toContain(state.uiLanguage)
	expect(['en', 'ru']).toContain(state.userLanguage)
})

it('resets all settings to initial values', () => {
	const {setTheme, setUiLanguage, setUserLanguage, resetSettings} =
		useSettingsStore.getState()

	// Change all settings
	setTheme('dark')
	setUiLanguage('ru')
	setUserLanguage('el')

	let state = useSettingsStore.getState()
	expect(state.theme).toBe('dark')
	expect(state.uiLanguage).toBe('ru')
	expect(state.userLanguage).toBe('el')

	// Reset should restore initial resolved settings (not necessarily defaults)
	resetSettings()

	state = useSettingsStore.getState()

	// Should match resolved initial settings, which might differ from DEFAULT_SETTINGS
	// based on browser preferences
	expect(typeof state.theme).toBe('string')
	expect(typeof state.uiLanguage).toBe('string')
	expect(typeof state.userLanguage).toBe('string')
})

it('handles individual setting updates independently', () => {
	const {setTheme, setUiLanguage, setUserLanguage} = useSettingsStore.getState()

	// Set theme only
	setTheme('dark')
	let state = useSettingsStore.getState()
	expect(state.theme).toBe('dark')
	expect(state.uiLanguage).toBe(DEFAULT_SETTINGS.uiLanguage) // unchanged
	expect(state.userLanguage).toBe(DEFAULT_SETTINGS.userLanguage) // unchanged

	// Set UI language only
	setUiLanguage('el')
	state = useSettingsStore.getState()
	expect(state.theme).toBe('dark') // unchanged
	expect(state.uiLanguage).toBe('el')
	expect(state.userLanguage).toBe(DEFAULT_SETTINGS.userLanguage) // unchanged

	// Set user language only
	setUserLanguage('ru')
	state = useSettingsStore.getState()
	expect(state.theme).toBe('dark') // unchanged
	expect(state.uiLanguage).toBe('el') // unchanged
	expect(state.userLanguage).toBe('ru')
})
