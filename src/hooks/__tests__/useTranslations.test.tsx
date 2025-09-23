import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {renderHook, waitFor} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {requestJson} from '@/api/httpClient'
import {useTranslations} from '@/hooks/useTranslations'
import {createTranslationDictionary} from '@/i18n/dictionary'
import {useSettingsStore} from '@/stores/settings'
import {DEFAULT_SETTINGS} from '@/types/settings'

vi.mock('@/api/httpClient', () => ({
	requestJson: vi.fn()
}))

const mockedRequestJson = vi.mocked(requestJson)

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	})

	const WrapperComponent = ({children}: {children: React.ReactNode}) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)

	return {queryClient, wrapper: WrapperComponent}
}

const dictionary = createTranslationDictionary([
	'app.title',
	'app.subtitle'
] as const)

const minimalDictionary = createTranslationDictionary([
	'ui.hashSymbol'
] as const)

beforeEach(() => {
	useSettingsStore.setState(() => ({...DEFAULT_SETTINGS, uiLanguage: 'en'}))
})

afterEach(() => {
	vi.clearAllMocks()
	useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
	localStorage.removeItem('greek-exercise-settings')
})

describe('useTranslations returns translations when available', () => {
	it('returns translations when available', async () => {
		mockedRequestJson.mockResolvedValueOnce({
			translations: {
				'app.title': 'Learn Greek',
				'app.subtitle': 'Interactive exercises'
			}
		})

		const {queryClient, wrapper} = createWrapper()
		const {result, unmount} = renderHook(() => useTranslations(dictionary), {
			wrapper
		})

		await waitFor(() => {
			expect(result.current.status).toBe('complete')
		})

		expect(result.current.t('app.title')).toBe('Learn Greek')
		expect(result.current.t('app.subtitle')).toBe('Interactive exercises')
		expect(result.current.missingKeys).toHaveLength(0)

		unmount()
		queryClient.clear()
	})
})

describe('useTranslations handles partial fallback scenarios', () => {
	it('uses fallbacks and reports partial status when some translations are missing', async () => {
		mockedRequestJson.mockResolvedValueOnce({
			translations: {
				'app.title': 'Learn Greek'
			}
		})

		const {queryClient, wrapper} = createWrapper()
		const {result, unmount} = renderHook(() => useTranslations(dictionary), {
			wrapper
		})

		await waitFor(() => {
			expect(result.current.status).toBe('partial')
		})

		expect(result.current.t('app.title')).toBe('Learn Greek')
		expect(result.current.t('app.subtitle')).toBe(
			'Interactive exercises for learning Greek language'
		)
		expect(result.current.missingKeys).toEqual(['app.subtitle'])

		unmount()
		queryClient.clear()
	})
})

describe('useTranslations handles fully missing translations', () => {
	it('marks status as missing when all translations fall back', async () => {
		mockedRequestJson.mockResolvedValueOnce({translations: {}})

		const {queryClient, wrapper} = createWrapper()
		const {result, unmount} = renderHook(
			() => useTranslations(minimalDictionary),
			{
				wrapper
			}
		)

		await waitFor(() => {
			expect(result.current.status).toBe('missing')
		})

		expect(result.current.t('ui.hashSymbol')).toBe('#')
		expect(result.current.missingKeys).toEqual(['ui.hashSymbol'])

		unmount()
		queryClient.clear()
	})
})

describe('useTranslations respects missing policies', () => {
	it('respects missing policy set to key', async () => {
		mockedRequestJson.mockResolvedValueOnce({translations: {}})

		const {queryClient, wrapper} = createWrapper()
		const {result, unmount} = renderHook(
			() => useTranslations(dictionary, {missingPolicy: 'key'}),
			{
				wrapper
			}
		)

		await waitFor(() => {
			expect(result.current.status).toBe('missing')
		})

		expect(result.current.t('app.title')).toBe('app.title')
		expect(result.current.t('app.subtitle')).toBe('app.subtitle')

		unmount()
		queryClient.clear()
	})
})
