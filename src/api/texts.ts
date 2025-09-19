import * as v from 'valibot'

// Schema for translations (key-value pairs)
const Translations = v.record(v.string(), v.string())
export type Translations = v.InferOutput<typeof Translations>

// Supported languages
export type SupportedLanguage = 'en' | 'ru' | 'el'

export async function getTranslations(
	lang: SupportedLanguage
): Promise<Translations> {
	const response = await fetch(`/api/translations/${lang}`)
	if (!response.ok) {
		throw new Error(`Failed to fetch translations for language: ${lang}`)
	}
	return v.parse(Translations, await response.json())
}
