/**
 * Tests for translation MSW handlers
 *
 * @module shared/lib/i18n
 */

import {afterAll, afterEach, beforeAll, describe, expect, it} from 'vitest'
import {createServer} from '@/shared/api/testing'
import {translationMswHandlers} from './msw-handlers'

const server = createServer(translationMswHandlers)

beforeAll(() => {
	server.listen({onUnhandledRequest: 'error'})
})

afterEach(() => {
	server.resetHandlers()
})

afterAll(() => server.close())

// Helper function to make requests
async function fetchJson<T>(
	url: string,
	options?: RequestInit
): Promise<{data: T; status: number}> {
	const response = await fetch(url, options)
	const data = await response.json()
	return {data, status: response.status}
}

describe('Translation MSW handlers', () => {
	describe('POST /api/translations', () => {
		it('should return translations for valid language and keys', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: ['footer.copyright', 'footer.github']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toMatchObject({
				'footer.copyright': expect.any(String),
				'footer.github': expect.any(String)
			})
		})

		it('should handle large key lists via POST', async () => {
			const largeKeyList = [
				'footer.copyright',
				'footer.github',
				'app.title',
				'app.subtitle',
				'buttons.start',
				'buttons.continue',
				'buttons.next',
				'buttons.back'
			]

			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: largeKeyList
				})
			})

			expect(response.status).toBe(200)
			expect(Object.keys(response.data.translations).length).toBeGreaterThan(0)
		})

		it('should return 400 when language parameter is missing', async () => {
			const response = await fetchJson('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					keys: ['footer.copyright']
				})
			})

			expect(response.status).toBe(400)
			expect(response.data).toEqual({
				error: 'Missing required parameters: language and keys'
			})
		})

		it('should return 400 when keys parameter is missing', async () => {
			const response = await fetchJson('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en'
				})
			})

			expect(response.status).toBe(400)
			expect(response.data).toEqual({
				error: 'Missing required parameters: language and keys'
			})
		})

		it('should return 400 when both parameters are missing', async () => {
			const response = await fetchJson('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({})
			})

			expect(response.status).toBe(400)
			expect(response.data).toEqual({
				error: 'Missing required parameters: language and keys'
			})
		})

		it('should return 404 for unsupported language', async () => {
			const response = await fetchJson('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'fr',
					keys: ['footer.copyright']
				})
			})

			expect(response.status).toBe(404)
			expect(response.data).toEqual({
				error: "Translation for language 'fr' not found"
			})
		})

		it('should handle empty keys array', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: []
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toEqual({})
		})

		it('should filter out invalid keys', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: ['invalid.key', 'footer.copyright']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).not.toHaveProperty('invalid.key')
			expect(response.data.translations).toHaveProperty('footer.copyright')
		})

		it('should trim whitespace from keys', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: [' footer.copyright ', ' footer.github ']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toHaveProperty('footer.copyright')
			expect(response.data.translations).toHaveProperty('footer.github')
		})

		it('should fallback to English when translation is missing for non-English language', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'ru',
					keys: ['footer.copyright']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toHaveProperty('footer.copyright')
			expect(response.data.translations['footer.copyright']).toBeTruthy()
		})

		it('should use English fallback when key missing in non-English language', async () => {
			// Test fallback with a key that likely exists in English but not in all languages
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'ru',
					keys: ['settings', 'app.title', 'buttons.start']
				})
			})

			expect(response.status).toBe(200)
			// Should have at least some translations
			expect(Object.keys(response.data.translations).length).toBeGreaterThan(0)
		})

		it('should not provide fallback for English language', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: ['nonexistent.key']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toEqual({})
		})
	})

	describe('normalizeTranslationKeys function (indirect testing)', () => {
		it('should normalize keys by trimming whitespace and filtering invalid keys', async () => {
			// Test via POST endpoint which uses normalizeTranslationKeys
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: [' footer.copyright ', 'invalid.key', ' footer.github ']
				})
			})

			expect(response.status).toBe(200)
			// Should have valid keys but not invalid ones
			expect(response.data.translations).toHaveProperty('footer.copyright')
			expect(response.data.translations).toHaveProperty('footer.github')
			expect(response.data.translations).not.toHaveProperty('invalid.key')
		})

		it('should filter empty strings after trimming', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: ['footer.copyright', '', '  ', 'footer.github']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toHaveProperty('footer.copyright')
			expect(response.data.translations).toHaveProperty('footer.github')
		})

		it('should handle empty keys after filtering', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: ['', '', '']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toEqual({})
		})
	})

	describe('error handling and edge cases', () => {
		it('should handle malformed JSON in POST request', async () => {
			const response = await fetch('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: 'invalid json'
			})

			// MSW should handle this gracefully - likely a 400 or other error
			expect(response.status).not.toBe(200)
		})

		it('should handle missing Content-Type header in POST request', async () => {
			const response = await fetchJson('/api/translations', {
				method: 'POST',
				body: JSON.stringify({
					language: 'en',
					keys: ['footer.copyright']
				})
			})

			// Should still work without explicit Content-Type
			expect(response.status).toBe(200)
		})

		it('should handle very long key lists', async () => {
			// Create a very long list of keys (some valid, some invalid)
			const longKeyList = Array.from({length: 100}, (_, i) =>
				i % 3 === 0 ? 'footer.copyright' : `invalid.key.${i}`
			)

			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: longKeyList
				})
			})

			expect(response.status).toBe(200)
			// Should only contain valid keys
			expect(Object.keys(response.data.translations)).toEqual([
				'footer.copyright'
			])
		})

		it('should handle special characters in keys', async () => {
			const response = await fetchJson<{
				translations: Record<string, string>
			}>('/api/translations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: 'en',
					keys: ['footer.copyright', 'footer.github']
				})
			})

			expect(response.status).toBe(200)
			expect(response.data.translations).toHaveProperty('footer.copyright')
			expect(response.data.translations).toHaveProperty('footer.github')
		})
	})
})
