/**
 * Integration tests for MSW with httpClient
 *
 * Tests that MSW handlers work correctly with the httpClient,
 * ensuring that requests are intercepted and responses are served
 * without falling back to the offline resolver.
 *
 * @module shared/api/msw
 */

import {afterAll, afterEach, beforeAll, describe, expect, it, vi} from 'vitest'
import {exerciseMswHandlers} from '@/entities/exercise'
import {translationMswHandlers} from '@/shared/lib/i18n'
import {createServer} from '@/shared/test'

const server = createServer([...translationMswHandlers, ...exerciseMswHandlers])

beforeAll(() => {
	server.listen({onUnhandledRequest: 'error'})
})

afterEach(() => {
	server.resetHandlers()
	vi.resetModules()
	vi.restoreAllMocks()
})

afterAll(() => server.close())

async function loadHttpClient() {
	const fallbackSpy = vi.fn()

	vi.doMock('@/app/config/environment', () => ({
		AppMode: {
			development: 'development',
			production: 'production',
			test: 'test'
		},
		environment: {
			mode: 'test',
			baseURL: '/',
			routerMode: 'memory' as const,
			enableMockServiceWorker: true,
			enableQueryDevtools: false,
			enableHTTPFallback: false
		}
	}))

	vi.doMock('@/shared/api/fallbacks', () => ({
		resolveFallbackResponse: fallbackSpy
	}))

	const module = await import('@/shared/api')
	return {httpClient: module, fallbackSpy}
}

describe('MSW integration with httpClient', () => {
	it('returns translations without relying on fallback', async () => {
		const {httpClient, fallbackSpy} = await loadHttpClient()

		const response = await httpClient.requestJson<{
			translations: Record<string, string>
		}>('/api/translations', {
			method: 'POST',
			body: {
				language: 'ru',
				keys: ['footer.copyright', 'footer.github']
			},
			retry: 0
		})

		expect(response.translations).toMatchObject({
			'footer.copyright': '© 2025 Учим греческий. Все права защищены.',
			'footer.github': 'GitHub'
		})
		expect(fallbackSpy).not.toHaveBeenCalled()
	})

	it('returns exercise library data without fallback', async () => {
		const {httpClient, fallbackSpy} = await loadHttpClient()

		const exercises = await httpClient.requestJson<
			Array<{id: string; title: string; type: string}>
		>('/api/exercises', {retry: 0})

		expect(Array.isArray(exercises)).toBe(true)
		expect(exercises.length).toBeGreaterThan(0)
		expect(exercises[0]).toMatchObject({
			id: expect.any(String),
			title: expect.any(String),
			type: 'word-form'
		})
		expect(fallbackSpy).not.toHaveBeenCalled()
	})
})
