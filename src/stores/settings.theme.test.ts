import {vi} from 'vitest'
import {useSettingsStore} from './settings'

// Mock document.documentElement.setAttribute
const mockSetAttribute = vi.fn()
Object.defineProperty(document.documentElement, 'setAttribute', {
	value: mockSetAttribute
})

describe('Settings Store - Theme', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		useSettingsStore.getState().setTheme('light')
	})

	it('should have default light theme', () => {
		const state = useSettingsStore.getState()
		expect(state.theme).toBe('light')
	})

	it('should update theme and set data-theme attribute', () => {
		const state = useSettingsStore.getState()

		state.setTheme('dark')

		expect(useSettingsStore.getState().theme).toBe('dark')
		expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')
	})

	it('should set data-theme attribute on document element when theme changes', () => {
		const state = useSettingsStore.getState()

		// Clear any previous calls
		vi.clearAllMocks()

		// Test setting to dark
		state.setTheme('dark')
		expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')

		// Test setting back to light
		state.setTheme('light')
		expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'light')

		// Verify setAttribute was called twice
		expect(mockSetAttribute).toHaveBeenCalledTimes(2)
	})

	it('should toggle between light and dark themes', () => {
		const state = useSettingsStore.getState()

		// Start with light
		expect(state.theme).toBe('light')

		// Switch to dark
		state.setTheme('dark')
		expect(useSettingsStore.getState().theme).toBe('dark')
		expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark')

		// Switch back to light
		state.setTheme('light')
		expect(useSettingsStore.getState().theme).toBe('light')
		expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'light')
	})
})
