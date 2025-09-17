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

describe('ThemeToggle rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		document.documentElement.removeAttribute('data-theme')
	})

	it('renders light theme initially', () => {
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
		expect(button).toBeInTheDocument()
		expect(button).toHaveTextContent('☀️')
		expect(button).toHaveAttribute('title', 'Light')
	})

	it('renders dark theme when theme is dark', () => {
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
		expect(button).toHaveTextContent('🌙')
		expect(button).toHaveAttribute('title', 'Dark')
	})
})
