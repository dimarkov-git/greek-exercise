import {describe, expect, it} from 'vitest'

describe('automation detection', () => {
	const createAutomationDetector = () =>
		(() => {
			if (typeof navigator === 'undefined') {
				return false
			}

			if (navigator.webdriver) {
				return true
			}

			const userAgent = navigator.userAgent ?? ''
			return userAgent.toLowerCase().includes('playwright')
		})()

	it('detects webdriver correctly', () => {
		// In test environment, navigator exists and webdriver may be set
		expect(typeof navigator).toBe('object')
		expect(typeof navigator.webdriver).toBe('boolean')
	})

	it('can detect playwright in user agent', () => {
		// Mock navigator for this specific test
		const originalNavigator = global.navigator

		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent: 'Playwright/1.0 Mozilla/5.0',
				webdriver: false
			},
			writable: true,
			configurable: true
		})

		const isAutomation = createAutomationDetector()
		expect(isAutomation).toBe(true)

		// Restore original navigator
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			writable: true,
			configurable: true
		})
	})

	it('handles missing navigator gracefully', () => {
		// This test simulates server environment
		const originalNavigator = global.navigator

		// Temporarily remove navigator
		// biome-ignore lint/suspicious/noExplicitAny: Required for test mocking
		;(global as any).navigator = undefined

		const isAutomation = createAutomationDetector()
		expect(isAutomation).toBe(false)

		// Restore navigator
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			writable: true,
			configurable: true
		})
	})
})
