import {render, screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {useSettingsStore} from '@/shared/model'
import {LanguageSelector} from './LanguageSelector'

// Mock the translations
vi.mock('@/shared/lib/i18n', () => ({
	loadTranslations: vi.fn(() => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				interfaceLanguage: 'Interface Language'
			}
			return translations[key] || key
		},
		language: 'en',
		isLoading: false,
		error: null,
		missingKeys: [],
		status: 'complete' as const
	}))
}))

// Mock settings store
vi.mock('@/shared/model', () => ({
	useSettingsStore: vi.fn()
}))

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
	useForm: () => ({
		setValue: vi.fn()
	})
}))

const mockUseSettingsStore = vi.mocked(useSettingsStore)

describe('LanguageSelector', () => {
	beforeEach(() => {
		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'en',
			setUiLanguage: vi.fn()
		} as ReturnType<typeof useSettingsStore>)
	})

	it('renders language selector with title', () => {
		render(<LanguageSelector />)
		expect(screen.getByText('Interface Language')).toBeInTheDocument()
	})

	it('renders all language options', () => {
		render(<LanguageSelector />)

		// Check for flag emojis (language buttons)
		const buttons = screen.getAllByRole('button')
		expect(buttons).toHaveLength(3) // en, ru, el
	})

	it('highlights the currently selected language', () => {
		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'ru',
			setUiLanguage: vi.fn()
		} as ReturnType<typeof useSettingsStore>)

		render(<LanguageSelector />)

		// Find the Russian flag button (should be highlighted)
		const buttons = screen.getAllByRole('button')
		const russianButton = buttons.find(button =>
			button.className.includes('border-blue-500 bg-blue-500')
		)
		expect(russianButton).toBeTruthy()
	})

	it('calls setUiLanguage when language button is clicked', async () => {
		const user = userEvent.setup()
		const mockSetUiLanguage = vi.fn()

		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'en',
			setUiLanguage: mockSetUiLanguage
		} as ReturnType<typeof useSettingsStore>)

		render(<LanguageSelector />)

		// Click on a language button
		const buttons = screen.getAllByRole('button')
		if (buttons[1]) {
			await user.click(buttons[1]) // Click second button (should be Russian)
		}

		expect(mockSetUiLanguage).toHaveBeenCalledTimes(1)
	})

	it('applies correct classes for active language', () => {
		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'el',
			setUiLanguage: vi.fn()
		} as ReturnType<typeof useSettingsStore>)

		render(<LanguageSelector />)

		const buttons = screen.getAllByRole('button')
		const activeButton = buttons.find(button =>
			button.className.includes('border-blue-500 bg-blue-500 text-white')
		)
		expect(activeButton).toBeTruthy()
	})

	it('applies correct classes for inactive languages', () => {
		mockUseSettingsStore.mockReturnValue({
			uiLanguage: 'en',
			setUiLanguage: vi.fn()
		} as ReturnType<typeof useSettingsStore>)

		render(<LanguageSelector />)

		const buttons = screen.getAllByRole('button')
		const inactiveButtons = buttons.filter(button =>
			button.className.includes('border-gray-300 bg-white')
		)
		expect(inactiveButtons).toHaveLength(2) // Two inactive buttons
	})

	it('has proper accessibility attributes', () => {
		render(<LanguageSelector />)

		const buttons = screen.getAllByRole('button')
		for (const button of buttons) {
			expect(button).toHaveAttribute('title')
			expect(button.getAttribute('title')).toBeTruthy()
		}
	})

	it('renders with animation wrapper', () => {
		const {container} = render(<LanguageSelector />)

		// Check for motion.div wrapper with space-y-2 class
		const motionDiv = container.querySelector('.space-y-2')
		expect(motionDiv).toBeInTheDocument()
	})
})
