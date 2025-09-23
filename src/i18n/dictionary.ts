import type {TranslationRequest} from '@/types/translations'
import type {TranslationRegistryKey} from './generated/translation-registry'
import {
	TRANSLATION_REGISTRY_KEYS,
	translationRegistry
} from './generated/translation-registry'

export interface TranslationDictionary<TKey extends TranslationRegistryKey> {
	readonly keys: readonly TKey[]
	readonly lookupKeys: readonly TKey[]
	readonly requests: readonly TranslationRequest[]
	readonly cacheKey: string
	getRequest(key: TKey): TranslationRequest
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

export function createTranslationDictionary<
	const TKeys extends readonly TranslationRegistryKey[]
>(keys: TKeys): TranslationDictionary<TKeys[number]> {
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

	return {
		keys: frozenKeys,
		lookupKeys: frozenKeys,
		requests: frozenRequests,
		cacheKey: normalizedKeys.join('|'),
		getRequest(key: TKeys[number]) {
			const request = requestMap.get(key)

			if (!request) {
				throw new Error(
					`Translation request for key "${key}" was not initialised.`
				)
			}

			return request
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
	return createTranslationDictionary(mergedKeys as TranslationRegistryKey[])
}

export const ALL_TRANSLATION_KEYS = TRANSLATION_REGISTRY_KEYS
