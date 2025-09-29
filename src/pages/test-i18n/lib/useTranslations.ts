import {useQuery} from '@tanstack/react-query'
import {useCallback, useMemo} from 'react'
import {requestJson} from '@/shared/api'
import {useSettingsStore} from '@/shared/model'
import type {
	SupportedLanguage,
	TranslationStatus
} from '@/shared/model/translations'
import type {TranslationDictionary, TranslationEntry} from './types'

interface TranslationsResponse {
	readonly translations: Record<string, string>
}

/**
 * Fetch translations from service
 */
async function fetchTranslations(
	language: SupportedLanguage,
	keys: string[]
): Promise<Record<string, string>> {
	if (keys.length === 0) return {}

	const keysParam = keys.join(',')
	const url = `/api/translations?lang=${language}&keys=${encodeURIComponent(keysParam)}`

	// Use POST for long key lists (avoid URL length limits)
	if (url.length > 2000) {
		const payload = {
			language,
			keys
		}

		const data = await requestJson<TranslationsResponse>('/api/translations', {
			method: 'POST',
			body: payload
		})

		return data.translations
	}

	const data = await requestJson<TranslationsResponse>(url)
	return data.translations
}

export interface UseTranslationsOptions {
	readonly language?: SupportedLanguage
}

export interface UseTranslationsResult<T extends TranslationDictionary> {
	readonly t: (entry: T[keyof T]) => string
	readonly language: SupportedLanguage
	readonly isLoading: boolean
	readonly error: Error | null
	readonly missingKeys: readonly (keyof T)[]
	readonly status: TranslationStatus
}

/**
 * Normalize dictionary entry to full TranslationEntry
 */
function normalizeEntry(
	dictKey: string,
	value: string | TranslationDictionary[string]
): TranslationEntry {
	if (typeof value === 'string') {
		return {key: value, fallback: value}
	}
	return {...value, fallback: value.fallback ?? value.key ?? dictKey}
}

/**
 * Collect service keys that need to be requested
 * Only includes entries with a key property
 */
function collectServiceKeys(dictionary: TranslationDictionary): string[] {
	return Object.entries(dictionary)
		.filter(([_, value]) => {
			if (typeof value === 'string') return true
			return value.key !== undefined
		})
		.map(([_, value]) => {
			if (typeof value === 'string') return value
			return value.key as string
		})
}

/**
 * Resolve translation using smart fallback chain
 */
function resolveTranslation(
	entry: TranslationEntry,
	appLanguage: SupportedLanguage,
	serviceTranslations?: Record<string, string>
): string {
	// 1. Try service translation in app language (if key provided)
	if (entry.key) {
		const serviceTranslation = serviceTranslations?.[entry.key]
		if (serviceTranslation) {
			return serviceTranslation
		}
	}

	// 2. Try inline translation in app language
	if (entry.translations?.[appLanguage]) {
		return entry.translations[appLanguage]
	}

	// 3. Try inline translation in default language (if different from app)
	if (entry.defaultLanguage && entry.defaultLanguage !== appLanguage) {
		const defaultTranslation = entry.translations?.[entry.defaultLanguage]
		if (defaultTranslation) {
			return defaultTranslation
		}
	}

	// 4. Use fallback (which defaults to key or will be set by normalizeEntry)
	return entry.fallback ?? entry.key ?? ''
}

/**
 * Calculate missing keys (entries with service key but no translation)
 */
function calculateMissingKeys<T extends TranslationDictionary>(
	dictionary: T,
	serviceTranslations?: Record<string, string>
): (keyof T)[] {
	return Object.entries(dictionary)
		.filter(([_, value]) => {
			// String entries always need service
			if (typeof value === 'string') {
				return !serviceTranslations?.[value]
			}
			// Object entries only if they have a key
			if (value.key) {
				return !serviceTranslations?.[value.key]
			}
			// Entries without key don't need service
			return false
		})
		.map(([dictKey]) => dictKey as keyof T)
}

/**
 * Calculate translation status based on loading state and missing keys
 */
function calculateStatus(
	isLoading: boolean,
	error: unknown,
	missingKeysCount: number
): TranslationStatus {
	if (isLoading) return 'loading'
	if (error) return 'error'
	if (missingKeysCount === 0) return 'complete'
	return 'partial'
}

/**
 * Hook for autonomous translations with smart fallback chain
 *
 * Fallback chain:
 * 1. Service translation in app language
 * 2. Inline translations[appLanguage]
 * 3. Inline translations[defaultLanguage] (if specified and different from app)
 * 4. fallback value (defaults to service key)
 */
export function useTranslations<T extends TranslationDictionary>(
	dictionary: T,
	options?: UseTranslationsOptions
): UseTranslationsResult<T> {
	const storeLanguage = useSettingsStore(state => state.uiLanguage)
	const appLanguage = options?.language ?? storeLanguage ?? 'en'
	const serviceKeys = useMemo(
		() => collectServiceKeys(dictionary),
		[dictionary]
	)

	const {
		data: serviceTranslations,
		isLoading,
		error: queryError
	} = useQuery({
		queryKey: [
			'translations',
			'new',
			appLanguage,
			serviceKeys.sort().join(',')
		],
		queryFn: () => fetchTranslations(appLanguage, serviceKeys),
		enabled: serviceKeys.length > 0,
		staleTime: Number.POSITIVE_INFINITY,
		retry: 2
	})

	const t = useCallback(
		(value: T[keyof T]): string => {
			if (!value) return ''
			// Generate a fallback key for normalization (won't be used if entry has key/fallback)
			const fallbackKey = typeof value === 'string' ? value : (value.key ?? '')
			const entry = normalizeEntry(fallbackKey, value)
			return resolveTranslation(entry, appLanguage, serviceTranslations)
		},
		[appLanguage, serviceTranslations]
	)

	const missingKeys = useMemo(
		() => calculateMissingKeys(dictionary, serviceTranslations),
		[dictionary, serviceTranslations]
	)

	const status = useMemo(
		() => calculateStatus(isLoading, queryError, missingKeys.length),
		[isLoading, queryError, missingKeys.length]
	)

	return {
		t,
		language: appLanguage,
		isLoading,
		error: queryError instanceof Error ? queryError : null,
		missingKeys: Object.freeze([...missingKeys]),
		status
	}
}
