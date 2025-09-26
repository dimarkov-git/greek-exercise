import {act, renderHook} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {
	setDocumentLanguage,
	setDocumentTheme,
	useSettingsSync
} from '@/hooks/useSettingsSync'
import {useSettingsStore} from '@/stores/settings'
import {DEFAULT_SETTINGS} from '@/types/settings'

describe('useSettingsSync', () => {
	beforeEach(() => {
		document.documentElement.removeAttribute('data-theme')
		document.documentElement.lang = 'en'
		useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
	})

	afterEach(() => {
		useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
		localStorage.removeItem('greek-exercise-settings')
	})

	it('applies initial theme and language attributes', () => {
		const {unmount} = renderHook(() => useSettingsSync())

		expect(document.documentElement.getAttribute('data-theme')).toBe('light')
		expect(document.documentElement.lang).toBe('en')

		unmount()
	})

	it('updates attributes when settings change', () => {
		const {unmount} = renderHook(() => useSettingsSync())

		act(() => {
			useSettingsStore.getState().setTheme('dark')
			useSettingsStore.getState().setUiLanguage('ru')
		})

		expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
		expect(document.documentElement.lang).toBe('ru')

		unmount()
	})

	it('does not throw when document is undefined', () => {
		const originalDocument = globalThis.document

		Object.defineProperty(globalThis, 'document', {
			configurable: true,
			value: undefined
		})

		expect(() => setDocumentTheme('dark')).not.toThrow()
		expect(() => setDocumentLanguage('ru')).not.toThrow()

		Object.defineProperty(globalThis, 'document', {
			configurable: true,
			value: originalDocument
		})
	})
})
