import {AppModeEnum, environment} from '@/config/environment'
import {resolveFallbackResponse} from './fallbacks'

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504])
const DEFAULT_RETRY_COUNT = 2
const DEFAULT_RETRY_DELAY_MS = 250

export type JsonValue =
	| null
	| boolean
	| number
	| string
	| JsonValue[]
	| {[key: string]: JsonValue}

export interface HttpErrorDetails {
	status: number
	statusText: string
	url: string
	method: string
	body?: unknown
}

export class HttpError extends Error {
	status: number
	statusText: string
	url: string
	method: string
	body?: unknown

	constructor(message: string, details: HttpErrorDetails) {
		super(message)
		this.name = 'HttpError'
		this.status = details.status
		this.statusText = details.statusText
		this.url = details.url
		this.method = details.method
		this.body = details.body
	}
}

function isJsonValue(value: unknown): value is JsonValue {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return true
	}

	if (Array.isArray(value)) {
		return value.every(item => isJsonValue(item))
	}

	if (typeof value === 'object') {
		return Object.values(value as Record<string, unknown>).every(item =>
			isJsonValue(item)
		)
	}

	return false
}

function shouldRetry(status: number) {
	return RETRYABLE_STATUS_CODES.has(status)
}

function delay(ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

async function readErrorBody(response: Response) {
	const contentType = response.headers.get('content-type') ?? ''

	if (contentType.includes('application/json')) {
		try {
			return await response.json()
		} catch {
			return
		}
	}

	try {
		return await response.text()
	} catch {
		return
	}
}

async function parseJsonResponse<TResponse>(
	response: Response,
	url: string,
	method: string
): Promise<TResponse> {
	if (
		response.status === 204 ||
		response.headers.get('content-length') === '0'
	) {
		return undefined as TResponse
	}

	const contentType = response.headers.get('content-type') ?? ''

	if (!contentType.includes('application/json')) {
		throw new HttpError(
			`Expected JSON response but received '${contentType || 'unknown'}'`,
			{
				status: response.status,
				statusText: response.statusText,
				url,
				method
			}
		)
	}

	const clone = response.clone()

	try {
		return (await response.json()) as TResponse
	} catch {
		throw new HttpError('Failed to parse JSON response', {
			status: response.status,
			statusText: response.statusText,
			url,
			method,
			body: await readErrorBody(clone)
		})
	}
}

function serializeBody(body: JsonValue | undefined, headers: Headers) {
	if (body === undefined) {
		return
	}

	if (!isJsonValue(body)) {
		throw new TypeError('Request body is not JSON serializable')
	}

	if (!headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json')
	}

	return JSON.stringify(body)
}

function createRequestInitFactory(
	inputInit: RequestInit,
	method: string,
	headers: Headers,
	serializedBody: string | undefined
) {
	return () => {
		const requestHeaders = new Headers(headers)
		const requestInit: RequestInit = {
			...inputInit,
			method,
			headers: requestHeaders
		}

		if (serializedBody !== undefined) {
			requestInit.body = serializedBody
		}

		return requestInit
	}
}

interface RequestContext {
	input: string
	method: string
	retry: number
	retryDelayMs: number
}

async function handleResponse<TResponse>(
	response: Response,
	attempt: number,
	context: RequestContext,
	attemptRequest: (nextAttempt: number) => Promise<TResponse>
) {
	if (response.ok) {
		return parseJsonResponse<TResponse>(response, context.input, context.method)
	}

	if (attempt < context.retry && shouldRetry(response.status)) {
		await delay(context.retryDelayMs * (attempt + 1))
		return attemptRequest(attempt + 1)
	}

	const responseBody = await readErrorBody(response.clone())

	throw new HttpError(
		`Request to ${context.input} failed with status ${response.status}`,
		{
			status: response.status,
			statusText: response.statusText,
			url: context.input,
			method: context.method,
			body: responseBody
		}
	)
}

async function handleFailure<TResponse>(
	attempt: number,
	error: unknown,
	context: RequestContext,
	attemptRequest: (nextAttempt: number) => Promise<TResponse>
) {
	if (error instanceof HttpError) {
		throw error
	}

	if (attempt < context.retry) {
		await delay(context.retryDelayMs * (attempt + 1))
		return attemptRequest(attempt + 1)
	}

	if (error instanceof Error) {
		throw new Error(`Request to ${context.input} failed: ${error.message}`, {
			cause: error
		})
	}

	throw new Error(`Request to ${context.input} failed with an unknown error`)
}

function attemptFallback<TResponse, TBody extends JsonValue | undefined>({
	error,
	fallbackEnabled,
	input,
	method,
	body
}: {
	error: unknown
	fallbackEnabled: boolean
	input: string
	method: string
	body: TBody | undefined
}): TResponse {
	if (!fallbackEnabled) {
		throw error
	}

	if (environment.mode === AppModeEnum.development) {
		// biome-ignore lint/suspicious/noConsole: development diagnostics
		console.warn('Attempt request failed, use fallback', error)
	}

	try {
		const url = new URL(input, window.location.origin)
		const fallbackResult = resolveFallbackResponse({
			url,
			method,
			body
		})

		if (fallbackResult === undefined) {
			throw error
		}

		if (fallbackResult.type === 'error') {
			throw new HttpError(fallbackResult.message, {
				status: fallbackResult.status,
				statusText: fallbackResult.message,
				url: url.toString(),
				method,
				body
			})
		}

		return fallbackResult.data as TResponse
	} catch (fallbackError) {
		if (fallbackError instanceof Error) {
			throw fallbackError
		}

		throw error
	}
}

export interface JsonRequestInit<
	TBody extends JsonValue | undefined = JsonValue
> extends Omit<RequestInit, 'body'> {
	body?: TBody
	retry?: number
	retryDelayMs?: number
	fallback?: boolean
}

export async function requestJson<
	TResponse,
	TBody extends JsonValue | undefined = JsonValue
>(
	input: string,
	{
		body,
		retry = DEFAULT_RETRY_COUNT,
		retryDelayMs = DEFAULT_RETRY_DELAY_MS,
		headers,
		method = 'GET',
		fallback: fallbackOverride,
		...init
	}: JsonRequestInit<TBody> = {}
): Promise<TResponse> {
	const normalizedHeaders = new Headers(headers)
	const serializedBody = serializeBody(body, normalizedHeaders)
	const requestInitFactory = createRequestInitFactory(
		init,
		method,
		normalizedHeaders,
		serializedBody
	)

	const context: RequestContext = {
		input,
		method,
		retry,
		retryDelayMs
	}

	const fallbackEnabled = fallbackOverride ?? environment.enableHTTPFallback

	const attemptRequest = async (attempt: number): Promise<TResponse> => {
		try {
			const response = await fetch(input, requestInitFactory())
			return handleResponse(response, attempt, context, attemptRequest)
		} catch (error) {
			return handleFailure(attempt, error, context, attemptRequest)
		}
	}

	try {
		return await attemptRequest(0)
	} catch (error) {
		return attemptFallback<TResponse, TBody>({
			error,
			fallbackEnabled,
			input,
			method,
			body
		})
	}
}
