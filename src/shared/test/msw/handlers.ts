import {delay, HttpResponse, http} from 'msw'
import type {SupportedLanguage, TranslationsDatabase} from '@/shared/model'
import {translationsDatabase as translationsData} from './data'

const translations = translationsData as TranslationsDatabase

function normalizeTranslationKeys(keys: readonly string[]): string[] {
	return keys.map(key => key.trim()).filter(key => key.length > 0)
}

export const translationHandlers = [
	// Translation endpoint using POST method
	http.post('/api/translations', async ({request}) => {
		await delay('real')
		const body = await request.json()
		const {language, keys} = body as {
			language: SupportedLanguage
			keys: string[]
		}

		if (!(language && keys)) {
			return HttpResponse.json(
				{error: 'Missing required parameters: language and keys'},
				{status: 400}
			)
		}

		const languageTranslations = translations[language]

		if (!languageTranslations) {
			return HttpResponse.json(
				{error: `Translation for language '${language}' not found`},
				{status: 404}
			)
		}

		// Filter only requested keys
		const normalizedKeys = normalizeTranslationKeys(keys)
		const filteredTranslations: Record<string, string> = {}

		for (const key of normalizedKeys) {
			const value = languageTranslations[key]

			if (typeof value === 'string') {
				filteredTranslations[key] = value
			} else if (language !== 'en') {
				const fallbackValue = translations.en?.[key]

				if (typeof fallbackValue === 'string') {
					filteredTranslations[key] = fallbackValue
				}
			}
		}

		return HttpResponse.json({translations: filteredTranslations})
	})
]

// Default handlers export for backward compatibility
export const handlers = translationHandlers
