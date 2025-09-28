import {afterEach, expect, it, vi} from 'vitest'

const originalFetch = globalThis.fetch

interface LoadClientOptions {
	enableMockServiceWorker: boolean
	enableHTTPFallback: boolean
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
	enableHTTPFallback,
	fallbackImplementation
}: LoadClientOptions) {
	vi.resetModules()

	const defaultFallback: NonNullable<
		LoadClientOptions['fallbackImplementation']
	> = (): FallbackResult => undefined as FallbackResult
	const resolveFallbackResponse = vi.fn(
		fallbackImplementation ?? defaultFallback
	)

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
			enableMockServiceWorker,
			enableQueryDevtools: false,
			enableHTTPFallback
		}
	}))

	vi.doMock('./fallbacks', () => ({
		resolveFallbackResponse
	}))

	const module = await import('./httpClient')

	return {
		httpErrorConstructor: module.HttpError,
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
		enableHTTPFallback: false
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
		enableHTTPFallback: false
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
		enableHTTPFallback: true,
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
		enableHTTPFallback: true,
		fallbackImplementation: () => ({
			type: 'success',
			data: {status: 'fallback'}
		})
	})

	await expect(requestJson('/api/exercises')).resolves.toEqual(payload)
	expect(resolveFallbackResponse).not.toHaveBeenCalled()
})

it('retries retryable status codes before succeeding', async () => {
	vi.useFakeTimers()

	const retryResponse = new Response(JSON.stringify({error: 'retry'}), {
		status: 503,
		headers: {'Content-Type': 'application/json'}
	})

	const successPayload = {status: 'ok'}
	const successResponse = new Response(JSON.stringify(successPayload), {
		status: 200,
		headers: {'Content-Type': 'application/json'}
	})

	const fetchMock = vi
		.fn()
		.mockResolvedValueOnce(retryResponse)
		.mockResolvedValueOnce(successResponse)

	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson} = await loadHttpClient({
		enableMockServiceWorker: true,
		enableHTTPFallback: false
	})

	const requestPromise = requestJson('/api/retry', {
		retry: 2,
		retryDelayMs: 10
	})

	await vi.advanceTimersByTimeAsync(10)
	await expect(requestPromise).resolves.toEqual(successPayload)
	expect(fetchMock).toHaveBeenCalledTimes(2)

	vi.useRealTimers()
})

it('throws an HttpError when the server responds with non-JSON content', async () => {
	const response = new Response('plain text', {
		status: 200,
		headers: {'Content-Type': 'text/plain'}
	})

	const fetchMock = vi.fn().mockResolvedValueOnce(response)
	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson, httpErrorConstructor} = await loadHttpClient({
		enableMockServiceWorker: true,
		enableHTTPFallback: false
	})

	await expect(requestJson('/api/plain')).rejects.toBeInstanceOf(
		httpErrorConstructor
	)
})

it('returns undefined when the server responds with no content', async () => {
	const response = new Response(null, {
		status: 204,
		headers: {'Content-Type': 'application/json'}
	})

	const fetchMock = vi.fn().mockResolvedValueOnce(response)
	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson} = await loadHttpClient({
		enableMockServiceWorker: true,
		enableHTTPFallback: false
	})

	await expect(requestJson('/api/empty')).resolves.toBeUndefined()
})

it('serialises JSON bodies and sets headers when sending payloads', async () => {
	const payload = {status: 'ok'}
	const response = new Response(JSON.stringify(payload), {
		status: 200,
		headers: {'Content-Type': 'application/json'}
	})

	const fetchMock = vi.fn().mockResolvedValueOnce(response)
	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson} = await loadHttpClient({
		enableMockServiceWorker: true,
		enableHTTPFallback: false
	})

	await requestJson('/api/exercises', {
		method: 'POST',
		body: {filter: 'all'}
	})

	const [, init] = fetchMock.mock.calls[0] ?? []
	const headers = (init?.headers as Headers) ?? new Headers()

	expect(headers.get('Content-Type')).toBe('application/json')
	expect(init?.body).toBe(JSON.stringify({filter: 'all'}))
})

it('propagates fallback HttpError results when fallback handlers fail', async () => {
	const fetchMock = vi.fn().mockRejectedValue(new Error('Network unavailable'))
	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson, httpErrorConstructor} = await loadHttpClient({
		enableMockServiceWorker: false,
		enableHTTPFallback: true,
		fallbackImplementation: () => ({
			type: 'error',
			status: 503,
			message: 'Service unavailable'
		})
	})

	await expect(
		requestJson('/api/fallback-error', {retry: 0})
	).rejects.toBeInstanceOf(httpErrorConstructor)
})

it('wraps unknown thrown values when retries are exhausted', async () => {
	const fetchMock = vi.fn().mockRejectedValue('catastrophic failure')

	globalThis.fetch = fetchMock as typeof globalThis.fetch

	const {requestJson} = await loadHttpClient({
		enableMockServiceWorker: false,
		enableHTTPFallback: false
	})

	await expect(requestJson('/api/unknown', {retry: 1})).rejects.toThrow(
		'Request to /api/unknown failed with an unknown error'
	)
})
