import {delay, HttpResponse, http} from 'msw'
import {validateWordFormExercise} from '@/schemas/exercises'
import type {
	SupportedLanguage,
	TranslationsDatabase
} from '@/types/translations'
import {extractExerciseMetadata} from '@/utils/exercises'
import verbsBeExercise from './data/exercises/verbs-be.json' with {type: 'json'}
import verbsHaveExercise from './data/exercises/verbs-have.json' with {
	type: 'json'
}
import translationsDatabase from './data/translations.json' with {type: 'json'}

const translations = translationsDatabase as TranslationsDatabase

// Exercise registry - in a real app this would be loaded dynamically
const exerciseRegistry = new Map()

// Register available exercises
try {
	const validatedExercise = validateWordFormExercise(verbsBeExercise)
	exerciseRegistry.set(validatedExercise.id, validatedExercise)
} catch {
	// Exercise validation failed - skip this exercise silently
}

try {
	const validatedExercise = validateWordFormExercise(verbsHaveExercise)
	exerciseRegistry.set(validatedExercise.id, validatedExercise)
} catch {
	// Exercise validation failed - skip this exercise silently
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

		const requestedKeys = keysParam.split(',')
		const languageTranslations = translations[lang]

		if (!languageTranslations) {
			return HttpResponse.json(
				{error: `Translation for language '${lang}' not found`},
				{status: 404}
			)
		}

		// Filter only requested keys
		const filteredTranslations: Record<string, string> = {}
		for (const key of requestedKeys) {
			if (languageTranslations[key]) {
				filteredTranslations[key] = languageTranslations[key]
			} else if (lang !== 'en' && translations.en[key]) {
				// Try English fallback if available and not already English
				filteredTranslations[key] = translations.en[key]
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
		const filteredTranslations: Record<string, string> = {}
		for (const key of keys) {
			if (languageTranslations[key]) {
				filteredTranslations[key] = languageTranslations[key]
			} else if (language !== 'en' && translations.en[key]) {
				// Try English fallback if available and not already English
				filteredTranslations[key] = translations.en[key]
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
