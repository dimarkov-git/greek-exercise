import '@testing-library/jest-dom/vitest'
import {server} from './mocks/server'
import {useSettingsStore} from './stores/settings'

beforeAll(() => server.listen())

beforeEach(() => {
	// Reset settings store and set English as default for tests
	useSettingsStore.getState().resetSettings()
	useSettingsStore.getState().setUiLanguage('en')
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())
