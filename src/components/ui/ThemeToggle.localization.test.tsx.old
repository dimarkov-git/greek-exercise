import {vi} from 'vitest'
import {useSettingsStore} from '@/stores/settings'
import {render, screen} from '@/test-utils'
import {ThemeToggle} from './ThemeToggle'

// Mock the settings store
const mockSetTheme = vi.fn()
vi.mock('@/stores/settings', () => ({
	useSettingsStore: vi.fn()
}))

// Mock the i18n hook
const mockT = vi.fn()
vi.mock('@/hooks/useI18n', () => ({
	useI18n: () => ({
		t: mockT,
		currentLanguage: 'el',
		isLoading: false
	})
}))

const mockUseSettingsStore = vi.mocked(useSettingsStore)

describe('ThemeToggle localization', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		document.documentElement.removeAttribute('data-theme')
	})

	it('shows correct Greek tooltips', () => {
		mockT.mockImplementation((key: string) => {
			const translations: Record<string, string> = {
				lightTheme: 'Ανοιχτό',
				darkTheme: 'Σκοτεινό'
			}
			return translations[key] || key
		})

		mockUseSettingsStore.mockReturnValue({
			theme: 'light',
			setTheme: mockSetTheme,
			uiLanguage: 'el',
			userLanguage: 'el',
			setUiLanguage: vi.fn(),
			setUserLanguage: vi.fn(),
			resetSettings: vi.fn()
		})

		render(<ThemeToggle />)

		expect(screen.getByRole('button')).toHaveAttribute('title', 'Σκοτεινό')
	})

	it('shows correct Russian tooltips', () => {
		mockT.mockImplementation((key: string) => {
			const translations: Record<string, string> = {
				lightTheme: 'Светлая',
				darkTheme: 'Темная'
			}
			return translations[key] || key
		})

		mockUseSettingsStore.mockReturnValue({
			theme: 'dark',
			setTheme: mockSetTheme,
			uiLanguage: 'ru',
			userLanguage: 'ru',
			setUiLanguage: vi.fn(),
			setUserLanguage: vi.fn(),
			resetSettings: vi.fn()
		})

		render(<ThemeToggle />)

		expect(screen.getByRole('button')).toHaveAttribute('title', 'Светлая')
	})
})
