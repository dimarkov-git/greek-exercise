import {act, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {render} from '@/app/test'
import {
	DEFAULT_SETTINGS,
	USER_LANGUAGES,
	useSettingsStore
} from '@/shared/model'
import {exerciseLibraryTranslations} from '../lib/translations'
import {UserSettings} from './UserSettings'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
	motion: {
		div: 'div',
		button: 'button',
		svg: 'svg'
	},
	AnimatePresence: ({children}: {children: React.ReactNode}) => (
		<div>{children}</div>
	)
}))

// Mock UserLanguageSelector component
vi.mock('@/components/ui/UserLanguageSelector', () => ({
	UserLanguageSelector: () => (
		<div data-testid='user-language-selector'>
			{USER_LANGUAGES.map(language => (
				<button
					data-testid={`user-language-option-${language.code}`}
					key={language.code}
					type='button'
				>
					{language.flag}
				</button>
			))}
		</div>
	)
}))

// Mock translator function
const mockT = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		settings: 'Settings',
		userLanguageDescription:
			'Choose your native language for hints and explanations',
		hintLanguage: 'Hint language',
		'ui.expand': 'Expand',
		'ui.collapse': 'Collapse',
		'ui.colon': ':'
	}
	return translations[key] || key
})

const defaultProps = {
	t: mockT,
	translations: exerciseLibraryTranslations
}

describe('UserSettings', () => {
	beforeEach(() => {
		localStorage.clear()
		act(() => {
			useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
		})
		vi.clearAllMocks()
	})

	afterEach(() => {
		localStorage.clear()
		act(() => {
			useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
		})
	})

	describe('Rendering', () => {
		it('renders the main settings container', () => {
			render(<UserSettings {...defaultProps} />)

			expect(screen.getByText('Settings')).toBeInTheDocument()
		})

		it('renders with proper container styling and structure', () => {
			render(<UserSettings {...defaultProps} />)

			// Find the main container by looking for the specific class combination
			const container = document.querySelector(
				'.mb-6.rounded-lg.border.border-gray-200.bg-white.shadow-sm'
			)
			expect(container).toBeInTheDocument()
			expect(container).toHaveClass(
				'mb-6',
				'rounded-lg',
				'border',
				'border-gray-200',
				'bg-white',
				'shadow-sm',
				'dark:border-gray-700',
				'dark:bg-gray-800'
			)
		})

		it('renders collapse/expand button with correct initial state', () => {
			render(<UserSettings {...defaultProps} />)

			// Find the main toggle button by looking for the one containing the "Settings" heading
			const toggleButton = screen.getByText('Settings').closest('button')!
			expect(toggleButton).toHaveAttribute('type', 'button')
			expect(toggleButton).toHaveClass('flex', 'w-full', 'cursor-pointer')
		})

		it('shows settings content by default (expanded state)', () => {
			render(<UserSettings {...defaultProps} />)

			expect(
				screen.getByText(
					'Choose your native language for hints and explanations'
				)
			).toBeInTheDocument()
			expect(screen.getByTestId('user-language-selector')).toBeInTheDocument()
		})

		it('displays correct SVG title for expanded state', () => {
			render(<UserSettings {...defaultProps} />)

			const svg = screen.getByTitle('Collapse')
			expect(svg).toBeInTheDocument()
		})

		it('does not show inline summary when expanded', () => {
			render(<UserSettings {...defaultProps} />)

			expect(screen.queryByText('Hint language')).not.toBeInTheDocument()
		})
	})

	describe('Collapse/Expand functionality', () => {
		it('toggles collapsed state when button is clicked', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!

			// Initially expanded - should show settings content
			expect(
				screen.getByText(
					'Choose your native language for hints and explanations'
				)
			).toBeInTheDocument()

			// Click to collapse
			await user.click(toggleButton)

			// Should show inline summary and hide content
			await waitFor(() => {
				expect(screen.getByTitle('Expand')).toBeInTheDocument()
				expect(
					screen.getByText('Hint language', {exact: false})
				).toBeInTheDocument()
			})

			// Click to expand again
			await user.click(toggleButton)

			await waitFor(() => {
				expect(screen.getByTitle('Collapse')).toBeInTheDocument()
				expect(
					screen.getByText(
						'Choose your native language for hints and explanations'
					)
				).toBeInTheDocument()
			})
		})

		it('shows SettingsSummaryInline when collapsed', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			await waitFor(() => {
				expect(
					screen.getByText('Hint language', {exact: false})
				).toBeInTheDocument()
				expect(screen.getByText(':', {exact: false})).toBeInTheDocument()
			})
		})

		it('hides UserLanguageSelector when collapsed', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!

			// Initially expanded - selector should be visible
			expect(screen.getByTestId('user-language-selector')).toBeInTheDocument()

			// Click to collapse
			await user.click(toggleButton)

			await waitFor(() => {
				expect(
					screen.queryByTestId('user-language-selector')
				).not.toBeInTheDocument()
			})
		})
	})

	describe('SettingsSummaryInline', () => {
		it('shows correct flag for Russian user language', async () => {
			const user = userEvent.setup()

			act(() => {
				useSettingsStore.setState(state => ({
					...state,
					userLanguage: 'ru'
				}))
			})

			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🇷🇺')
			})
		})

		it('shows correct flag for English user language', async () => {
			const user = userEvent.setup()

			act(() => {
				useSettingsStore.setState(state => ({
					...state,
					userLanguage: 'en'
				}))
			})

			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🇺🇸')
			})
		})

		it('shows fallback flag for unknown language', async () => {
			const user = userEvent.setup()

			act(() => {
				useSettingsStore.setState(state => ({
					...state,
					// biome-ignore lint/suspicious/noExplicitAny: Testing edge case with invalid language
					userLanguage: 'unknown' as any
				}))
			})

			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🌐')
			})
		})

		it('reacts to userLanguage changes from the store', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			// Initially should show default English flag
			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🇺🇸')
			})

			// Change to Russian
			act(() => {
				useSettingsStore.setState(state => ({
					...state,
					userLanguage: 'ru'
				}))
			})

			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🇷🇺')
				expect(summarySpan).not.toHaveTextContent('🇺🇸')
			})
		})
	})

	describe('UserLanguageSelector integration', () => {
		it('renders UserLanguageSelector component when expanded', () => {
			render(<UserSettings {...defaultProps} />)

			expect(screen.getByTestId('user-language-selector')).toBeInTheDocument()
		})

		it('includes all user language options', () => {
			render(<UserSettings {...defaultProps} />)

			for (const language of USER_LANGUAGES) {
				expect(
					screen.getByTestId(`user-language-option-${language.code}`)
				).toBeInTheDocument()
			}
		})

		it('shows user language description', () => {
			render(<UserSettings {...defaultProps} />)

			expect(
				screen.getByText(
					'Choose your native language for hints and explanations'
				)
			).toBeInTheDocument()
		})
	})

	describe('Translation integration', () => {
		it('calls translation function with correct keys', () => {
			render(<UserSettings {...defaultProps} />)

			expect(mockT).toHaveBeenCalledWith('settings')
			expect(mockT).toHaveBeenCalledWith('userLanguageDescription')
			expect(mockT).toHaveBeenCalledWith('ui.collapse')
		})

		it('calls translation function for inline summary when collapsed', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			await waitFor(() => {
				expect(mockT).toHaveBeenCalledWith('hintLanguage')
				expect(mockT).toHaveBeenCalledWith('ui.colon')
				expect(mockT).toHaveBeenCalledWith('ui.expand')
			})
		})

		it('handles missing translations gracefully', () => {
			const fallbackT = vi.fn((key: string) => key)
			render(
				<UserSettings
					t={fallbackT}
					translations={exerciseLibraryTranslations}
				/>
			)

			expect(screen.getByText('settings')).toBeInTheDocument()
			expect(screen.getByText('userLanguageDescription')).toBeInTheDocument()
		})
	})

	describe('Accessibility', () => {
		it('has proper button type for toggle button', () => {
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			expect(toggleButton).toHaveAttribute('type', 'button')
		})

		it('has proper SVG title for screen readers', () => {
			render(<UserSettings {...defaultProps} />)

			const svg = screen.getByTitle('Collapse')
			expect(svg).toBeInTheDocument()
		})

		it('updates SVG title when state changes', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			// Initially collapsed
			expect(screen.getByTitle('Collapse')).toBeInTheDocument()

			// Click to expand
			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			await waitFor(() => {
				expect(screen.getByTitle('Expand')).toBeInTheDocument()
				expect(screen.queryByTitle('Collapse')).not.toBeInTheDocument()
			})
		})

		it('maintains proper heading structure', () => {
			render(<UserSettings {...defaultProps} />)

			const heading = screen.getByRole('heading', {level: 3})
			expect(heading).toHaveTextContent('Settings')
			expect(heading).toHaveClass(
				'font-semibold',
				'text-gray-900',
				'dark:text-white'
			)
		})

		it('has proper contrast classes for dark mode support', () => {
			render(<UserSettings {...defaultProps} />)

			const heading = screen.getByRole('heading', {level: 3})
			expect(heading).toHaveClass('dark:text-white')

			const description = screen.getByText(
				'Choose your native language for hints and explanations'
			)
			expect(description).toHaveClass('dark:text-gray-400')
		})

		it('maintains focus order when toggling', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!

			// Focus the toggle button
			await user.click(toggleButton)

			// Toggle button should still be focusable
			expect(toggleButton).toBeInTheDocument()
			expect(document.activeElement).toBe(toggleButton)
		})
	})

	describe('Animation and UI states', () => {
		it('has proper initial animation classes', () => {
			render(<UserSettings {...defaultProps} />)

			const container = document.querySelector('.mb-6.rounded-lg.border')
			expect(container).toBeInTheDocument()
			expect(container).toHaveClass('mb-6', 'rounded-lg', 'border')
		})

		it('has hover states for interactive elements', () => {
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			expect(toggleButton).toHaveClass(
				'hover:bg-gray-50',
				'hover:pb-7',
				'dark:hover:bg-gray-700'
			)
		})

		it('has proper transition classes', () => {
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			expect(toggleButton).toHaveClass('transition-all')

			// SVG classes are mocked away by framer-motion mock, but the title is still there
			const svg = screen.getByTitle('Collapse')
			expect(svg).toBeInTheDocument()
		})
	})

	describe('Edge cases and error handling', () => {
		it('handles undefined translator gracefully', () => {
			const undefinedT = vi.fn(() => '')
			render(
				<UserSettings
					t={undefinedT}
					translations={exerciseLibraryTranslations}
				/>
			)

			// Component should still render even with undefined translations
			const toggleButton = document.querySelector(
				'button[class*="flex w-full cursor-pointer"]'
			)
			expect(toggleButton).toBeInTheDocument()
		})

		it('handles rapid toggle clicks', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!

			// Rapidly click multiple times
			await user.click(toggleButton)
			await user.click(toggleButton)
			await user.click(toggleButton)

			// Should still be functional
			expect(toggleButton).toBeInTheDocument()
		})

		it('maintains state after multiple renders', () => {
			const {rerender} = render(<UserSettings {...defaultProps} />)

			// Initially expanded
			expect(
				screen.getByText(
					'Choose your native language for hints and explanations'
				)
			).toBeInTheDocument()

			// Rerender with same props
			rerender(<UserSettings {...defaultProps} />)

			// Should still be expanded
			expect(
				screen.getByText(
					'Choose your native language for hints and explanations'
				)
			).toBeInTheDocument()
		})
	})

	describe('Settings store integration', () => {
		it('reads userLanguage from settings store', async () => {
			const user = userEvent.setup()

			act(() => {
				useSettingsStore.setState(state => ({
					...state,
					userLanguage: 'ru'
				}))
			})

			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🇷🇺')
			})
		})

		it('updates when settings store changes', async () => {
			const user = userEvent.setup()
			render(<UserSettings {...defaultProps} />)

			const toggleButton = screen.getByText('Settings').closest('button')!
			await user.click(toggleButton)

			// Change language in store
			act(() => {
				useSettingsStore.setState(state => ({
					...state,
					userLanguage: 'ru'
				}))
			})

			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🇷🇺')
			})

			// Change back to English
			act(() => {
				useSettingsStore.setState(state => ({
					...state,
					userLanguage: 'en'
				}))
			})

			await waitFor(() => {
				const summarySpan = screen.getByText('Hint language', {
					exact: false
				}).parentElement
				expect(summarySpan).toHaveTextContent('🇺🇸')
			})
		})
	})
})
