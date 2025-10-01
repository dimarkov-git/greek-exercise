/**
 * Translation fallback resolver for offline-first HTTP client
 *
 * Provides fallback responses for translation API requests when
 * network is unavailable or MSW is enabled.
 *
 * @module shared/lib/i18n
 */

import type {FallbackResolver} from '@/shared/api/fallback'
import type {SupportedLanguage, TranslationsDatabase} from '@/shared/model'
import {translationsDatabase} from './data'

const translationsData = translationsDatabase as TranslationsDatabase

function normalizeTranslationKeys(keys: readonly string[]): string[] {
	return keys.map(key => key.trim()).filter(key => key.length > 0)
}

function resolveTranslations(
	language: SupportedLanguage,
	keys: readonly string[]
): Record<string, string> {
	const languageTranslations = translationsData[language] ?? {}
	const filtered: Record<string, string> = {}

	for (const key of keys) {
		const value = languageTranslations[key]

		if (typeof value === 'string') {
			filtered[key] = value
			continue
		}

		if (language !== 'en') {
			const fallback = translationsData.en?.[key]

			if (typeof fallback === 'string') {
				filtered[key] = fallback
			}
		}
	}

	return filtered
}

/**
 * Creates a fallback resolver for translation API requests
 *
 * Handles both GET and POST requests to /api/translations endpoint,
 * returning translations from the mock database.
 *
 * @returns Fallback resolver for translations
 *
 * @example
 * ```typescript
 * const resolver = createTranslationsFallbackResolver()
 * const result = resolver({
 *   url: new URL('/api/translations', window.location.origin),
 *   method: 'POST',
 *   body: { language: 'en', keys: ['app.title'] }
 * })
 * ```
 */
export function createTranslationsFallbackResolver(): FallbackResolver {
	return ({url, method, body}) => {
		if (url.pathname !== '/api/translations') {
			return
		}

		if (method === 'GET') {
			const lang = url.searchParams.get('lang') as SupportedLanguage | null
			const keysParam = url.searchParams.get('keys')

			if (!(lang && keysParam)) {
				return {type: 'success', data: {translations: {}}}
			}

			const keys = normalizeTranslationKeys(keysParam.split(','))
			return {
				type: 'success',
				data: {translations: resolveTranslations(lang, keys)}
			}
		}

		if (method === 'POST' && body && typeof body === 'object') {
			const {language, keys} = body as {
				language?: SupportedLanguage
				keys?: string[]
			}

			if (!(language && Array.isArray(keys))) {
				return {type: 'success', data: {translations: {}}}
			}

			const normalizedKeys = normalizeTranslationKeys(keys)

			return {
				type: 'success',
				data: {translations: resolveTranslations(language, normalizedKeys)}
			}
		}

		return
	}
}
