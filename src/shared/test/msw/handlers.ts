import {delay, HttpResponse, http} from 'msw'
import {extractExerciseMetadata} from '@/entities/exercise'
import type {SupportedLanguage, TranslationsDatabase} from '@/shared/model'
import translationsDatabase from './data/translations.json' with {type: 'json'}
import {loadExercises} from './utils/loadExercises'

const translations = translationsDatabase as TranslationsDatabase

// Exercise registry - loaded dynamically from JSON files
const exerciseRegistry = loadExercises()

function normalizeTranslationKeys(keys: readonly string[]): string[] {
	return keys.map(key => key.trim()).filter(key => key.length > 0)
}

export const handlers = [
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
