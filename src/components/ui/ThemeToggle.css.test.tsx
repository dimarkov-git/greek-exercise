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

describe('ThemeToggle CSS classes', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		document.documentElement.removeAttribute('data-theme')
	})

	it('applies correct CSS classes for light theme', () => {
		mockUseSettingsStore.mockReturnValue({
			theme: 'light',
			setTheme: mockSetTheme,
			uiLanguage: 'en',
			userLanguage: 'en',
			setUiLanguage: vi.fn(),
			setUserLanguage: vi.fn()
		})

		render(<ThemeToggle />)

		const button = screen.getByRole('button')
		expect(button).toHaveClass('border-gray-300', 'bg-white')
	})

	it('applies correct CSS classes for dark theme', () => {
		mockUseSettingsStore.mockReturnValue({
			theme: 'dark',
			setTheme: mockSetTheme,
			uiLanguage: 'en',
			userLanguage: 'en',
			setUiLanguage: vi.fn(),
			setUserLanguage: vi.fn()
		})

		render(<ThemeToggle />)

		const button = screen.getByRole('button')
		expect(button).toHaveClass('dark:border-gray-600', 'dark:bg-gray-800')
	})
})
