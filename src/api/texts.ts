import * as v from 'valibot'
import {requestJson} from './httpClient'

const Translations = v.record(v.string(), v.string())
export type Translations = v.InferOutput<typeof Translations>

export type SupportedLanguage = 'en' | 'ru' | 'el'

interface TranslationsResponse {
	translations: Translations
}

export async function getTranslations(
	language: SupportedLanguage,
	keys: string[]
): Promise<Translations> {
	const response = await requestJson<
		TranslationsResponse,
		{
			language: SupportedLanguage
			keys: string[]
		}
	>('/api/translations', {
		method: 'POST',
		body: {
			language,
			keys
		}
	})

	return v.parse(Translations, response.translations)
}
