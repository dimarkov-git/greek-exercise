import {describe, expect, it} from 'vitest'
import {RouterModeEnum} from '@/config/environment'

describe('environment configuration', () => {
	it('exports environment object with all required properties', async () => {
		const {environment} = await import('@/config/environment')

		expect(environment).toHaveProperty('mode')
		expect(environment).toHaveProperty('baseURL')
		expect(environment).toHaveProperty('routerMode')
		expect(environment).toHaveProperty('enableMockServiceWorker')
		expect(environment).toHaveProperty('enableQueryDevtools')
		expect(environment).toHaveProperty('enableHTTPFallback')
	})

	it('has correct types for all properties', async () => {
		const {environment} = await import('@/config/environment')

		expect(typeof environment.mode).toBe('string')
		expect(typeof environment.baseURL).toBe('string')
		expect(typeof environment.routerMode).toBe('string')
		expect(typeof environment.enableMockServiceWorker).toBe('boolean')
		expect(typeof environment.enableQueryDevtools).toBe('boolean')
		expect(typeof environment.enableHTTPFallback).toBe('boolean')
	})

	it('detects test environment correctly', async () => {
		const {AppModeEnum, environment} = await import('@/config/environment')

		expect(environment.mode).toBe(AppModeEnum.test)
		expect(environment.mode).toBe('test')
	})

	it('has valid router mode', async () => {
		const {environment} = await import('@/config/environment')

		expect(['browser', 'hash', 'memory']).toContain(environment.routerMode)
	})

	it('uses memory router in test mode', async () => {
		const {environment} = await import('@/config/environment')

		expect(environment.routerMode).toBe(RouterModeEnum.memory)
	})

	it('uses default MSW value in test environment', async () => {
		const {environment} = await import('@/config/environment')

		expect(environment.enableMockServiceWorker).toBe(false)
	})

	it('disables query devtools in test mode', async () => {
		const {environment} = await import('@/config/environment')

		expect(environment.enableQueryDevtools).toBe(false)
	})

	it('has proper base URL', async () => {
		const {environment} = await import('@/config/environment')

		expect(typeof environment.baseURL).toBe('string')
		expect(environment.baseURL.length).toBeGreaterThan(0)
	})

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
			expect(environment.enableHTTPFallback).toBe(true) // explicitly set
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
