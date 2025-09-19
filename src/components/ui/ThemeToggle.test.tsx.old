import {act} from '@testing-library/react'
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

describe('ThemeToggle', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// Reset document attributes
		document.documentElement.removeAttribute('data-theme')
	})

	describe('interactions', () => {
		it('toggles theme from light to dark when clicked', async () => {
			mockUseSettingsStore.mockReturnValue({
				theme: 'light',
				setTheme: mockSetTheme,
				uiLanguage: 'en',
				userLanguage: 'en',
				setUiLanguage: vi.fn(),
				setUserLanguage: vi.fn()
			})

			const {user} = render(<ThemeToggle />)

			const button = screen.getByRole('button')
			await act(async () => {
				await user.click(button)
			})

			expect(mockSetTheme).toHaveBeenCalledWith('dark')
		})

		it('toggles theme from dark to light when clicked', async () => {
			mockUseSettingsStore.mockReturnValue({
				theme: 'dark',
				setTheme: mockSetTheme,
				uiLanguage: 'en',
				userLanguage: 'en',
				setUiLanguage: vi.fn(),
				setUserLanguage: vi.fn()
			})

			const {user} = render(<ThemeToggle />)

			const button = screen.getByRole('button')
			await act(async () => {
				await user.click(button)
			})

			expect(mockSetTheme).toHaveBeenCalledWith('light')
		})
	})
})
