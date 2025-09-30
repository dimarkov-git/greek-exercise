import '@testing-library/jest-dom/vitest'
import {configureHttpClient} from '@/shared/api/httpClient'
import {useSettingsStore} from '@/shared/model'
import {resolveFallbackResponse} from './app/test/fallbacks'
import {server} from './app/test/msw/server'

// Configure httpClient for tests
configureHttpClient({
	isDevelopment: true,
	enableHTTPFallback: true,
	resolveFallback: resolveFallbackResponse
})

beforeAll(() => server.listen())

beforeEach(() => {
	// Reset settings store and set English as default for tests
	useSettingsStore.getState().resetSettings()
	useSettingsStore.getState().setUiLanguage('en')
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())
