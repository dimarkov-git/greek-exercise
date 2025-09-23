import type {TranslationRegistryKey} from '@/i18n/generated/translation-registry'

export type SupportedLanguage = 'en' | 'ru' | 'el'

export type TranslationMissingPolicy = 'fallback' | 'key'

export interface TranslationRequest {
	readonly key: TranslationRegistryKey
	readonly fallback: string
}

export interface TranslationOptions {
	readonly missingPolicy?: TranslationMissingPolicy
}

export type TranslationResult = Partial<Record<TranslationRegistryKey, string>>

export type LanguageTranslations = Partial<
	Record<TranslationRegistryKey, string>
>

export interface TranslationsDatabase {
	readonly en: LanguageTranslations
	readonly ru: LanguageTranslations
	readonly el: LanguageTranslations
}

export type TranslationStatus =
	| 'loading'
	| 'error'
	| 'complete'
	| 'partial'
	| 'missing'
