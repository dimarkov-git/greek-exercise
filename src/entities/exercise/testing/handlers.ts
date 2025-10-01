import {delay, HttpResponse, http} from 'msw'
import {extractExerciseMetadata} from '../lib/exercises'
import {loadExercises} from './loadExercises'

/**
 * Exercise-related MSW handlers
 *
 * @module entities/exercise/testing/handlers
 */

// Exercise registry - loaded dynamically from JSON files
const exerciseRegistry = loadExercises()

export const exerciseHandlers = [
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
