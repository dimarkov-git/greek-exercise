import type {FallbackResolver} from './types'

/**
 * Creates a composable fallback registry that tries resolvers in order
 *
 * @param resolvers - Array of fallback resolvers to try in sequence
 * @returns Combined resolver function that tries each resolver until one succeeds
 *
 * @example
 * ```typescript
 * const resolveFallback = createFallbackRegistry([
 *   translationsResolver,
 *   exerciseResolver
 * ])
 * ```
 */
export function createFallbackRegistry(
	resolvers: FallbackResolver[]
): FallbackResolver {
	return context => {
		for (const resolver of resolvers) {
			const result = resolver(context)
			if (result !== undefined) {
				return result
			}
		}
		return
	}
}
