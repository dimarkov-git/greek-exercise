export type SupportedLanguage = 'en' | 'ru' | 'el'

export type TranslationMissingPolicy = 'fallback' | 'key'

export interface TranslationRequest {
	readonly key: string
	readonly fallback: string
}

export interface TranslationOptions {
	readonly missingPolicy?: TranslationMissingPolicy
}

export type TranslationResult = Record<string, string>

export type LanguageTranslations = Record<string, string>

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
