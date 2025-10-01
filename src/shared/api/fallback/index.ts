/**
 * Fallback system for HTTP client offline-first strategy
 *
 * Provides composable resolver infrastructure for handling
 * requests when network is unavailable or MSW is enabled.
 *
 * @module shared/api/fallback
 */

export {createFallbackRegistry} from './registry'
export type {
	FallbackRequestContext,
	FallbackResolver,
	FallbackResponse
} from './types'
