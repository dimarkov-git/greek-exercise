export * from './dictionaries'
export * from './dictionary'
export * from './generated/translation-registry'
export type {
	LoadTranslationsOptions,
	LoadTranslationsResult
} from './loadTranslations'
export {loadTranslations} from './loadTranslations'
export type {
	AutonomousTranslationDictionary,
	TranslationEntry
} from './translation-types'
export {useTranslations} from './useTranslations'
