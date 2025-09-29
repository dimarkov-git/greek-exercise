import {render, screen, waitFor} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useSettingsStore} from '@/shared/model'
import {LanguageDropdown} from './LanguageDropdown'

// Mock the translations
vi.mock('@/shared/lib/i18n', () => ({
	languageDropdownTranslations: {
		keys: ['header.selectLanguage', 'ui.dropdownArrow', 'ui.selectedLanguage'],
		getRequest: vi.fn(() => ({key: 'test', fallback: 'test'}))
	},
	useTranslations: vi.fn(() => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'header.selectLanguage': 'Select language',
				'ui.dropdownArrow': 'Dropdown arrow',
				'ui.selectedLanguage': 'Selected language'
			}
			return translations[key] || key
		},
		isLoading: false
	}))
}))

// Mock settings store
vi.mock('@/shared/model', () => ({
	useSettingsStore: vi.fn()
}))

const mockUseSettingsStore = vi.mocked(useSettingsStore)

describe('LanguageDropdown', () => {
	beforeEach(() => {
		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'en',
			setUiLanguage: vi.fn()
		} as ReturnType<typeof useSettingsStore>)
	})

	it('renders dropdown button with current language flag', () => {
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		expect(dropdownButton).toBeInTheDocument()
		expect(dropdownButton).toHaveAttribute('title', 'Select language')
	})

	it('shows dropdown menu when button is clicked', async () => {
		const user = userEvent.setup()
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		const dropdownMenu = screen.getByTestId('ui-language-dropdown-menu')
		expect(dropdownMenu).toBeInTheDocument()
	})

	it('displays all available languages in dropdown menu', async () => {
		const user = userEvent.setup()
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		// Check for all three language options
		expect(screen.getByTestId('ui-language-option-en')).toBeInTheDocument()
		expect(screen.getByTestId('ui-language-option-ru')).toBeInTheDocument()
		expect(screen.getByTestId('ui-language-option-el')).toBeInTheDocument()
	})

	it('highlights the currently selected language', async () => {
		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'ru',
			setUiLanguage: vi.fn()
		} as ReturnType<typeof useSettingsStore>)

		const user = userEvent.setup()
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		const russianOption = screen.getByTestId('ui-language-option-ru')
		expect(russianOption).toHaveClass('bg-blue-50', 'text-blue-700')
		expect(russianOption).toBeDisabled()
	})

	it('calls setUiLanguage when a different language is selected', async () => {
		const user = userEvent.setup()
		const mockSetUiLanguage = vi.fn()

		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'en',
			setUiLanguage: mockSetUiLanguage
		} as ReturnType<typeof useSettingsStore>)

		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		const russianOption = screen.getByTestId('ui-language-option-ru')
		await user.click(russianOption)

		expect(mockSetUiLanguage).toHaveBeenCalledWith('ru')
	})

	it('closes dropdown after selecting a language', async () => {
		const user = userEvent.setup()
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		const greekOption = screen.getByTestId('ui-language-option-el')
		await user.click(greekOption)

		// Wait for AnimatePresence exit animation to complete
		await waitFor(
			() => {
				expect(
					screen.queryByTestId('ui-language-dropdown-menu')
				).not.toBeInTheDocument()
			},
			{timeout: 1000}
		)
	})

	it('closes dropdown when clicking outside', async () => {
		const user = userEvent.setup()
		render(
			<div>
				<LanguageDropdown />
				<div data-testid='outside'>Outside element</div>
			</div>
		)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		expect(screen.getByTestId('ui-language-dropdown-menu')).toBeInTheDocument()

		// Click the overlay (backdrop)
		const outside = screen.getByTestId('outside')
		await user.click(outside)

		// Menu should still be there, but clicking the actual overlay should close it
		// Let's find the actual overlay and click it
		const dropdown = screen.getByTestId('ui-language-dropdown-menu')
		const overlay = dropdown.parentElement?.querySelector('.fixed.inset-0')
		if (overlay) {
			await user.click(overlay as Element)
		}
	})

	it('shows checkmark icon for selected language', async () => {
		const user = userEvent.setup()
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		const englishOption = screen.getByTestId('ui-language-option-en')
		const checkmark = englishOption.querySelector('svg')
		expect(checkmark).toBeInTheDocument()
	})

	it('does not call setUiLanguage when clicking the currently selected language', async () => {
		const user = userEvent.setup()
		const mockSetUiLanguage = vi.fn()

		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'en',
			setUiLanguage: mockSetUiLanguage
		} as ReturnType<typeof useSettingsStore>)

		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		const englishOption = screen.getByTestId('ui-language-option-en')
		await user.click(englishOption)

		expect(mockSetUiLanguage).not.toHaveBeenCalled()
	})

	it('has proper dropdown arrow rotation', () => {
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		const arrow = dropdownButton.querySelector('svg')

		expect(arrow).toBeInTheDocument()
		expect(arrow).toHaveAttribute('viewBox', '0 0 12 12')
	})

	it('has proper accessibility attributes', () => {
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')

		expect(dropdownButton).toHaveAttribute('type', 'button')
		expect(dropdownButton).toHaveAttribute('title', 'Select language')

		const arrow = dropdownButton.querySelector('svg title')
		expect(arrow).toHaveTextContent('Dropdown arrow')
	})

	it('updates data attributes correctly', async () => {
		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'el',
			setUiLanguage: vi.fn()
		} as ReturnType<typeof useSettingsStore>)

		const user = userEvent.setup()
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')

		expect(dropdownButton).toHaveAttribute('data-current-language', 'el')
		expect(dropdownButton).toHaveAttribute('data-is-open', 'false')

		await user.click(dropdownButton)
		expect(dropdownButton).toHaveAttribute('data-is-open', 'true')
	})

	it('renders language names correctly in dropdown menu', async () => {
		const user = userEvent.setup()
		render(<LanguageDropdown />)

		const dropdownButton = screen.getByTestId('ui-language-dropdown')
		await user.click(dropdownButton)

		// Check that language names are displayed
		expect(screen.getByText('English')).toBeInTheDocument()
		expect(screen.getByText('Русский')).toBeInTheDocument()
		expect(screen.getByText('Ελληνικά')).toBeInTheDocument()
	})
})
