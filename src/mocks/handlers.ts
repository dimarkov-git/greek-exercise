import {delay, HttpResponse, http} from 'msw'
import type {TranslationRegistryKey} from '@/i18n/generated/translation-registry'
import {translationRegistry} from '@/i18n/generated/translation-registry'
import type {
	SupportedLanguage,
	TranslationsDatabase
} from '@/types/translations'
import {extractExerciseMetadata} from '@/utils/exercises'
import translationsDatabase from './data/translations.json' with {type: 'json'}
import {loadExercises} from './utils/loadExercises'

const translations = translationsDatabase as TranslationsDatabase

// Exercise registry - loaded dynamically from JSON files
const exerciseRegistry = loadExercises()

function normalizeTranslationKeys(
	keys: readonly string[]
): TranslationRegistryKey[] {
	return keys
		.map(key => key.trim())
		.filter((key): key is TranslationRegistryKey => key in translationRegistry)
}

export const handlers = [
	// New translation endpoint with key filtering
	http.get('/api/translations', async ({request}) => {
		await delay('real')
		const url = new URL(request.url)
		const lang = url.searchParams.get('lang') as SupportedLanguage
		const keysParam = url.searchParams.get('keys')

		if (!(lang && keysParam)) {
			return HttpResponse.json(
				{error: 'Missing required parameters: lang and keys'},
				{status: 400}
			)
		}

		const requestedKeys = normalizeTranslationKeys(keysParam.split(','))
		const languageTranslations = translations[lang]

		if (!languageTranslations) {
			return HttpResponse.json(
				{error: `Translation for language '${lang}' not found`},
				{status: 404}
			)
		}

		// Filter only requested keys
		const filteredTranslations: Partial<
			Record<TranslationRegistryKey, string>
		> = {}
		for (const key of requestedKeys) {
			const value = languageTranslations[key]

			if (typeof value === 'string') {
				filteredTranslations[key] = value
			} else if (lang !== 'en') {
				const fallbackValue = translations.en?.[key]

				if (typeof fallbackValue === 'string') {
					filteredTranslations[key] = fallbackValue
				}
			}
		}

		return HttpResponse.json({translations: filteredTranslations})
	}),

	// POST endpoint for large key lists
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
		const filteredTranslations: Partial<
			Record<TranslationRegistryKey, string>
		> = {}

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
	}),

	// Get list of exercises (metadata only)
	http.get('/api/exercises', async () => {
		await delay('real')

		const exercises = Array.from(exerciseRegistry.values())
			.filter(exercise => exercise.enabled)
			.map(exercise => extractExerciseMetadata(exercise))
			.sort((a, b) => a.title.localeCompare(b.title))

		return HttpResponse.json(exercises)
	}),

	// Get specific exercise by ID
	http.get('/api/exercises/:id', async ({params}) => {
		await delay('real')
		const {id} = params

		const exercise = exerciseRegistry.get(id as string)

		if (!exercise) {
			return HttpResponse.json(
				{error: `Exercise with id '${id}' not found`},
				{status: 404}
			)
		}

		if (!exercise.enabled) {
			return HttpResponse.json(
				{error: `Exercise '${id}' is not available`},
				{status: 403}
			)
		}

		return HttpResponse.json(exercise)
	})
]
