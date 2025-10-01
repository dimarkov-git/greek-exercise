/**
 * MSW handlers for exercise API endpoints
 *
 * Provides mock responses for exercise-related HTTP requests.
 * Can be used in development, testing, and production (offline mode).
 *
 * @module entities/exercise/api
 */

import {delay, HttpResponse, http} from 'msw'
import {extractExerciseMetadata} from '../lib/exercises'
import {getAllExercises, getExerciseById} from '../model/data'

export const exerciseMswHandlers = [
	// Get list of exercises (metadata only)
	http.get('/api/exercises', async () => {
		await delay('real')

		const exercises = getAllExercises()
			.filter(exercise => exercise.enabled)
			.map(exercise => extractExerciseMetadata(exercise))
			.sort((a, b) => a.title.localeCompare(b.title))

		return HttpResponse.json(exercises)
	}),

	// Get specific exercise by ID
	http.get('/api/exercises/:id', async ({params}) => {
		await delay('real')
		const {id} = params

		const exercise = getExerciseById(id as string)

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
