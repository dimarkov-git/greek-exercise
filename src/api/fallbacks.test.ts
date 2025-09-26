import {afterEach, describe, expect, it, vi} from 'vitest'

type FallbackModule = typeof import('./fallbacks')

afterEach(() => {
	vi.resetModules()
	vi.doUnmock('@/mocks/data/translations.json')
	vi.doUnmock('@/domain/exercises/adapters')
})

function loadFallbacks() {
	return import('./fallbacks') as Promise<FallbackModule>
}

describe('resolveFallbackResponse', () => {
	describe('translations API', () => {
		it('returns trimmed translations for GET requests', async () => {
			const {resolveFallbackResponse} = await loadFallbacks()
			const url = new URL(
				'https://example.com/api/translations?lang=ru&keys= app.title ,unknown, '
			)

			const result = resolveFallbackResponse({
				url,
				method: 'GET'
			})

			expect(result).toEqual({
				type: 'success',
				data: {
					translations: {
						'app.title': expect.any(String)
					}
				}
			})
		})

		it('falls back to English translations when requested language lacks entries', async () => {
			vi.doMock('@/mocks/data/translations.json', () => ({
				default: {
					en: {'app.title': 'English title'},
					ru: {}
				}
			}))

			const {resolveFallbackResponse} = await loadFallbacks()
			const result = resolveFallbackResponse({
				url: new URL('https://example.com/api/translations'),
				method: 'POST',
				body: {language: 'ru', keys: ['app.title']}
			})

			expect(result).toEqual({
				type: 'success',
				data: {
					translations: {
						'app.title': 'English title'
					}
				}
			})
		})
	})

	describe('exercises API', () => {
		it('lists enabled exercises ordered alphabetically', async () => {
			const {resolveFallbackResponse} = await loadFallbacks()
			const result = resolveFallbackResponse({
				url: new URL('https://example.com/api/exercises'),
				method: 'GET'
			})

			expect(result?.type).toBe('success')
			if (result?.type === 'success') {
				expect(Array.isArray(result.data)).toBe(true)
				const metadata = result.data as Array<{title: string}>
				const sorted = [...metadata].sort((a, b) =>
					a.title.localeCompare(b.title)
				)

				expect(metadata).toEqual(sorted)
			}
		})

		it('returns 404 when exercise is not found', async () => {
			const {resolveFallbackResponse} = await loadFallbacks()
			const result = resolveFallbackResponse({
				url: new URL('https://example.com/api/exercises/non-existent'),
				method: 'GET'
			})

			expect(result).toEqual({
				type: 'error',
				status: 404,
				message: 'Exercise non-existent not found'
			})
		})

		it('returns 403 when exercise is disabled', async () => {
			vi.doMock('@/domain/exercises/adapters', async () => {
				const actual = await vi.importActual<
					typeof import('@/domain/exercises/adapters')
				>('@/domain/exercises/adapters')

				return {
					...actual,
					toWordFormExerciseWithDefaults: (exercise: unknown) => {
						const normalized = actual.toWordFormExerciseWithDefaults(
							exercise as Parameters<
								typeof actual.toWordFormExerciseWithDefaults
							>[0]
						)

						if (normalized.id === 'verbs-be') {
							return {...normalized, enabled: false}
						}

						return normalized
					}
				}
			})

			const {resolveFallbackResponse} = await loadFallbacks()
			const result = resolveFallbackResponse({
				url: new URL('https://example.com/api/exercises/verbs-be'),
				method: 'GET'
			})

			expect(result).toEqual({
				type: 'error',
				status: 403,
				message: 'Exercise verbs-be is not available'
			})
		})
	})
})
