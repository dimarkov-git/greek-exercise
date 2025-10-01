import type {SupportedLanguage} from '@/shared/model'

export interface TranslationEntry {
	/**
	 * Key for service request (optional)
	 * If not provided, no service request is made (uses only inline translations)
	 */
	key?: string

	/**
	 * Inline fallback translations for different languages
	 */
	translations?: Partial<Record<SupportedLanguage, string>>

	/**
	 * Ultimate fallback value when no translation is found
	 * If not provided, uses a key or dictionary key as fallback
	 */
	fallback?: string

	/**
	 * Default language to use if app language not found in translations
	 * Overrides app language for this specific entry
	 */
	defaultLanguage?: SupportedLanguage
}

/**
 * Translation dictionary value can be:
 * - string: service key (requests from service, key as fallback)
 * - TranslationEntry: full entry with an optional service key and inline translations
 */
export type TranslationDictionary = Record<string, string | TranslationEntry>
