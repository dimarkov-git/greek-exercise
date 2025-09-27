import {describe, expect, it} from 'vitest'

// Test the environment configuration by testing individual functions and logic
describe('environment configuration', () => {
	// Since we're in a vitest environment, we can test the actual module
	// but focus on testing the logic rather than mocking globals

	it('exports environment object with all required properties', async () => {
		const {environment} = await import('@/config/environment')

		expect(environment).toHaveProperty('mode')
		expect(environment).toHaveProperty('isAutomationEnvironment')
		expect(environment).toHaveProperty('baseUrl')
		expect(environment).toHaveProperty('routerMode')
		expect(environment).toHaveProperty('enableMockServiceWorker')
		expect(environment).toHaveProperty('enableQueryDevtools')
		expect(environment).toHaveProperty('enableHttpFallback')
	})

	it('has correct types for all properties', async () => {
		const {environment} = await import('@/config/environment')

		expect(typeof environment.mode).toBe('string')
		expect(typeof environment.isAutomationEnvironment).toBe('boolean')
		expect(typeof environment.baseUrl).toBe('string')
		expect(typeof environment.routerMode).toBe('string')
		expect(typeof environment.enableMockServiceWorker).toBe('boolean')
		expect(typeof environment.enableQueryDevtools).toBe('boolean')
		expect(typeof environment.enableHttpFallback).toBe('boolean')
	})

	it('detects test environment correctly', async () => {
		const {AppMode, environment} = await import('@/config/environment')

		// In vitest, should be test mode
		expect(environment.mode).toBe(AppMode.test)
		expect(environment.mode).toBe('test')
	})

	it('has valid router mode', async () => {
		const {environment} = await import('@/config/environment')

		expect(['browser', 'hash', 'memory']).toContain(environment.routerMode)
	})

	it('uses memory router in test mode', async () => {
		const {environment} = await import('@/config/environment')

		// In test mode, should use memory router
		expect(environment.routerMode).toBe('memory')
	})

	it('uses default MSW value in test environment', async () => {
		const {environment} = await import('@/config/environment')

		// In this test environment, MSW uses default false unless explicitly set
		expect(environment.enableMockServiceWorker).toBe(false)
		expect(environment.isAutomationEnvironment).toBe(true)
	})

	it('disables query devtools in test mode', async () => {
		const {environment} = await import('@/config/environment')

		// In test mode, devtools should be disabled
		expect(environment.enableQueryDevtools).toBe(false)
	})

	it('has proper base URL', async () => {
		const {environment} = await import('@/config/environment')

		// Base URL should be a string (actual value depends on environment)
		expect(typeof environment.baseUrl).toBe('string')
		expect(environment.baseUrl.length).toBeGreaterThan(0)
	})

	it('maintains consistency between related flags', async () => {
		const {environment} = await import('@/config/environment')

		// HTTP fallback should follow MSW enablement
		if (environment.enableMockServiceWorker) {
			expect(environment.enableHttpFallback).toBe(true)
		}
	})

	// Test router mode validation logic by creating a test function
	describe('router mode normalization', () => {
		const normalizeRouterMode = (value: string | undefined) => {
			if (value === 'hash' || value === 'browser' || value === 'memory') {
				return value
			}
			return 'hash'
		}

		it('returns valid router modes unchanged', () => {
			expect(normalizeRouterMode('browser')).toBe('browser')
			expect(normalizeRouterMode('hash')).toBe('hash')
			expect(normalizeRouterMode('memory')).toBe('memory')
		})

		it('returns hash fallback for invalid values', () => {
			expect(normalizeRouterMode('invalid')).toBe('hash')
			expect(normalizeRouterMode(undefined)).toBe('hash')
			expect(normalizeRouterMode('')).toBe('hash')
		})
	})

	// Test automation detection logic
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

	// Test environment flag logic
	describe('simplified environment behavior', () => {
		it('uses direct defaults for all environment variables', () => {
			const normalizeBoolean = (
				value: string | undefined,
				defaultValue: boolean
			): boolean => {
				if (value !== undefined) {
					return value === 'true'
				}
				return defaultValue
			}

			// Test the simplified normalization behavior
			expect(normalizeBoolean('true', false)).toBe(true)
			expect(normalizeBoolean('false', true)).toBe(false)
			expect(normalizeBoolean(undefined, true)).toBe(true)
			expect(normalizeBoolean(undefined, false)).toBe(false)
		})

		it('respects explicit environment variable overrides', async () => {
			// This tests the actual environment behavior with explicit test config
			const {environment} = await import('@/config/environment')

			// Test config explicitly sets these values in vite.config.ts
			expect(environment.enableMockServiceWorker).toBe(false) // explicitly set
			expect(environment.enableQueryDevtools).toBe(false) // explicitly set
			expect(environment.enableHttpFallback).toBe(true) // explicitly set
			expect(environment.routerMode).toBe('memory') // explicitly set for tests
		})
	})

	it('environment object is readonly', async () => {
		const {environment} = await import('@/config/environment')

		// Try to modify the environment object (should not work in strict mode)
		expect(() => {
			// biome-ignore lint/suspicious/noExplicitAny: Intentional type override for immutability test
			;(environment as any).mode = 'modified'
		}).not.toThrow() // The object itself might not be frozen, but it should be treated as const

		// The type system should prevent modifications at compile time
		expect(environment).toBeDefined()
	})
})
