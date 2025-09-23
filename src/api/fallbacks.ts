import {toWordFormExerciseWithDefaults} from '@/domain/exercises/adapters'
import translationsData from '@/mocks/data/translations.json' with {
	type: 'json'
}
import type {WordFormExerciseDto} from '@/schemas/exercises'
import {validateWordFormExercise} from '@/schemas/exercises'
import type {
	SupportedLanguage,
	TranslationsDatabase
} from '@/types/translations'
import {extractExerciseMetadata} from '@/utils/exercises'

const exerciseModules = import.meta.glob('../mocks/data/exercises/*.json', {
	eager: true,
	import: 'default'
})

const translations = translationsData as TranslationsDatabase

const exerciseRegistry = new Map<
	string,
	ReturnType<typeof toWordFormExerciseWithDefaults>
>()

for (const moduleExport of Object.values(exerciseModules)) {
	const exerciseDto = moduleExport as WordFormExerciseDto
	const validated = validateWordFormExercise(exerciseDto)
	const normalized = toWordFormExerciseWithDefaults(validated)
	exerciseRegistry.set(normalized.id, normalized)
}

function resolveTranslations(
	language: SupportedLanguage,
	keys: string[]
): Record<string, string> {
	const languageTranslations = translations[language]

	if (!languageTranslations) {
		return {}
	}

	const filtered: Record<string, string> = {}

	for (const key of keys) {
		if (languageTranslations[key]) {
			filtered[key] = languageTranslations[key]
			continue
		}

		if (language !== 'en' && translations.en[key]) {
			filtered[key] = translations.en[key]
		}
	}

	return filtered
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

interface FallbackRequestContext {
	url: URL
	method: string
	body?: unknown
}

const EXERCISE_ID_PATTERN = /^\/api\/exercises\/(.+)$/

function resolveTranslationsRequest(
	url: URL,
	method: string,
	body: unknown
):
	| {type: 'success'; data: unknown}
	| {type: 'error'; status: number; message: string}
	| undefined {
	if (url.pathname !== '/api/translations') {
		return
	}

	if (method === 'GET') {
		const lang = url.searchParams.get('lang') as SupportedLanguage | null
		const keysParam = url.searchParams.get('keys')

		if (!(lang && keysParam)) {
			return {type: 'success', data: {translations: {}}}
		}

		const keys = keysParam.split(',')
		return {
			type: 'success',
			data: {translations: resolveTranslations(lang, keys)}
		}
	}

	if (method === 'POST' && body && typeof body === 'object') {
		const {language, keys} = body as {
			language?: SupportedLanguage
			keys?: string[]
		}

		if (!(language && Array.isArray(keys))) {
			return {type: 'success', data: {translations: {}}}
		}

		return {
			type: 'success',
			data: {translations: resolveTranslations(language, keys)}
		}
	}

	return
}

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

function resolveExerciseRequest(url: URL, method: string) {
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

export function resolveFallbackResponse({
	url,
	method,
	body
}: FallbackRequestContext):
	| {type: 'success'; data: unknown}
	| {type: 'error'; status: number; message: string}
	| undefined {
	return (
		resolveTranslationsRequest(url, method, body) ??
		resolveExerciseRequest(url, method) ??
		undefined
	)
}
