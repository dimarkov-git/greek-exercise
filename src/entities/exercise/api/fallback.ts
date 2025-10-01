/**
 * Exercise fallback resolver for offline-first HTTP client
 *
 * Provides fallback responses for exercise API requests when
 * network is unavailable or MSW is enabled.
 *
 * @module entities/exercise/api
 */

import type {FallbackResolver} from '@/shared/api'
import {extractExerciseMetadata} from '../lib/exercises'
import {getAllExercises, getExerciseById} from '../model/data'

function listExercises() {
	return getAllExercises()
		.filter(exercise => exercise.enabled)
		.map(exercise => extractExerciseMetadata(exercise))
		.sort((a, b) => a.title.localeCompare(b.title))
}

const EXERCISE_ID_PATTERN = /^\/api\/exercises\/(.+)$/

function resolveExercisesCollectionRequest(method: string) {
	if (method !== 'GET') {
		return
	}

	return {type: 'success', data: listExercises()} as const
}

function resolveExerciseDetailRequest(id: string) {
	const exercise = getExerciseById(id)

	if (!exercise) {
		return {
			type: 'error' as const,
			status: 404,
			message: `Exercise ${id} not found`
		}
	}

	if (!exercise.enabled) {
		return {
			type: 'error' as const,
			status: 403,
			message: `Exercise ${id} is not available`
		}
	}

	return {type: 'success' as const, data: exercise}
}

/**
 * Creates a fallback resolver for exercise API requests
 *
 * Handles GET requests to:
 * - `/api/exercises` - list all enabled exercises
 * - `/api/exercises/:id` - get exercise by ID
 *
 * @returns Fallback resolver for exercises
 *
 * @example
 * ```typescript
 * const resolver = createExerciseFallbackResolver()
 * const result = resolver({
 *   url: new URL('/api/exercises', window.location.origin),
 *   method: 'GET'
 * })
 * ```
 */
export function createExerciseFallbackResolver(): FallbackResolver {
	return ({url, method}) => {
		if (!url.pathname.startsWith('/api/exercises')) {
			return
		}

		if (url.pathname === '/api/exercises') {
			return resolveExercisesCollectionRequest(method)
		}

		if (method !== 'GET') {
			return
		}

		const match = url.pathname.match(EXERCISE_ID_PATTERN)

		if (!match) {
			return
		}

		const exerciseId = match[1]

		if (!exerciseId) {
			return
		}

		return resolveExerciseDetailRequest(exerciseId)
	}
}
