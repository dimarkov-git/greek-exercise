import '@testing-library/jest-dom/vitest'
import {
	createExerciseFallbackResolver,
	exerciseMswHandlers
} from '@/entities/exercise'
import {configureHttpClient, createFallbackRegistry} from '@/shared/api'
import {
	createTranslationsFallbackResolver,
	translationMswHandlers
} from '@/shared/lib'
import {useSettingsStore} from '@/shared/model'
import {createServer} from '@/shared/test'

// Compose fallback resolvers for offline-first strategy
const resolveFallback = createFallbackRegistry([
	createTranslationsFallbackResolver(),
	createExerciseFallbackResolver()
])

// Configure httpClient for tests
configureHttpClient({
	enableHTTPFallback: true,
	resolveFallback
})

// Set up the MSW server with all handlers (translation and exercise)
const server = createServer([...translationMswHandlers, ...exerciseMswHandlers])

beforeAll(() => server.listen())

beforeEach(() => {
	// Reset settings store and set English as default for tests
	useSettingsStore.getState().resetSettings()
	useSettingsStore.getState().setUiLanguage('en')
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())
