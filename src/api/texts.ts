import * as v from 'valibot'

// Schema for common interface texts
const CommonTexts = v.object({
	navigation: v.object({
		home: v.string(),
		library: v.string(),
		builder: v.string(),
		profile: v.string()
	}),
	buttons: v.object({
		start: v.string(),
		continue: v.string(),
		next: v.string(),
		back: v.string(),
		save: v.string(),
		cancel: v.string(),
		edit: v.string(),
		delete: v.string(),
		create: v.string()
	}),
	forms: v.object({
		required: v.string(),
		invalid: v.string(),
		saved: v.string(),
		loading: v.string()
	}),
	messages: v.object({
		welcome: v.string(),
		error: v.string(),
		success: v.string(),
		noData: v.string()
	})
})

export type CommonTexts = v.InferOutput<typeof CommonTexts>

// Schema for translations (key-value pairs)
const Translations = v.record(v.string(), v.string())
export type Translations = v.InferOutput<typeof Translations>

// Supported languages
export type SupportedLanguage = 'en' | 'ru' | 'el'

export async function getCommonTexts(): Promise<CommonTexts> {
	const response = await fetch('/api/texts/common')
	if (!response.ok) {
		throw new Error('Failed to fetch common texts')
	}
	return v.parse(CommonTexts, await response.json())
}

export async function getTranslations(
	lang: SupportedLanguage
): Promise<Translations> {
	const response = await fetch(`/api/translations/${lang}`)
	if (!response.ok) {
		throw new Error(`Failed to fetch translations for language: ${lang}`)
	}
	return v.parse(Translations, await response.json())
}
