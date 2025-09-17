import {vi} from 'vitest'
import {useSettingsStore} from './settings'

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {}

	return {
		getItem: (key: string): string | null => store[key] || null,
		setItem: (key: string, value: string): void => {
			store[key] = value
		},
		removeItem: (key: string): void => {
			delete store[key]
		},
		clear: (): void => {
			store = {}
		}
	}
})()

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
})

// Mock document.documentElement.setAttribute
const mockSetAttribute = vi.fn()
Object.defineProperty(document.documentElement, 'setAttribute', {
	value: mockSetAttribute
})

describe('Settings Store', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		localStorageMock.clear()
		// Reset store state
		useSettingsStore.getState().setTheme('light')
		useSettingsStore.getState().setUiLanguage('el')
		useSettingsStore.getState().setUserLanguage('el')
	})

	describe('language functionality', () => {
		it('should have default Greek UI language', () => {
			const state = useSettingsStore.getState()
			expect(state.uiLanguage).toBe('el')
		})

		it('should have default Greek user language', () => {
			const state = useSettingsStore.getState()
			expect(state.userLanguage).toBe('el')
		})

		it('should update UI language', () => {
			const state = useSettingsStore.getState()

			state.setUiLanguage('en')

			expect(useSettingsStore.getState().uiLanguage).toBe('en')
		})

		it('should update user language', () => {
			const state = useSettingsStore.getState()

			state.setUserLanguage('ru')

			expect(useSettingsStore.getState().userLanguage).toBe('ru')
		})
	})
})
