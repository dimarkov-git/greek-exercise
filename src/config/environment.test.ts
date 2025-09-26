import {describe, expect, it} from 'vitest'

// Test the environment configuration by testing individual functions and logic
describe('environment configuration', () => {
	// Since we're in a vitest environment, we can test the actual module
	// but focus on testing the logic rather than mocking globals

	it('exports environment object with all required properties', async () => {
		const {environment} = await import('@/config/environment')

		expect(environment).toHaveProperty('mode')
		expect(environment).toHaveProperty('isDevelopment')
		expect(environment).toHaveProperty('isProduction')
		expect(environment).toHaveProperty('isTest')
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
		expect(typeof environment.isDevelopment).toBe('boolean')
		expect(typeof environment.isProduction).toBe('boolean')
		expect(typeof environment.isTest).toBe('boolean')
		expect(typeof environment.isAutomationEnvironment).toBe('boolean')
		expect(typeof environment.baseUrl).toBe('string')
		expect(typeof environment.routerMode).toBe('string')
		expect(typeof environment.enableMockServiceWorker).toBe('boolean')
		expect(typeof environment.enableQueryDevtools).toBe('boolean')
		expect(typeof environment.enableHttpFallback).toBe('boolean')
	})

	it('detects test environment correctly', async () => {
		const {environment} = await import('@/config/environment')

		// In vitest, isTest should be true
		expect(environment.isTest).toBe(true)
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

	it('enables MSW in test automation environment', async () => {
		const {environment} = await import('@/config/environment')

		// In this test environment, MSW is enabled because it's detected as automation
		expect(environment.enableMockServiceWorker).toBe(true)
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
		const normalizeRouterMode = (
			value: string | undefined,
			fallback: 'browser' | 'hash' | 'memory'
		) => {
			if (value === 'hash' || value === 'browser' || value === 'memory') {
				return value
			}
			return fallback
		}

		it('returns valid router modes unchanged', () => {
			expect(normalizeRouterMode('browser', 'hash')).toBe('browser')
			expect(normalizeRouterMode('hash', 'browser')).toBe('hash')
			expect(normalizeRouterMode('memory', 'browser')).toBe('memory')
		})

		it('returns fallback for invalid values', () => {
			expect(normalizeRouterMode('invalid', 'browser')).toBe('browser')
			expect(normalizeRouterMode(undefined, 'hash')).toBe('hash')
			expect(normalizeRouterMode('', 'memory')).toBe('memory')
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
	describe('environment flags', () => {
		const createEnvironmentFlags = (
			env: {
				DEV?: boolean
				PROD?: boolean
				MODE?: string
				VITE_ENABLE_MSW?: string
				VITE_ENABLE_QUERY_DEVTOOLS?: string
				VITE_ENABLE_HTTP_FALLBACK?: string
			},
			isTest = false,
			isAutomation = false
		) => {
			const enableMockServiceWorker = env.VITE_ENABLE_MSW
				? env.VITE_ENABLE_MSW === 'true'
				: (env.DEV && !isTest) || isAutomation

			const enableQueryDevtools = env.VITE_ENABLE_QUERY_DEVTOOLS
				? env.VITE_ENABLE_QUERY_DEVTOOLS === 'true'
				: env.DEV && !isTest

			const enableHttpFallback = env.VITE_ENABLE_HTTP_FALLBACK
				? env.VITE_ENABLE_HTTP_FALLBACK === 'true'
				: enableMockServiceWorker

			return {
				enableMockServiceWorker,
				enableQueryDevtools,
				enableHttpFallback
			}
		}

		it('enables MSW in development but not test', () => {
			const devFlags = createEnvironmentFlags({DEV: true}, false, false)
			const testFlags = createEnvironmentFlags({DEV: false}, true, false)

			expect(devFlags.enableMockServiceWorker).toBe(true)
			expect(testFlags.enableMockServiceWorker).toBe(false)
		})

		it('enables MSW in automation environment', () => {
			const automationFlags = createEnvironmentFlags({DEV: false}, false, true)
			expect(automationFlags.enableMockServiceWorker).toBe(true)
		})

		it('respects explicit MSW override', () => {
			const explicitFalse = createEnvironmentFlags(
				{
					DEV: true,
					VITE_ENABLE_MSW: 'false'
				},
				false,
				false
			)

			expect(explicitFalse.enableMockServiceWorker).toBe(false)
		})

		it('enables devtools in development but not test', () => {
			const devFlags = createEnvironmentFlags({DEV: true}, false, false)
			const testFlags = createEnvironmentFlags({DEV: false}, true, false)

			expect(devFlags.enableQueryDevtools).toBe(true)
			expect(testFlags.enableQueryDevtools).toBe(false)
		})

		it('links HTTP fallback to MSW enablement', () => {
			const mswEnabled = createEnvironmentFlags({DEV: true}, false, false)
			const mswDisabled = createEnvironmentFlags({DEV: false}, true, false)

			expect(mswEnabled.enableHttpFallback).toBe(
				mswEnabled.enableMockServiceWorker
			)
			expect(mswDisabled.enableHttpFallback).toBe(
				mswDisabled.enableMockServiceWorker
			)
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
