/**
 * Fallback system types for HTTP client offline-first strategy
 *
 * @module shared/api/fallback
 */

/**
 * Fallback response types returned by resolvers
 */
export type FallbackResponse =
	| {type: 'success'; data: unknown}
	| {type: 'error'; status: number; message: string}
	| undefined

/**
 * Request context passed to fallback resolvers
 */
export interface FallbackRequestContext {
	url: URL
	method: string
	body?: unknown
}

/**
 * Individual fallback resolver function
 * Returns a response if it can handle the request, undefined otherwise
 */
export type FallbackResolver = (
	context: FallbackRequestContext
) => FallbackResponse
