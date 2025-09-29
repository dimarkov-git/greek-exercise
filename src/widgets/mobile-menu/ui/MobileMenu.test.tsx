import {render, screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {BrowserRouter} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {MobileMenu} from './MobileMenu'

// Mock the translations
vi.mock('@/shared/lib/i18n', () => ({
	mobileMenuTranslations: {
		keys: [
			'navigation.home',
			'navigation.library',
			'navigation.builder',
			'navigation.testSection',
			'settings'
		],
		getRequest: vi.fn(() => ({key: 'test', fallback: 'test'}))
	},
	useTranslations: vi.fn(() => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'navigation.home': 'Home',
				'navigation.library': 'Library',
				'navigation.builder': 'Builder',
				'navigation.testSection': 'Test Section',
				settings: 'Settings'
			}
			return translations[key] || key
		},
		isLoading: false
	}))
}))

// Mock language dropdown and theme toggle
vi.mock('@/shared/ui/language-dropdown', () => ({
	LanguageDropdown: () => (
		<div data-testid='language-dropdown'>Language Dropdown</div>
	)
}))

vi.mock('@/shared/ui/theme-toggle', () => ({
	ThemeToggle: () => <div data-testid='theme-toggle'>Theme Toggle</div>
}))

// Mock framer motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
	AnimatePresence: ({children}: {children: React.ReactNode}) => (
		<div>{children}</div>
	),
	motion: {
		div: ({
			children,
			...props
		}: React.ComponentProps<'div'> & {children: React.ReactNode}) => (
			<div {...props}>{children}</div>
		)
	}
}))

// Mock React Router
const mockLocation = {pathname: '/'}
vi.mock('react-router', async () => {
	const actual = await vi.importActual('react-router')
	return {
		...actual,
		useLocation: () => mockLocation,
		Link: ({
			children,
			to,
			onClick,
			className,
			...props
		}: React.ComponentProps<'a'> & {
			to: string
			children: React.ReactNode
			onClick?: () => void
		}) => (
			<a
				className={className}
				href={to}
				onClick={e => {
					e.preventDefault()
					onClick?.()
				}}
				{...props}
			>
				{children}
			</a>
		)
	}
})

const renderMobileMenu = (props = {}) => {
	const defaultProps = {
		id: 'mobile-menu-test',
		isOpen: true,
		onClose: vi.fn()
	}

	return render(
		<BrowserRouter>
			<MobileMenu {...defaultProps} {...props} />
		</BrowserRouter>
	)
}

describe('MobileMenu', () => {
	beforeEach(() => {
		// Reset location mock
		mockLocation.pathname = '/'
		vi.clearAllMocks()
	})

	it('renders when open', () => {
		renderMobileMenu()
		expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
	})

	it('does not render when closed', () => {
		renderMobileMenu({isOpen: false})
		expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
	})

	it('renders all navigation items', () => {
		renderMobileMenu()

		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('Library')).toBeInTheDocument()
		expect(screen.getByText('Builder')).toBeInTheDocument()
	})

	it('highlights active navigation item', () => {
		// Mock current location
		mockLocation.pathname = '/exercises'

		renderMobileMenu()

		const libraryLink = screen.getByText('Library').closest('a')
		expect(libraryLink).toHaveClass(
			'bg-[var(--color-primary)]/10',
			'text-[var(--color-primary)]'
		)
	})

	it('shows home as active when on root path', () => {
		mockLocation.pathname = '/'

		renderMobileMenu()

		const homeLink = screen.getByText('Home').closest('a')
		expect(homeLink).toHaveClass(
			'bg-[var(--color-primary)]/10',
			'text-[var(--color-primary)]'
		)
	})

	it('calls onClose when navigation item is clicked', async () => {
		const user = userEvent.setup()
		const mockOnClose = vi.fn()

		renderMobileMenu({onClose: mockOnClose})

		const homeLink = screen.getByText('Home')
		await user.click(homeLink)

		expect(mockOnClose).toHaveBeenCalled()
	})

	it('calls onClose when backdrop is clicked', async () => {
		const user = userEvent.setup()
		const mockOnClose = vi.fn()

		renderMobileMenu({onClose: mockOnClose})

		// The backdrop should be the first div with the bg-black/20 class
		const backdrop = screen.getByTestId('mobile-menu').previousElementSibling
		expect(backdrop).toHaveClass('bg-black/20')

		await user.click(backdrop as Element)
		expect(mockOnClose).toHaveBeenCalled()
	})

	it('renders settings section', () => {
		renderMobileMenu()
		expect(screen.getByText('Settings')).toBeInTheDocument()
	})

	it('renders theme toggle and language dropdown in settings', () => {
		renderMobileMenu()
		expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
		expect(screen.getByTestId('language-dropdown')).toBeInTheDocument()
	})

	it('has correct menu id', () => {
		const menuId = 'test-menu-id'
		renderMobileMenu({id: menuId})

		const menu = screen.getByTestId('mobile-menu')
		expect(menu).toHaveAttribute('id', menuId)
	})

	it('renders navigation icons', () => {
		renderMobileMenu()

		// Check for emoji icons
		expect(screen.getByText('🏠')).toBeInTheDocument() // Home
		expect(screen.getByText('📚')).toBeInTheDocument() // Library
		expect(screen.getByText('🔧')).toBeInTheDocument() // Builder
	})

	it('has proper accessibility structure', () => {
		renderMobileMenu()

		// Check that links have proper href attributes
		const homeLink = screen.getByText('Home').closest('a')
		const libraryLink = screen.getByText('Library').closest('a')
		const builderLink = screen.getByText('Builder').closest('a')

		expect(homeLink).toHaveAttribute('href', '/')
		expect(libraryLink).toHaveAttribute('href', '/exercises')
		expect(builderLink).toHaveAttribute('href', '/builder')
	})

	it('applies correct inactive styles to non-active items', () => {
		mockLocation.pathname = '/exercises' // Library is active

		renderMobileMenu()

		const homeLink = screen.getByText('Home').closest('a')
		const builderLink = screen.getByText('Builder').closest('a')

		// These should have inactive styles
		expect(homeLink).toHaveClass('text-[var(--color-text-secondary)]')
		expect(builderLink).toHaveClass('text-[var(--color-text-secondary)]')
	})
})
