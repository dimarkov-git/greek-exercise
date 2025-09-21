import {act} from '@testing-library/react'
import {renderHook} from '@tests/utils'
import {describe, expect, it} from 'vitest'
import {DEFAULT_SETTINGS} from '@/types/settings'
import {useSettingsStore} from './settings'

describe('useSettingsStore', () => {
	it('exposes the default settings', () => {
		act(() => {
			useSettingsStore.getState().resetSettings()
		})

		const {result} = renderHook(() => useSettingsStore())

		expect(result.current.theme).toBe(DEFAULT_SETTINGS.theme)
		expect(result.current.uiLanguage).toBe(DEFAULT_SETTINGS.uiLanguage)
		expect(result.current.userLanguage).toBe(DEFAULT_SETTINGS.userLanguage)
	})

	it('updates theme and syncs document attribute', () => {
		const {result} = renderHook(() => useSettingsStore())

		act(() => {
			result.current.setTheme('dark')
		})

		expect(result.current.theme).toBe('dark')
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

		act(() => {
			result.current.setTheme('light')
		})

		expect(result.current.theme).toBe('light')
		expect(document.documentElement.getAttribute('data-theme')).toBe('light')
	})

	it('updates languages independently', () => {
		const {result} = renderHook(() => useSettingsStore())

		act(() => {
			result.current.setUiLanguage('en')
			result.current.setUserLanguage('ru')
		})

		expect(result.current.uiLanguage).toBe('en')
		expect(result.current.userLanguage).toBe('ru')
	})

	it('resets to defaults', () => {
		const {result} = renderHook(() => useSettingsStore())

		act(() => {
			result.current.setUiLanguage('en')
			result.current.setTheme('dark')
			result.current.resetSettings()
		})

		expect(result.current.theme).toBe(DEFAULT_SETTINGS.theme)
		expect(result.current.uiLanguage).toBe(DEFAULT_SETTINGS.uiLanguage)
		expect(result.current.userLanguage).toBe(DEFAULT_SETTINGS.userLanguage)
	})
})
