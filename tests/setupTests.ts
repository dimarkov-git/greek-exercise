import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import {afterAll, afterEach, beforeAll, vi} from 'vitest'
import {server} from '@/mocks/server'
import {useSettingsStore} from '@/stores/settings'

beforeAll(() => {
	server.listen({onUnhandledRequest: 'error'})
})

beforeEach(() => {
	vi.stubGlobal('scrollTo', vi.fn())
	const settingsStore = useSettingsStore.getState()
	settingsStore.setTheme('light')
	settingsStore.setUiLanguage('en')
})

afterEach(() => {
	server.resetHandlers()
	cleanup()

	const settingsStore = useSettingsStore.getState()
	settingsStore.resetSettings()
	settingsStore.setTheme('light')
	settingsStore.setUiLanguage('en')

	vi.useRealTimers()
	vi.restoreAllMocks()
	vi.clearAllMocks()
})

afterAll(() => {
	server.close()
})
