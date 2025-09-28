import {renderHook} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {createTranslationDictionary} from '@/shared/lib/i18n/dictionary'

type QueryModule = typeof import('@tanstack/react-query')
type DictionaryKeys = Parameters<typeof createTranslationDictionary>[0]

async function loadUseTranslations() {
	const module = await import('@/shared/lib/i18n')
	return module.useTranslations
}

function mockUseQueryError(errorValue: unknown) {
	vi.doMock('@tanstack/react-query', async () => {
		const actual = await vi.importActual<QueryModule>('@tanstack/react-query')

		return {
			...actual,
			useQuery: () => ({
				data: undefined,
				isLoading: false,
				error: errorValue,
				status: 'error' as const
			})
		}
	})
}

async function renderUseTranslations(keys: DictionaryKeys) {
	const useTranslations = await loadUseTranslations()
	const dictionary = createTranslationDictionary(keys)
	return renderHook(() => useTranslations(dictionary))
}

describe('useTranslations error normalisation', () => {
	afterEach(() => {
		vi.doUnmock('@tanstack/react-query')
		vi.resetModules()
		vi.clearAllMocks()
	})

	it('surfaces existing Error instances from query results', async () => {
		mockUseQueryError(new Error('Service unavailable'))

		const {result, unmount} = await renderUseTranslations([
			'app.title',
			'app.subtitle'
		] as const)

		expect(result.current.status).toBe('error')
		expect(result.current.error?.message).toBe('Service unavailable')
		expect(result.current.missingKeys).toEqual(['app.title', 'app.subtitle'])

		unmount()
	})

	it('converts non-error rejection values into Error instances', async () => {
		mockUseQueryError('server crashed')

		const {result, unmount} = await renderUseTranslations([
			'app.title'
		] as const)

		expect(result.current.status).toBe('error')
		expect(result.current.error?.message).toBe('server crashed')
		expect(result.current.missingKeys).toEqual(['app.title'])

		unmount()
	})
})
