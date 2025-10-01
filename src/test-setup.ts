import '@testing-library/jest-dom/vitest'
import {testing} from '@/entities/exercise'
import {configureHttpClient} from '@/shared/api'
import {useSettingsStore} from '@/shared/model'
// Import server directly to avoid browser build issues
import {createServer} from '@/shared/test/msw/server'

// Configure httpClient for tests
configureHttpClient({
	isDevelopment: true,
	enableHTTPFallback: true,
	resolveFallback: testing.resolveFallbackResponse
})

// Setup MSW server with all handlers (translation + exercise)
const server = createServer(testing.exerciseHandlers)

beforeAll(() => server.listen())

beforeEach(() => {
	// Reset settings store and set English as default for tests
	useSettingsStore.getState().resetSettings()
	useSettingsStore.getState().setUiLanguage('en')
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())
