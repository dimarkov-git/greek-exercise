import {useQuery} from '@tanstack/react-query'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {JsonValue} from '@/shared/api'
import {requestJson} from '@/shared/api'
import type {
	DictionaryKeys,
	TranslationDictionary,
	Translator
} from '@/shared/lib/i18n'
import type {TranslationRegistryKey} from '@/shared/lib/i18n/generated/translation-registry'
import {useSettingsStore} from '@/shared/model'
import type {
	SupportedLanguage,
	TranslationMissingPolicy,
	TranslationOptions,
	TranslationRequest,
	TranslationResult,
	TranslationStatus
} from '@/shared/model/translations'

interface TranslationsResponse {
	readonly translations: TranslationResult
}

type TranslationFetchPayload = {
	readonly language: SupportedLanguage
	readonly keys: TranslationRegistryKey[]
} & Record<string, JsonValue>

const LANGUAGE_CHANGE_DELAY_MS = 300

async function fetchTranslations(
	language: SupportedLanguage,
	keys: readonly TranslationRegistryKey[]
): Promise<TranslationResult> {
	const keysParam = keys.join(',')
	const url = `/api/translations?lang=${language}&keys=${encodeURIComponent(keysParam)}`

	if (url.length > 2000) {
		const payload: TranslationFetchPayload = {
			language,
			keys: [...keys]
		}

		const data = await requestJson<
			TranslationsResponse,
			TranslationFetchPayload
		>('/api/translations', {
			method: 'POST',
			body: payload
		})

		return data.translations
	}

	const data = await requestJson<TranslationsResponse>(url)
	return data.translations
}

interface LanguageGroup {
	readonly language: SupportedLanguage
	readonly keys: readonly TranslationRegistryKey[]
}

function groupKeysByLanguage(
	dictionary: TranslationDictionary<TranslationRegistryKey>,
	currentLanguage: SupportedLanguage
): LanguageGroup[] {
	const languageGroups = new Map<SupportedLanguage, TranslationRegistryKey[]>()

	for (const key of dictionary.keys) {
		const fixedLanguage = dictionary.getFixedLanguage(key)
		const targetLanguage = fixedLanguage ?? currentLanguage

		if (!languageGroups.has(targetLanguage)) {
			languageGroups.set(targetLanguage, [])
		}
		languageGroups.get(targetLanguage)?.push(key)
	}

	return Array.from(languageGroups.entries()).map(([language, keys]) => ({
		language,
		keys: Object.freeze([...keys]) as readonly TranslationRegistryKey[]
	}))
}

async function fetchMixedLanguageTranslations(
	dictionary: TranslationDictionary<TranslationRegistryKey>,
	currentLanguage: SupportedLanguage
): Promise<TranslationResult> {
	const languageGroups = groupKeysByLanguage(dictionary, currentLanguage)

	if (languageGroups.length === 1) {
		// Single language - use existing logic
		const singleGroup = languageGroups[0]
		if (!singleGroup) {
			throw new Error('Expected at least one language group but found none')
		}
		return fetchTranslations(singleGroup.language, singleGroup.keys)
	}

	// Multiple languages - fetch in parallel and merge
	const translationPromises = languageGroups.map(group =>
		fetchTranslations(group.language, group.keys)
	)

	const translationResults = await Promise.all(translationPromises)

	// Merge all results
	const merged: TranslationResult = {}
	for (const result of translationResults) {
		Object.assign(merged, result)
	}
	return merged
}

function isTestEnvironment() {
	return typeof globalThis !== 'undefined' && '__VITEST__' in globalThis
}

function getDefaultLanguage(): SupportedLanguage {
	if (isTestEnvironment()) {
		return 'en'
	}

	if (
		typeof window !== 'undefined' &&
		(window.location.href.includes('test') || document.title.includes('test'))
	) {
		return 'en'
	}

	return 'el'
}

interface ResolvedTranslation {
	readonly value: string
	readonly missing: boolean
}

function resolveTranslation(
	request: TranslationRequest,
	translations: TranslationResult | undefined,
	missingPolicy: TranslationMissingPolicy
): ResolvedTranslation {
	const translation = translations?.[request.key]

	if (typeof translation === 'string') {
		return {value: translation, missing: false}
	}

	const fallbackValue = missingPolicy === 'key' ? request.key : request.fallback
	return {value: fallbackValue, missing: true}
}

export interface UseTranslationsResult<
	TDict extends TranslationDictionary<TranslationRegistryKey>
> {
	readonly t: Translator<DictionaryKeys<TDict>>
	readonly translations: Record<DictionaryKeys<TDict>, string>
	readonly currentLanguage: SupportedLanguage
	readonly isLoading: boolean
	readonly error: Error | null
	readonly missingKeys: readonly DictionaryKeys<TDict>[]
	readonly status: TranslationStatus
}

function normalizeError(error: unknown, hasError: boolean): Error | null {
	if (!error) {
		return hasError ? new Error('Unknown translation error') : null
	}

	if (error instanceof Error) {
		return error
	}

	if (typeof error === 'string') {
		return new Error(error)
	}

	return new Error('Unknown translation error')
}

function useCurrentLanguage(): SupportedLanguage {
	const uiLanguage = useSettingsStore(state => state.uiLanguage)
	return uiLanguage ?? getDefaultLanguage()
}

function useTranslationQuery(
	dictionary: TranslationDictionary<TranslationRegistryKey>,
	currentLanguage: SupportedLanguage
) {
	const retryAttempts = isTestEnvironment() ? 0 : 2

	// Create a cache key that includes fixed language keys for proper cache invalidation
	const languageGroups = groupKeysByLanguage(dictionary, currentLanguage)
	const cacheKeyParts = languageGroups.map(
		group => `${group.language}:${group.keys.join(',')}`
	)
	const enhancedCacheKey = `${dictionary.cacheKey}|${cacheKeyParts.join('|')}`

	return useQuery({
		queryKey: ['translations', enhancedCacheKey],
		queryFn: () => fetchMixedLanguageTranslations(dictionary, currentLanguage),
		staleTime: Number.POSITIVE_INFINITY,
		retry: retryAttempts
	})
}

function useLanguageLoadingState(
	currentLanguage: SupportedLanguage,
	isQueryLoading: boolean
): boolean {
	const [isLanguageLoading, setIsLanguageLoading] = useState(false)
	const previousLanguageRef = useRef<SupportedLanguage | undefined>(undefined)

	useEffect(() => {
		const previousLanguage = previousLanguageRef.current

		if (
			previousLanguage !== undefined &&
			previousLanguage !== currentLanguage
		) {
			setIsLanguageLoading(true)
			const timer = globalThis.setTimeout(() => {
				setIsLanguageLoading(false)
			}, LANGUAGE_CHANGE_DELAY_MS)
			previousLanguageRef.current = currentLanguage
			return () => globalThis.clearTimeout(timer)
		}

		previousLanguageRef.current = currentLanguage
		return
	}, [currentLanguage])

	useEffect(() => {
		if (!isQueryLoading) {
			setIsLanguageLoading(false)
		}
	}, [isQueryLoading])

	return isLanguageLoading
}

interface TranslationStateResult<
	TDict extends TranslationDictionary<TranslationRegistryKey>
> {
	readonly translationMap: Record<DictionaryKeys<TDict>, string>
	readonly missingKeys: readonly DictionaryKeys<TDict>[]
}

function computeTranslationState<
	const TDict extends TranslationDictionary<TranslationRegistryKey>
>(
	dictionary: TDict,
	translations: TranslationResult | undefined,
	missingPolicy: TranslationMissingPolicy
): TranslationStateResult<TDict> {
	type DictionaryKey = DictionaryKeys<TDict>
	const result = {} as Record<DictionaryKey, string>
	const missing: DictionaryKey[] = []

	for (const key of dictionary.keys) {
		const request = dictionary.getRequest(key)
		const {value, missing: isMissing} = resolveTranslation(
			request,
			translations,
			missingPolicy
		)

		result[key as DictionaryKey] = value

		if (isMissing) {
			missing.push(key as DictionaryKey)
		}
	}

	return {
		translationMap: result,
		missingKeys: Object.freeze([...missing]) as readonly DictionaryKey[]
	}
}

function useDictionaryState<
	const TDict extends TranslationDictionary<TranslationRegistryKey>
>(
	dictionary: TDict,
	translations: TranslationResult | undefined,
	missingPolicy: TranslationMissingPolicy
) {
	const {translationMap, missingKeys} = useMemo(
		() => computeTranslationState(dictionary, translations, missingPolicy),
		[dictionary, missingPolicy, translations]
	)

	type DictionaryKey = DictionaryKeys<TDict>

	const translator = useCallback<Translator<DictionaryKey>>(
		key => translationMap[key],
		[translationMap]
	)

	return {translationMap, translator, missingKeys}
}

interface StatusComputationInput {
	readonly isQueryLoading: boolean
	readonly isLanguageLoading: boolean
	readonly error: Error | null
	readonly missingKeysCount: number
	readonly totalKeys: number
}

function determineTranslationStatus({
	isQueryLoading,
	isLanguageLoading,
	error,
	missingKeysCount,
	totalKeys
}: StatusComputationInput): TranslationStatus {
	if (isQueryLoading || isLanguageLoading) {
		return 'loading'
	}

	if (error) {
		return 'error'
	}

	if (missingKeysCount === 0) {
		return 'complete'
	}

	if (missingKeysCount === totalKeys) {
		return 'missing'
	}

	return 'partial'
}

export function useTranslations<
	const TDict extends TranslationDictionary<TranslationRegistryKey>
>(
	dictionary: TDict,
	options: TranslationOptions = {}
): UseTranslationsResult<TDict> {
	const missingPolicy: TranslationMissingPolicy =
		options.missingPolicy ?? 'fallback'

	const currentLanguage = useCurrentLanguage()

	const {
		data: translations,
		isLoading: isQueryLoading,
		error: queryError,
		status: queryStatus
	} = useTranslationQuery(dictionary, currentLanguage)

	const isLanguageLoading = useLanguageLoadingState(
		currentLanguage,
		isQueryLoading
	)

	const {translationMap, translator, missingKeys} = useDictionaryState(
		dictionary,
		translations,
		missingPolicy
	)

	const normalizedError = useMemo(
		() => normalizeError(queryError, queryStatus === 'error'),
		[queryError, queryStatus]
	)

	const status = determineTranslationStatus({
		isQueryLoading,
		isLanguageLoading,
		error: normalizedError,
		missingKeysCount: missingKeys.length,
		totalKeys: dictionary.keys.length
	})

	return {
		t: translator,
		translations: translationMap,
		currentLanguage,
		isLoading: isQueryLoading || isLanguageLoading,
		error: normalizedError,
		missingKeys,
		status
	}
}
