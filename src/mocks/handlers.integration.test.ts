import {setupServer} from 'msw/node'
import {afterAll, afterEach, beforeAll, describe, expect, it, vi} from 'vitest'
import {handlers} from './handlers'

const server = setupServer(...handlers)

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

	vi.doMock('@/config/environment', () => ({
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

	const module = await import('@/shared/api/httpClient')
	return {httpClient: module, fallbackSpy}
}

describe('MSW handlers', () => {
	it('returns translations without relying on fallback', async () => {
		const {httpClient, fallbackSpy} = await loadHttpClient()

		const response = await httpClient.requestJson<{
			translations: Record<string, string>
		}>('/api/translations?lang=ru&keys=footer.copyright%2Cfooter.github', {
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
