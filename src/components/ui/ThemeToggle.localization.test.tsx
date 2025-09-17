import {vi} from 'vitest'
import {useSettingsStore} from '@/stores/settings'
import {render, screen} from '@/test-utils'
import {ThemeToggle} from './ThemeToggle'

// Mock the settings store
const mockSetTheme = vi.fn()
vi.mock('@/stores/settings', () => ({
	useSettingsStore: vi.fn()
}))

const mockUseSettingsStore = vi.mocked(useSettingsStore)

describe('ThemeToggle localization', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		document.documentElement.removeAttribute('data-theme')
	})

	it('shows correct Greek tooltips', () => {
		mockUseSettingsStore.mockReturnValue({
			theme: 'light',
			setTheme: mockSetTheme,
			uiLanguage: 'el',
			userLanguage: 'el',
			setUiLanguage: vi.fn(),
			setUserLanguage: vi.fn()
		})

		render(<ThemeToggle />)

		expect(screen.getByRole('button')).toHaveAttribute('title', 'Ανοιχτό')
	})

	it('shows correct Russian tooltips', () => {
		mockUseSettingsStore.mockReturnValue({
			theme: 'dark',
			setTheme: mockSetTheme,
			uiLanguage: 'ru',
			userLanguage: 'ru',
			setUiLanguage: vi.fn(),
			setUserLanguage: vi.fn()
		})

		render(<ThemeToggle />)

		expect(screen.getByRole('button')).toHaveAttribute('title', 'Темная')
	})
})
