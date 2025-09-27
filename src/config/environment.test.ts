import {describe, expect, it} from 'vitest'
import {AppModeEnum, RouterModeEnum} from '@/config/environment'

describe('environment configuration', () => {
	it('respects explicit environment variable overrides in test mode', async () => {
		const {environment} = await import('@/config/environment')

		expect(environment.mode).toBe(AppModeEnum.test)
		expect(environment.baseURL).toBe('/')
		expect(environment.routerMode).toBe(RouterModeEnum.memory)
		expect(environment.enableMockServiceWorker).toBe(true)
		expect(environment.enableHTTPFallback).toBe(true)
		expect(environment.enableQueryDevtools).toBe(false)
	})
})
