import {describe, expect, it} from 'vitest'
import {
	AppModeEnum,
	createEnvironment,
	type Environment,
	normalizeBoolean,
	normalizeRouterMode,
	RouterModeEnum
} from '@/app/config/environment'

describe('environment configuration', () => {
	describe('normalizeBoolean', () => {
		it('returns true when value is "true"', () => {
			expect(normalizeBoolean('true', false)).toBe(true)
		})

		it('returns false when value is "false"', () => {
			expect(normalizeBoolean('false', true)).toBe(false)
		})

		it('returns default when value is undefined', () => {
			expect(normalizeBoolean(undefined, true)).toBe(true)
			expect(normalizeBoolean(undefined, false)).toBe(false)
		})

		it('returns false for non-"true" string values', () => {
			expect(normalizeBoolean('1', true)).toBe(false)
			expect(normalizeBoolean('yes', true)).toBe(false)
			expect(normalizeBoolean('', true)).toBe(false)
		})
	})

	describe('normalizeRouterMode', () => {
		it('returns valid router mode when provided', () => {
			expect(normalizeRouterMode('browser', RouterModeEnum.hash)).toBe(
				RouterModeEnum.browser
			)
			expect(normalizeRouterMode('hash', RouterModeEnum.memory)).toBe(
				RouterModeEnum.hash
			)
			expect(normalizeRouterMode('memory', RouterModeEnum.browser)).toBe(
				RouterModeEnum.memory
			)
		})

		it('returns default when value is invalid', () => {
			expect(normalizeRouterMode('invalid', RouterModeEnum.hash)).toBe(
				RouterModeEnum.hash
			)
			expect(normalizeRouterMode('', RouterModeEnum.browser)).toBe(
				RouterModeEnum.browser
			)
		})

		it('returns default when value is undefined', () => {
			expect(normalizeRouterMode(undefined, RouterModeEnum.memory)).toBe(
				RouterModeEnum.memory
			)
		})
	})

	describe('createEnvironment', () => {
		it('creates environment with all defaults', () => {
			const mockEnv = {
				MODE: AppModeEnum.development,
				BASE_URL: '/',
				DEV: true,
				PROD: false,
				SSR: false
			} as ImportMetaEnv

			const env = createEnvironment(mockEnv)

			expect(env).toEqual<Environment>({
				mode: AppModeEnum.development,
				isDevelopment: true,
				baseURL: '/',
				routerMode: RouterModeEnum.hash,
				enableMockServiceWorker: false,
				enableHTTPFallback: true,
				enableQueryDevtools: false
			})
		})

		it('creates environment with custom values', () => {
			const mockEnv = {
				MODE: AppModeEnum.test,
				BASE_URL: '/app/',
				VITE_ROUTER_MODE: RouterModeEnum.memory,
				VITE_ENABLE_MSW: 'true',
				VITE_ENABLE_HTTP_FALLBACK: 'false',
				VITE_ENABLE_QUERY_DEVTOOLS: 'true',
				DEV: false,
				PROD: false,
				SSR: false
			} as ImportMetaEnv

			const env = createEnvironment(mockEnv)

			expect(env).toEqual<Environment>({
				mode: AppModeEnum.test,
				isDevelopment: false,
				baseURL: '/app/',
				routerMode: RouterModeEnum.memory,
				enableMockServiceWorker: true,
				enableHTTPFallback: false,
				enableQueryDevtools: true
			})
		})

		it('uses fallback baseURL when BASE_URL is empty', () => {
			const mockEnv = {
				MODE: AppModeEnum.production,
				BASE_URL: '',
				DEV: false,
				PROD: true,
				SSR: false
			} as ImportMetaEnv

			const env = createEnvironment(mockEnv)

			expect(env.baseURL).toBe('./')
		})

		it('normalizes invalid router mode to default', () => {
			const mockEnv = {
				MODE: AppModeEnum.development,
				BASE_URL: '/',
				// biome-ignore lint/suspicious/noExplicitAny: testing invalid values
				VITE_ROUTER_MODE: 'invalid-mode' as any,
				DEV: true,
				PROD: false,
				SSR: false
			} as ImportMetaEnv

			const env = createEnvironment(mockEnv)

			expect(env.routerMode).toBe(RouterModeEnum.hash)
		})

		it('handles production mode correctly', () => {
			const mockEnv = {
				MODE: AppModeEnum.production,
				BASE_URL: '/dist/',
				DEV: false,
				PROD: true,
				SSR: false
			} as ImportMetaEnv

			const env = createEnvironment(mockEnv)

			expect(env.mode).toBe(AppModeEnum.production)
			expect(env.isDevelopment).toBe(false)
		})
	})
})
