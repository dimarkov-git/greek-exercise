/* biome-ignore format: JSX in test file causes parse errors */
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {renderHook, waitFor} from '@testing-library/react'
import type {ReactNode} from 'react'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {useSettingsStore} from '@/shared/model'
import {DEFAULT_SETTINGS} from '@/shared/model/settings'
import type {TranslationDictionary} from './types'
import {useTranslations} from './useTranslations'

// Test dictionary with various entry types
const testDict = {
	// Simple string format (service key only)
	simple: 'test.simple',

	// With inline translations and service key
	withTranslations: {
		key: 'test.withTranslations',
		translations: {en: 'Hello', el: 'Γεια', ru: 'Привет'}
	},

	// With default language
	withDefault: {
		key: 'test.withDefault',
		translations: {en: 'English', el: 'Ελληνικά'},
		defaultLanguage: 'el' as const
	},

	// With custom fallback
	withFallback: {
		key: 'test.withFallback',
		fallback: 'Custom Fallback'
	},

	// Only default language
	onlyDefaultLang: {
		key: 'test.onlyDefaultLang',
		translations: {ru: 'Только русский'},
		defaultLanguage: 'ru' as const
	},

	// Local-only (no service key) - uses only inline translations
	localOnly: {
		translations: {en: 'Local', el: 'Τοπικό', ru: 'Локальный'}
	}
} as const satisfies TranslationDictionary

describe('useTranslations - Autonomous System (NO MOCKING NEEDED)', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					gcTime: 0
				}
			}
		})

		// Reset settings store
		useSettingsStore.setState(DEFAULT_SETTINGS)
	})

	afterEach(() => {
		queryClient.clear()
	})

	// Test wrapper with QueryClientProvider
	const createWrapper = () =>
		function TestWrapper({children}: {children: ReactNode}) {
			return (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			)
		}

	describe('Basic Fallback Chain', () => {
		it('uses service key as fallback for string entries', () => {
			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			// Simple string entry falls back to service key
			expect(result.current.t(testDict.simple)).toBe('test.simple')
		})

		it('returns inline translation for current language', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'el'}),
				{wrapper: createWrapper()}
			)

			expect(result.current.t(testDict.withTranslations)).toBe('Γεια')
		})

		it('returns inline translation for Russian', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'ru'}),
				{wrapper: createWrapper()}
			)

			expect(result.current.t(testDict.withTranslations)).toBe('Привет')
		})
	})

	describe('Default Language Fallback', () => {
		it('falls back to defaultLanguage when app language not found', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'ru'}), // ru not in withDefault
				{wrapper: createWrapper()}
			)

			// Should use defaultLanguage: 'el'
			expect(result.current.t(testDict.withDefault)).toBe('Ελληνικά')
		})

		it('uses app language if available, ignoring defaultLanguage', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'en'}),
				{wrapper: createWrapper()}
			)

			// en is available, so use it instead of defaultLanguage
			expect(result.current.t(testDict.withDefault)).toBe('English')
		})

		it('uses fallback when no translations match', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'ru'}), // ru not available for withDefault
				{wrapper: createWrapper()}
			)

			// withDefault has no ru translation, should fall back to defaultLanguage (el)
			expect(result.current.t(testDict.withDefault)).toBe('Ελληνικά')
		})

		it('uses defaultLanguage even when app language is different and no inline translation exists', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'en'}),
				{wrapper: createWrapper()}
			)

			// onlyDefaultLang has only ru translation, should use it via defaultLanguage
			expect(result.current.t(testDict.onlyDefaultLang)).toBe('Только русский')
		})
	})

	describe('Inline Translations', () => {
		it('uses inline translations without service', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'el'}),
				{wrapper: createWrapper()}
			)

			// Should use inline translation immediately
			expect(result.current.t(testDict.withTranslations)).toBe('Γεια')
		})

		it('uses custom fallback when specified', async () => {
			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			await waitFor(() => expect(result.current.isLoading).toBe(false))

			// Should use custom fallback
			expect(result.current.t(testDict.withFallback)).toBe('Custom Fallback')
		})

		it('uses only inline translations when no service key', () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'el'}),
				{wrapper: createWrapper()}
			)

			// Should use inline translation without service request
			expect(result.current.t(testDict.localOnly)).toBe('Τοπικό')
		})
	})

	describe('Language Property', () => {
		it('returns current language from settings store', () => {
			useSettingsStore.setState({...DEFAULT_SETTINGS, uiLanguage: 'el'})

			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			expect(result.current.language).toBe('el')
		})

		it('allows overriding language via options', () => {
			useSettingsStore.setState({...DEFAULT_SETTINGS, uiLanguage: 'en'})

			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'ru'}),
				{wrapper: createWrapper()}
			)

			expect(result.current.language).toBe('ru')
		})

		it('defaults to "en" when no language set', () => {
			useSettingsStore.setState({
				uiLanguage: 'en',
				userLanguage: 'en',
				theme: 'light'
			})

			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			expect(result.current.language).toBe('en')
		})
	})

	describe('Status and Missing Keys', () => {
		it('reports status as partial when service unavailable', async () => {
			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			await waitFor(() => expect(result.current.isLoading).toBe(false))

			// Service unavailable, so status should be partial
			expect(result.current.status).toBe('partial')
			expect(result.current.missingKeys.length).toBeGreaterThan(0)
		})

		it('does not count entries without service key as missing', async () => {
			const mixedDict = {
				withService: 'test.service',
				localOnly: {
					translations: {en: 'Local', el: 'Τοπικό'}
				}
			} as const satisfies TranslationDictionary

			const {result} = renderHook(() => useTranslations(mixedDict), {
				wrapper: createWrapper()
			})

			await waitFor(() => expect(result.current.isLoading).toBe(false))

			// Only withService should be missing (has service key)
			expect(result.current.missingKeys).toContain('withService')
			expect(result.current.missingKeys).not.toContain('localOnly')
		})

		it('identifies missing keys for non-local entries without service', async () => {
			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			await waitFor(() => expect(result.current.isLoading).toBe(false))

			// Should have missing keys for entries that aren't local (service unavailable)
			expect(result.current.missingKeys.length).toBeGreaterThan(0)
			expect(result.current.status).toBe('partial')
		})
	})

	describe('Fallback Behavior', () => {
		it('uses service key as fallback for string entries', async () => {
			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			await waitFor(() => expect(result.current.isLoading).toBe(false))

			// String entry uses service key as fallback
			expect(result.current.t(testDict.simple)).toBe('test.simple')
		})

		it('uses inline translations when available', async () => {
			const {result} = renderHook(
				() => useTranslations(testDict, {language: 'el'}),
				{wrapper: createWrapper()}
			)

			await waitFor(() => expect(result.current.isLoading).toBe(false))

			// Should use inline translation
			expect(result.current.t(testDict.withTranslations)).toBe('Γεια')
		})

		it('uses custom fallback when specified', async () => {
			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			await waitFor(() => expect(result.current.isLoading).toBe(false))

			// Should use custom fallback
			expect(result.current.t(testDict.withFallback)).toBe('Custom Fallback')
		})
	})

	describe('Edge Cases', () => {
		it('handles empty dictionary', () => {
			const emptyDict = {} as const satisfies TranslationDictionary

			const {result} = renderHook(() => useTranslations(emptyDict), {
				wrapper: createWrapper()
			})

			expect(result.current.status).toBe('complete')
			expect(result.current.missingKeys).toHaveLength(0)
		})

		it('handles mixed string and object entries', () => {
			const mixedDict = {
				simple: 'test.simple',
				complex: {
					key: 'test.complex',
					translations: {en: 'Complex'},
					fallback: 'Complex Fallback'
				}
			} as const satisfies TranslationDictionary

			const {result} = renderHook(() => useTranslations(mixedDict), {
				wrapper: createWrapper()
			})

			// String entry uses key as fallback
			expect(result.current.t(mixedDict.simple)).toBe('test.simple')
			// Complex entry uses inline translation
			expect(result.current.t(mixedDict.complex)).toBe('Complex')
		})

		it('returns empty string when entry is undefined', () => {
			const {result} = renderHook(() => useTranslations(testDict), {
				wrapper: createWrapper()
			})

			// @ts-expect-error - intentionally testing undefined entry
			expect(result.current.t(undefined)).toBe('')
		})
	})
})
