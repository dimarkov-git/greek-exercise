import '@testing-library/jest-dom/vitest'
import {useSettingsStore} from '@/shared/model'
import {server} from './shared/test/msw/server'

beforeAll(() => server.listen())

beforeEach(() => {
	// Reset settings store and set English as default for tests
	useSettingsStore.getState().resetSettings()
	useSettingsStore.getState().setUiLanguage('en')
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())
