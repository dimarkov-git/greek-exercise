import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import type {ReactNode} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {MobileMenuButton} from './MobileMenuButton'

// Mock framer motion to avoid animation complexity in tests
vi.mock('framer-motion', () => {
	const filterMotionProps = (props: Record<string, unknown>) => {
		const {
			whileHover: _whileHover,
			whileTap: _whileTap,
			whileFocus: _whileFocus,
			whileDrag: _whileDrag,
			initial: _initial,
			animate: _animate,
			exit: _exit,
			transition: _transition,
			variants: _variants,
			...rest
		} = props
		return rest
	}

	return {
		motion: {
			button: ({children, ...props}: React.ComponentProps<'button'>) => (
				<button {...filterMotionProps(props)}>{children}</button>
			)
		}
	}
})

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
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		)
	}
}

const renderMobileMenuButton = (props = {}) => {
	const defaultProps = {
		isOpen: false,
		menuId: 'mobile-menu-test',
		onClick: vi.fn()
	}

	return render(<MobileMenuButton {...defaultProps} {...props} />, {
		wrapper: createWrapper()
	})
}

describe('MobileMenuButton', () => {
	it('renders button', () => {
		renderMobileMenuButton()
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('shows menu label when closed', async () => {
		renderMobileMenuButton({isOpen: false})
		const button = screen.getByRole('button')
		// Wait for MSW to provide translations
		await waitFor(() => {
			expect(button).toHaveAttribute('aria-label', 'Menu')
		})
	})

	it('shows close label when open', async () => {
		renderMobileMenuButton({isOpen: true})
		const button = screen.getByRole('button')
		// Wait for MSW to provide translations
		await waitFor(() => {
			expect(button).toHaveAttribute('aria-label', 'Close')
		})
	})

	it('has correct aria-expanded attribute when closed', () => {
		renderMobileMenuButton({isOpen: false})
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-expanded', 'false')
	})

	it('has correct aria-expanded attribute when open', () => {
		renderMobileMenuButton({isOpen: true})
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-expanded', 'true')
	})

	it('has correct aria-controls attribute', () => {
		const menuId = 'test-menu-id'
		renderMobileMenuButton({menuId})
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-controls', menuId)
	})

	it('calls onClick when button is clicked', async () => {
		const user = userEvent.setup()
		const mockOnClick = vi.fn()

		renderMobileMenuButton({onClick: mockOnClick})

		const button = screen.getByRole('button')
		await user.click(button)

		expect(mockOnClick).toHaveBeenCalled()
	})

	it('has correct button type', () => {
		renderMobileMenuButton()
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('type', 'button')
	})

	it('renders hamburger icon when closed', () => {
		renderMobileMenuButton({isOpen: false})
		const svg = screen.getByRole('button').querySelector('svg')
		const path = svg?.querySelector('path')

		expect(path).toHaveAttribute('d', 'M4 6h16M4 12h16M4 18h16')
	})

	it('renders close icon when open', () => {
		renderMobileMenuButton({isOpen: true})
		const svg = screen.getByRole('button').querySelector('svg')
		const path = svg?.querySelector('path')

		expect(path).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12')
	})

	it('has rotate transformation when open', () => {
		renderMobileMenuButton({isOpen: true})
		const svg = screen.getByRole('button').querySelector('svg')

		expect(svg).toHaveClass('rotate-90')
	})

	it('does not have rotate transformation when closed', () => {
		renderMobileMenuButton({isOpen: false})
		const svg = screen.getByRole('button').querySelector('svg')

		expect(svg).not.toHaveClass('rotate-90')
	})

	it('has proper SVG accessibility', async () => {
		renderMobileMenuButton({isOpen: false})
		const title = screen.getByRole('button').querySelector('svg title')

		// Wait for MSW to provide translations
		await waitFor(() => {
			expect(title).toHaveTextContent('Menu')
		})
	})

	it('updates SVG title when state changes', async () => {
		renderMobileMenuButton({isOpen: true})
		const title = screen.getByRole('button').querySelector('svg title')

		// Wait for MSW to provide translations
		await waitFor(() => {
			expect(title).toHaveTextContent('Close')
		})
	})

	it('has mobile-only visibility classes', () => {
		renderMobileMenuButton()
		const button = screen.getByRole('button')

		expect(button).toHaveClass('md:hidden')
	})

	it('has proper styling classes', () => {
		renderMobileMenuButton()
		const button = screen.getByRole('button')

		expect(button).toHaveClass(
			'flex',
			'items-center',
			'justify-center',
			'rounded-lg',
			'border',
			'border-gray-300',
			'bg-white',
			'p-2'
		)
	})
})
