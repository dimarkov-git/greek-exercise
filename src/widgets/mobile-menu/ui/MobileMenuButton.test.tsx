import {render, screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {MobileMenuButton} from './MobileMenuButton'

// Mock the translations
vi.mock('@/shared/lib/i18n', () => ({
	mobileMenuButtonTranslations: {
		keys: ['navigation.menu', 'navigation.close'],
		getRequest: vi.fn(() => ({key: 'test', fallback: 'test'}))
	},
	useTranslations: vi.fn(() => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'navigation.menu': 'Menu',
				'navigation.close': 'Close'
			}
			return translations[key] || key
		},
		isLoading: false
	}))
}))

// Mock framer motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
	motion: {
		button: ({
			children,
			...props
		}: React.ComponentProps<'button'> & {children: React.ReactNode}) => (
			<button {...props}>{children}</button>
		)
	}
}))

const renderMobileMenuButton = (props = {}) => {
	const defaultProps = {
		isOpen: false,
		menuId: 'mobile-menu-test',
		onClick: vi.fn()
	}

	return render(<MobileMenuButton {...defaultProps} {...props} />)
}

describe('MobileMenuButton', () => {
	it('renders button', () => {
		renderMobileMenuButton()
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('shows menu label when closed', () => {
		renderMobileMenuButton({isOpen: false})
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-label', 'Menu')
	})

	it('shows close label when open', () => {
		renderMobileMenuButton({isOpen: true})
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-label', 'Close')
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

	it('has proper SVG accessibility', () => {
		renderMobileMenuButton({isOpen: false})
		const title = screen.getByRole('button').querySelector('svg title')

		expect(title).toHaveTextContent('Menu')
	})

	it('updates SVG title when state changes', () => {
		renderMobileMenuButton({isOpen: true})
		const title = screen.getByRole('button').querySelector('svg title')

		expect(title).toHaveTextContent('Close')
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
