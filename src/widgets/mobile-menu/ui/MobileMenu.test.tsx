import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import type {ReactNode} from 'react'
import {BrowserRouter} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {MobileMenu} from './MobileMenu'

// Mock language dropdown and theme toggle
vi.mock('@/shared/ui/language-dropdown', () => ({
	LanguageDropdown: () => (
		<div data-testid='language-dropdown'>Language Dropdown</div>
	)
}))

vi.mock('@/shared/ui/theme-toggle', () => ({
	ThemeToggle: () => <div data-testid='theme-toggle'>Theme Toggle</div>
}))

// Create QueryClient for tests
let queryClient: QueryClient

const createWrapper = () => {
	queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0
			}
		}
	})

	return function Wrapper({children}: {children: ReactNode}) {
		return (
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>{children}</BrowserRouter>
			</QueryClientProvider>
		)
	}
}

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

	return render(<MobileMenu {...defaultProps} {...props} />, {
		wrapper: createWrapper()
	})
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

	it('renders all navigation items', async () => {
		renderMobileMenu()

		// Wait for translations to load from MSW
		expect(await screen.findByText('Home')).toBeInTheDocument()
		expect(await screen.findByText('Library')).toBeInTheDocument()
		expect(await screen.findByText('Builder')).toBeInTheDocument()
	})

	it('highlights active navigation item', async () => {
		// Mock current location
		mockLocation.pathname = '/exercises'

		renderMobileMenu()

		// Wait for translations to load
		const libraryLink = (await screen.findByText('Library')).closest('a')
		expect(libraryLink).toHaveClass(
			'bg-[var(--color-primary)]/10',
			'text-[var(--color-primary)]'
		)
	})

	it('shows home as active when on root path', async () => {
		mockLocation.pathname = '/'

		renderMobileMenu()

		// Wait for translations to load
		const homeLink = (await screen.findByText('Home')).closest('a')
		expect(homeLink).toHaveClass(
			'bg-[var(--color-primary)]/10',
			'text-[var(--color-primary)]'
		)
	})

	it('calls onClose when navigation item is clicked', async () => {
		const user = userEvent.setup()
		const mockOnClose = vi.fn()

		renderMobileMenu({onClose: mockOnClose})

		// Wait for translations to load
		const homeLink = await screen.findByText('Home')
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

	it('renders settings section', async () => {
		renderMobileMenu()
		expect(await screen.findByText('Settings')).toBeInTheDocument()
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

	it('has proper accessibility structure', async () => {
		renderMobileMenu()

		// Wait for translations and check that links have proper href attributes
		const homeLink = (await screen.findByText('Home')).closest('a')
		const libraryLink = (await screen.findByText('Library')).closest('a')
		const builderLink = (await screen.findByText('Builder')).closest('a')

		expect(homeLink).toHaveAttribute('href', '/')
		expect(libraryLink).toHaveAttribute('href', '/exercises')
		expect(builderLink).toHaveAttribute('href', '/builder')
	})

	it('applies correct inactive styles to non-active items', async () => {
		mockLocation.pathname = '/exercises' // Library is active

		renderMobileMenu()

		// Wait for translations to load
		const homeLink = (await screen.findByText('Home')).closest('a')
		const builderLink = (await screen.findByText('Builder')).closest('a')

		// These should have inactive styles
		expect(homeLink).toHaveClass('text-[var(--color-text-secondary)]')
		expect(builderLink).toHaveClass('text-[var(--color-text-secondary)]')
	})
})
