import {afterEach, expect, it, vi} from 'vitest'

const originalFetch = globalThis.fetch

interface LoadClientOptions {
	enableMockServiceWorker: boolean
	enableHttpFallback: boolean
	fallbackImplementation?: (context: {
		url: URL
		method: string
		body?: unknown
	}) =>
		| {type: 'success'; data: unknown}
		| {type: 'error'; status: number; message: string}
		| undefined
}

type FallbackResult = ReturnType<
	NonNullable<LoadClientOptions['fallbackImplementation']>
>

async function loadHttpClient({
	enableMockServiceWorker,
	enableHttpFallback,
	fallbackImplementation
}: LoadClientOptions) {
	vi.resetModules()

	const defaultFallback: NonNullable<
		LoadClientOptions['fallbackImplementation']
	> = (): FallbackResult => undefined as FallbackResult
	const resolveFallbackResponse = vi.fn(
		fallbackImplementation ?? defaultFallback
	)

	vi.doMock('@/config/environment', () => ({
		environment: {
			mode: 'test',
			isDevelopment: false,
			isProduction: false,
			isTest: true,
			isAutomationEnvironment: false,
			baseUrl: '/',
			routerMode: 'memory' as const,
			enableMockServiceWorker,
			enableQueryDevtools: false,
			enableHttpFallback
		}
	}))

	vi.doMock('./fallbacks', () => ({
		resolveFallbackResponse
	}))

	const module = await import('./httpClient')

	return {
		requestJson: module.requestJson,
		resolveFallbackResponse
	}
}

afterEach(() => {
	vi.resetModules()
	vi.restoreAllMocks()
	globalThis.fetch = originalFetch
})

it('throws when MSW and fallback are disabled', async () => {
	const fetchMock = vi.fn().mockRejectedValue(new Error('Network unavailable'))

	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson, resolveFallbackResponse} = await loadHttpClient({
		enableMockServiceWorker: false,
		enableHttpFallback: false
	})

	await expect(requestJson('/api/translations', {retry: 0})).rejects.toThrow(
		'Network unavailable'
	)

	expect(fetchMock).toHaveBeenCalledTimes(1)
	expect(resolveFallbackResponse).not.toHaveBeenCalled()
})

it('returns network response when MSW is enabled even if fallback is disabled', async () => {
	const payload = {status: 'ok'}
	const response = new Response(JSON.stringify(payload), {
		status: 200,
		headers: {'Content-Type': 'application/json'}
	})

	const fetchMock = vi.fn().mockResolvedValueOnce(response)
	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson, resolveFallbackResponse} = await loadHttpClient({
		enableMockServiceWorker: true,
		enableHttpFallback: false
	})

	await expect(requestJson('/api/exercises')).resolves.toEqual(payload)
	expect(resolveFallbackResponse).not.toHaveBeenCalled()
})

it('uses fallback data when network fails and fallback is enabled', async () => {
	const fetchMock = vi.fn().mockRejectedValue(new Error('Network unavailable'))

	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const fallbackPayload = {data: 'fallback'}

	const {requestJson, resolveFallbackResponse} = await loadHttpClient({
		enableMockServiceWorker: false,
		enableHttpFallback: true,
		fallbackImplementation: () => ({
			type: 'success',
			data: fallbackPayload
		})
	})

	await expect(
		requestJson('/api/exercises/verbs-be', {retry: 0})
	).resolves.toEqual(fallbackPayload)

	expect(resolveFallbackResponse).toHaveBeenCalledTimes(1)
	expect(resolveFallbackResponse).toHaveBeenCalledWith(
		expect.objectContaining({
			method: 'GET',
			url: expect.any(URL)
		})
	)
})

it('prefers network response when both MSW and fallback are enabled', async () => {
	const payload = {status: 'ok'}
	const response = new Response(JSON.stringify(payload), {
		status: 200,
		headers: {'Content-Type': 'application/json'}
	})

	const fetchMock = vi.fn().mockResolvedValueOnce(response)
	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson, resolveFallbackResponse} = await loadHttpClient({
		enableMockServiceWorker: true,
		enableHttpFallback: true,
		fallbackImplementation: () => ({
			type: 'success',
			data: {status: 'fallback'}
		})
	})

	await expect(requestJson('/api/exercises')).resolves.toEqual(payload)
	expect(resolveFallbackResponse).not.toHaveBeenCalled()
})
