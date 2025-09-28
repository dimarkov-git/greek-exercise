import {describe, expect, it} from 'vitest'
import {
	createTranslationDictionary,
	mergeTranslationDictionaries
} from '@/shared/lib/i18n/dictionary'
import type {TranslationRegistryKey} from '@/shared/lib/i18n/generated/translation-registry'

describe('createTranslationDictionary', () => {
	it('deduplicates keys and exposes deterministic requests', () => {
		const dictionary = createTranslationDictionary([
			'app.title',
			'app.title',
			'app.subtitle'
		] as const)

		expect(dictionary.keys).toEqual(['app.title', 'app.subtitle'])
		expect(dictionary.lookupKeys).toEqual(['app.title', 'app.subtitle'])
		expect(dictionary.cacheKey).toBe('app.title|app.subtitle')
		expect(dictionary.requests).toHaveLength(2)

		const titleRequest = dictionary.getRequest('app.title')
		const subtitleRequest = dictionary.getRequest('app.subtitle')

		expect(titleRequest).toEqual({key: 'app.title', fallback: 'Learn Greek'})
		expect(subtitleRequest).toEqual({
			key: 'app.subtitle',
			fallback: 'Interactive exercises for learning Greek language'
		})
	})

	it('throws when accessing an uninitialised request', () => {
		const dictionary = createTranslationDictionary(['app.title'] as const)

		expect(() => dictionary.getRequest('ui.hashSymbol' as never)).toThrow(
			'Translation request for key "ui.hashSymbol" was not initialised.'
		)
	})

	it('rejects keys that are not registered in the translation registry', () => {
		expect(() =>
			createTranslationDictionary([
				'missing.translation.key' as TranslationRegistryKey
			])
		).toThrow('Translation key "missing.translation.key" is not registered.')
	})
})

describe('mergeTranslationDictionaries', () => {
	it('combines dictionaries while preserving normalised keys', () => {
		const headerDictionary = createTranslationDictionary(['app.title'] as const)
		const footerDictionary = createTranslationDictionary([
			'footer.github'
		] as const)

		const merged = mergeTranslationDictionaries(
			headerDictionary,
			footerDictionary
		)

		expect(merged.keys).toEqual(['app.title', 'footer.github'])
		expect(merged.getRequest('footer.github')).toEqual({
			key: 'footer.github',
			fallback: 'GitHub'
		})
	})
})
