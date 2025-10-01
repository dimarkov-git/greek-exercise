/**
 * Exercise fallback resolver for offline-first HTTP client
 *
 * Provides fallback responses for exercise API requests when
 * network is unavailable or MSW is enabled.
 *
 * @module entities/exercise/api
 */

import type {FallbackResolver} from '@/shared/api/fallback'
import {extractExerciseMetadata} from '../lib/exercises'
import {toWordFormExerciseWithDefaults} from '../model/adapters'
import type {WordFormExerciseDto} from '../model/schemas'
import {validateWordFormExercise} from '../model/schemas'

const exerciseModules = import.meta.glob(
	'@/shared/test/msw/data/exercises/*.json',
	{
		eager: true,
		import: 'default'
	}
)

const exerciseRegistry = new Map<
	string,
	ReturnType<typeof toWordFormExerciseWithDefaults>
>()

// Build exercise registry from JSON files
for (const moduleExport of Object.values(exerciseModules)) {
	const exerciseDto = moduleExport as WordFormExerciseDto
	const validated = validateWordFormExercise(exerciseDto)
	const normalized = toWordFormExerciseWithDefaults(validated)
	exerciseRegistry.set(normalized.id, normalized)
}

function listExercises() {
	return Array.from(exerciseRegistry.values())
		.filter(exercise => exercise.enabled)
		.map(exercise => extractExerciseMetadata(exercise))
		.sort((a, b) => a.title.localeCompare(b.title))
}

function getExerciseById(id: string) {
	return exerciseRegistry.get(id)
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
