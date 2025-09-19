import {delay, HttpResponse, http} from 'msw'
import {validateWordFormExercise} from '@/schemas/exercises'
import {extractExerciseMetadata} from '@/utils/exercises'
import verbsBeExercise from './data/exercises/verbs-be.json' with {type: 'json'}
import verbsHaveExercise from './data/exercises/verbs-have.json' with {
	type: 'json'
}
import commonTexts from './data/texts/common.json' with {type: 'json'}
import elTranslations from './data/translations/el.json' with {type: 'json'}
import enTranslations from './data/translations/en.json' with {type: 'json'}
import ruTranslations from './data/translations/ru.json' with {type: 'json'}

const translations = {
	en: enTranslations,
	ru: ruTranslations,
	el: elTranslations
}

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
	http.get('/api/texts/common', async () => {
		await delay('real')
		return HttpResponse.json(commonTexts)
	}),

	http.get('/api/translations/:lang', async ({params}) => {
		await delay('real')
		const {lang} = params
		const translation = translations[lang as keyof typeof translations]

		if (!translation) {
			return HttpResponse.json(
				{error: `Translation for language '${lang}' not found`},
				{status: 404}
			)
		}

		return HttpResponse.json(translation)
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
