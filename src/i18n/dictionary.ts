import type {SupportedLanguage, TranslationRequest} from '@/types/translations'
import type {TranslationRegistryKey} from './generated/translation-registry'
import {
	TRANSLATION_REGISTRY_KEYS,
	translationRegistry
} from './generated/translation-registry'

export type FixedLanguageMap<TKey extends TranslationRegistryKey> = Partial<
	Record<TKey, SupportedLanguage>
>

export interface TranslationDictionary<TKey extends TranslationRegistryKey> {
	readonly keys: readonly TKey[]
	readonly lookupKeys: readonly TKey[]
	readonly requests: readonly TranslationRequest[]
	readonly cacheKey: string
	readonly fixedLanguageKeys: FixedLanguageMap<TKey>
	getRequest(key: TKey): TranslationRequest
	getFixedLanguage(key: TKey): SupportedLanguage | undefined
}

export type DictionaryKeys<
	TDictionary extends TranslationDictionary<TranslationRegistryKey>
> = TDictionary['keys'][number]

export type Translator<TKey extends TranslationRegistryKey> = (
	key: TKey
) => string

function assertValidKey(
	key: TranslationRegistryKey
): asserts key is TranslationRegistryKey {
	if (!translationRegistry[key]) {
		throw new Error(`Translation key "${key}" is not registered.`)
	}
}

export interface TranslationDictionaryOptions<
	TKey extends TranslationRegistryKey
> {
	readonly fixedLanguageKeys?: FixedLanguageMap<TKey>
}

export function createTranslationDictionary<
	const TKeys extends readonly TranslationRegistryKey[]
>(
	keys: TKeys,
	options: TranslationDictionaryOptions<TKeys[number]> = {}
): TranslationDictionary<TKeys[number]> {
	keys.forEach(assertValidKey)

	const normalizedKeys = Array.from(new Set(keys)) as TKeys[number][]
	const requests = normalizedKeys.map(requestKey => {
		const entry = translationRegistry[requestKey]

		return {
			key: requestKey,
			fallback: entry.fallback
		} satisfies TranslationRequest
	})

	const requestMap = new Map(requests.map(request => [request.key, request]))
	const frozenKeys = Object.freeze([
		...normalizedKeys
	]) as readonly TKeys[number][]
	const frozenRequests = Object.freeze([
		...requests
	]) as readonly TranslationRequest[]
	const fixedLanguageKeys = Object.freeze({
		...options.fixedLanguageKeys
	}) as FixedLanguageMap<TKeys[number]>

	return {
		keys: frozenKeys,
		lookupKeys: frozenKeys,
		requests: frozenRequests,
		cacheKey: normalizedKeys.join('|'),
		fixedLanguageKeys,
		getRequest(key: TKeys[number]) {
			const request = requestMap.get(key)

			if (!request) {
				throw new Error(
					`Translation request for key "${key}" was not initialised.`
				)
			}

			return request
		},
		getFixedLanguage(key: TKeys[number]) {
			return fixedLanguageKeys[key]
		}
	}
}

export function mergeTranslationDictionaries<
	const TDictionaries extends
		readonly TranslationDictionary<TranslationRegistryKey>[]
>(
	...dictionaries: TDictionaries
): TranslationDictionary<DictionaryKeys<TDictionaries[number]>> {
	const mergedKeys = dictionaries.flatMap(dictionary => dictionary.keys)
	const mergedFixedLanguageKeys: FixedLanguageMap<TranslationRegistryKey> = {}
	for (const dictionary of dictionaries) {
		Object.assign(mergedFixedLanguageKeys, dictionary.fixedLanguageKeys)
	}

	return createTranslationDictionary(mergedKeys as TranslationRegistryKey[], {
		fixedLanguageKeys: mergedFixedLanguageKeys
	})
}

export const ALL_TRANSLATION_KEYS = TRANSLATION_REGISTRY_KEYS
