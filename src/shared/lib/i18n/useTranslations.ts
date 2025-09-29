/**
 * DEPRECATED: This function only exists for backwards compatibility with tests.
 * All production code should use loadTranslations() instead.
 *
 * This stub will throw an error if called in production code.
 * Tests can mock this function as needed.
 */
export function useTranslations(): never {
	throw new Error(
		'useTranslations() is deprecated and has been removed. ' +
		'Use loadTranslations() instead. ' +
		'This function only exists as a stub for test mocking compatibility.'
	)
}