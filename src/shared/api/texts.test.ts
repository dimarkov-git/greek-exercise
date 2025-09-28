import {afterEach, beforeAll, describe, expect, it, vi} from 'vitest'

const INVALID_ERROR_PATTERN = /Invalid/
const originalFetch = globalThis.fetch

describe('getTranslations', () => {
	beforeAll(() => {
		vi.doMock('@/app/config/environment', () => ({
			AppModeEnum: {
				development: 'development',
				production: 'production',
				test: 'test'
			},
			RouterModeEnum: {
				browser: 'browser',
				hash: 'hash',
				memory: 'memory'
			},
			environment: {
				mode: 'test',
				baseURL: '/',
				routerMode: 'memory' as const,
				enableMockServiceWorker: false,
				enableQueryDevtools: false,
				enableHTTPFallback: false
			}
		}))

		vi.doMock('./fallbacks', () => ({
			resolveFallbackResponse: vi.fn(() => {})
		}))
	})

	afterEach(() => {
		vi.resetModules()
		vi.restoreAllMocks()
		globalThis.fetch = originalFetch
	})

	it('fetches translations with provided keys and language', async () => {
		const payload = {translations: {'app.title': 'Learn Greek'}}
		const response = new Response(JSON.stringify(payload), {
			status: 200,
			headers: {'Content-Type': 'application/json'}
		})
		const fetchMock = vi.fn().mockResolvedValue(response)

		globalThis.fetch = fetchMock as typeof globalThis.fetch

		const {getTranslations} = await import('./texts')
		const result = await getTranslations('en', ['app.title'])

		expect(fetchMock).toHaveBeenCalledWith(
			'/api/translations',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({language: 'en', keys: ['app.title']})
			})
		)

		// Check that headers contain the correct content type
		const call = fetchMock.mock.calls[0]
		if (call?.[1]) {
			const headers = call[1].headers as Headers
			expect(headers.get('Content-Type')).toBe('application/json')
		}

		expect(result).toEqual({'app.title': 'Learn Greek'})
	})

	it('throws when server returns invalid translation payload', async () => {
		const payload = {translations: {'app.title': 123}}
		const response = new Response(JSON.stringify(payload), {
			status: 200,
			headers: {'Content-Type': 'application/json'}
		})
		const fetchMock = vi.fn().mockResolvedValue(response)

		globalThis.fetch = fetchMock as typeof globalThis.fetch

		const {getTranslations} = await import('./texts')

		await expect(getTranslations('en', ['app.title'])).rejects.toThrowError(
			INVALID_ERROR_PATTERN
		)
	})
})
