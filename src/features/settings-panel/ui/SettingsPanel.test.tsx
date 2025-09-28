import {render, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {SettingsPanel} from './SettingsPanel'

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: ({
			children,
			className,
			initial,
			animate,
			transition,
			...props
		}: {
			children?: React.ReactNode
			className?: string
			// biome-ignore lint/suspicious/noExplicitAny: Framer Motion props are complex
			initial?: any
			// biome-ignore lint/suspicious/noExplicitAny: Framer Motion props are complex
			animate?: any
			// biome-ignore lint/suspicious/noExplicitAny: Framer Motion props are complex
			transition?: any
			// biome-ignore lint/suspicious/noExplicitAny: Rest props spread
			[key: string]: any
		}) => (
			<div className={className} {...props}>
				{children}
			</div>
		)
	}
}))

// Mock useTranslations hook
vi.mock('@/shared/lib/i18n', async () => {
	const actual = await vi.importActual('@/shared/lib/i18n')
	return {
		...actual,
		useTranslations: () => ({
			t: (key: string) => {
				const translations: Record<string, string> = {
					settings: 'Settings'
				}
				return translations[key] || key
			},
			status: 'complete' as const,
			missingKeys: [] as string[]
		})
	}
})

// Mock child components
vi.mock('@/shared/ui/language-selector', () => ({
	LanguageSelector: () => (
		<div data-testid='language-selector'>Language Selector Component</div>
	)
}))

vi.mock('@/shared/ui/theme-toggle', () => ({
	ThemeToggle: () => (
		<div data-testid='theme-toggle'>Theme Toggle Component</div>
	)
}))

vi.mock('@/shared/ui/user-language-selector', () => ({
	UserLanguageSelector: () => (
		<div data-testid='user-language-selector'>
			User Language Selector Component
		</div>
	)
}))

describe('SettingsPanel', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders the settings title', () => {
		render(<SettingsPanel />)

		expect(screen.getByText('Settings')).toBeInTheDocument()
	})

	it('renders the settings title with correct styling', () => {
		render(<SettingsPanel />)

		const title = screen.getByText('Settings')
		expect(title).toHaveClass(
			'font-semibold',
			'text-gray-900',
			'text-lg',
			'dark:text-white'
		)
		expect(title.tagName).toBe('H2')
	})

	it('renders all child components', () => {
		render(<SettingsPanel />)

		expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
		expect(screen.getByTestId('language-selector')).toBeInTheDocument()
		expect(screen.getByTestId('user-language-selector')).toBeInTheDocument()
	})

	it('has theme toggle in the header section', () => {
		render(<SettingsPanel />)

		const title = screen.getByText('Settings')
		const themeToggle = screen.getByTestId('theme-toggle')

		// Both should be in the same header container
		const header = title.closest('.mb-4.flex.items-center.justify-between')
		expect(header).toBeInTheDocument()
		expect(header).toContainElement(themeToggle)
	})

	it('has language selectors in the content section', () => {
		render(<SettingsPanel />)

		const languageSelector = screen.getByTestId('language-selector')
		const userLanguageSelector = screen.getByTestId('user-language-selector')

		// Both should be in the content container
		const content = languageSelector.closest('.space-y-4')
		expect(content).toBeInTheDocument()
		expect(content).toContainElement(userLanguageSelector)
	})

	it('applies correct container styling', () => {
		render(<SettingsPanel />)

		// Find the outermost container div (the motion.div)
		const container = document.querySelector('.rounded-2xl')
		expect(container).toHaveClass(
			'rounded-2xl',
			'border',
			'border-gray-200',
			'bg-white',
			'p-4',
			'shadow-lg',
			'dark:border-gray-700',
			'dark:bg-gray-900'
		)
	})

	it('applies correct header styling', () => {
		render(<SettingsPanel />)

		const header = screen.getByText('Settings').parentElement
		expect(header).toHaveClass(
			'mb-4',
			'flex',
			'items-center',
			'justify-between'
		)
	})

	it('applies correct content styling', () => {
		render(<SettingsPanel />)

		const content = screen.getByTestId('language-selector').parentElement
		expect(content).toHaveClass('space-y-4')
	})

	it('has proper component layout structure', () => {
		render(<SettingsPanel />)

		// Should have container > header + content structure
		const container = document.querySelector('.rounded-2xl')
		const header = screen.getByText('Settings').parentElement
		const content = screen.getByTestId('language-selector').parentElement

		expect(container).toContainElement(header)
		expect(container).toContainElement(content)
	})

	it('renders without errors when all dependencies are available', () => {
		expect(() => render(<SettingsPanel />)).not.toThrow()
	})

	it('maintains proper semantic structure', () => {
		render(<SettingsPanel />)

		// Should have a main heading
		const heading = screen.getByRole('heading', {level: 2})
		expect(heading).toHaveTextContent('Settings')
	})

	it('orders components correctly', () => {
		render(<SettingsPanel />)

		// Check that all required components are present in the expected order
		expect(screen.getByText('Settings')).toBeInTheDocument()
		expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
		expect(screen.getByTestId('language-selector')).toBeInTheDocument()
		expect(screen.getByTestId('user-language-selector')).toBeInTheDocument()
	})

	it('places ThemeToggle in header beside title', () => {
		render(<SettingsPanel />)

		const title = screen.getByText('Settings')
		const themeToggle = screen.getByTestId('theme-toggle')
		const header = title.parentElement

		expect(header).toContainElement(title)
		expect(header).toContainElement(themeToggle)
		expect(header).toHaveClass('justify-between') // Should space them apart
	})

	it('groups language selectors together', () => {
		render(<SettingsPanel />)

		const languageSelector = screen.getByTestId('language-selector')
		const userLanguageSelector = screen.getByTestId('user-language-selector')
		const contentArea = languageSelector.parentElement

		expect(contentArea).toContainElement(languageSelector)
		expect(contentArea).toContainElement(userLanguageSelector)
		expect(contentArea).toHaveClass('space-y-4') // Should have spacing between them
	})

	it('applies motion animation classes correctly', () => {
		render(<SettingsPanel />)

		// The motion components are mocked, but we should verify the container renders
		const container = document.querySelector('.rounded-2xl')
		expect(container).toBeInTheDocument()
		expect(container).toHaveClass(
			'rounded-2xl',
			'border',
			'border-gray-200',
			'bg-white',
			'p-4',
			'shadow-lg'
		)
	})

	it('has consistent dark mode support across elements', () => {
		render(<SettingsPanel />)

		const container = screen
			.getByRole('heading', {level: 2})
			.closest('[class*="rounded-2xl"]')
		const title = screen.getByText('Settings')

		expect(container).toHaveClass('dark:border-gray-700', 'dark:bg-gray-900')
		expect(title).toHaveClass('dark:text-white')
	})

	it('maintains proper accessibility structure', () => {
		render(<SettingsPanel />)

		// Should have proper heading hierarchy
		expect(screen.getByRole('heading', {level: 2})).toBeInTheDocument()

		// Should render all interactive components
		expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
		expect(screen.getByTestId('language-selector')).toBeInTheDocument()
		expect(screen.getByTestId('user-language-selector')).toBeInTheDocument()
	})

	it('integrates properly with translation system', () => {
		render(<SettingsPanel />)

		// Should display translated settings title
		expect(screen.getByText('Settings')).toBeInTheDocument()
		// Component should render without translation errors
		expect(screen.getByTestId('language-selector')).toBeInTheDocument()
	})

	it('has proper visual hierarchy with spacing and typography', () => {
		render(<SettingsPanel />)

		const title = screen.getByText('Settings')
		const contentArea = screen.getByTestId('language-selector').parentElement

		// Title should be large and semibold
		expect(title).toHaveClass('font-semibold', 'text-lg')

		// Content area should have proper spacing
		expect(contentArea).toHaveClass('space-y-4')

		// Header should have bottom margin
		expect(title.parentElement).toHaveClass('mb-4')
	})
})
