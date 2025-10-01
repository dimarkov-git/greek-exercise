export * as translationData from './data'
export {createTranslationsFallbackResolver} from './fallback'
export type {
	LoadTranslationsOptions,
	LoadTranslationsResult
} from './loadTranslations'
export {loadTranslations} from './loadTranslations'
export {translationMswHandlers} from './msw-handlers'
export type {
	TranslationDictionary,
	TranslationEntry
} from './translation-types'
