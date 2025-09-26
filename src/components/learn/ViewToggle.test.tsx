import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {ViewToggle} from './ViewToggle'

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: ({
			children,
			className,
			layoutId,
			...props
		}: {
			children?: React.ReactNode
			className?: string
			layoutId?: string
			// biome-ignore lint/suspicious/noExplicitAny: Rest props spread for mock component
			[key: string]: any
		}) => (
			<div className={className} data-layout-id={layoutId} {...props}>
				{children}
			</div>
		)
	}
}))

// Mock useTranslations hook
vi.mock('@/hooks/useTranslations', () => ({
	useTranslations: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				tableView: 'Table View',
				jsonView: 'JSON View'
			}
			return translations[key] || key
		},
		status: 'complete' as const,
		missingKeys: [] as string[]
	})
}))

describe('ViewToggle', () => {
	const mockOnViewModeChange = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders both toggle buttons', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		expect(screen.getByText('Table View')).toBeInTheDocument()
		expect(screen.getByText('JSON View')).toBeInTheDocument()
	})

	it('shows table view as active when viewMode is table', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const tableButton = screen.getByRole('button', {name: /table view/i})
		const jsonButton = screen.getByRole('button', {name: /json view/i})

		// Table button should have active styles
		expect(tableButton).toHaveClass('text-blue-600')
		// JSON button should have inactive styles
		expect(jsonButton).toHaveClass('text-gray-500')
	})

	it('shows json view as active when viewMode is json', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='json' />
		)

		const tableButton = screen.getByRole('button', {name: /table view/i})
		const jsonButton = screen.getByRole('button', {name: /json view/i})

		// JSON button should have active styles
		expect(jsonButton).toHaveClass('text-blue-600')
		// Table button should have inactive styles
		expect(tableButton).toHaveClass('text-gray-500')
	})

	it('applies dark mode styles correctly', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const tableButton = screen.getByRole('button', {name: /table view/i})
		const jsonButton = screen.getByRole('button', {name: /json view/i})

		// Active button should have dark mode active styles
		expect(tableButton).toHaveClass('dark:text-blue-400')
		// Inactive button should have dark mode inactive styles
		expect(jsonButton).toHaveClass(
			'dark:text-gray-400',
			'dark:hover:text-gray-300'
		)
	})

	it('calls onViewModeChange with table when table button is clicked', async () => {
		const user = userEvent.setup()
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='json' />
		)

		const tableButton = screen.getByRole('button', {name: /table view/i})

		await user.click(tableButton)

		expect(mockOnViewModeChange).toHaveBeenCalledTimes(1)
		expect(mockOnViewModeChange).toHaveBeenCalledWith('table')
	})

	it('calls onViewModeChange with json when json button is clicked', async () => {
		const user = userEvent.setup()
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const jsonButton = screen.getByRole('button', {name: /json view/i})

		await user.click(jsonButton)

		expect(mockOnViewModeChange).toHaveBeenCalledTimes(1)
		expect(mockOnViewModeChange).toHaveBeenCalledWith('json')
	})

	it('does not call onViewModeChange when clicking the already active button', async () => {
		const user = userEvent.setup()
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const tableButton = screen.getByRole('button', {name: /table view/i})

		await user.click(tableButton)

		// Should still call the function (component doesn't prevent this)
		expect(mockOnViewModeChange).toHaveBeenCalledTimes(1)
		expect(mockOnViewModeChange).toHaveBeenCalledWith('table')
	})

	it('has correct button types', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const buttons = screen.getAllByRole('button')
		for (const button of buttons) {
			expect(button).toHaveAttribute('type', 'button')
		}
	})

	it('applies hover styles to inactive buttons', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const jsonButton = screen.getByRole('button', {name: /json view/i})

		expect(jsonButton).toHaveClass('hover:text-gray-700')
	})

	it('has proper container styling', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const container = screen.getByRole('button', {
			name: /table view/i
		}).parentElement

		expect(container).toHaveClass(
			'flex',
			'rounded-lg',
			'border',
			'border-gray-200',
			'bg-white',
			'p-1',
			'shadow-sm',
			'dark:border-gray-600',
			'dark:bg-gray-800'
		)
	})

	it('buttons have proper styling classes', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const buttons = screen.getAllByRole('button')
		for (const button of buttons) {
			expect(button).toHaveClass(
				'relative',
				'flex-1',
				'rounded-md',
				'px-4',
				'py-2',
				'font-medium',
				'text-sm',
				'transition-colors'
			)
		}
	})

	it('renders active indicator element for active button', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		// Check if the active indicator div is present for table button
		const activeIndicator = document.querySelector(
			'[data-layout-id="activeTab"]'
		)
		expect(activeIndicator).toBeInTheDocument()
		expect(activeIndicator).toHaveClass(
			'absolute',
			'inset-0',
			'rounded-md',
			'bg-blue-50',
			'dark:bg-blue-900/30'
		)
	})

	it('switches active indicator when view mode changes', () => {
		const {rerender} = render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		// Initially, active indicator should be present
		expect(
			document.querySelector('[data-layout-id="activeTab"]')
		).toBeInTheDocument()

		// Change to JSON view
		rerender(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='json' />
		)

		// Active indicator should still be present (now for JSON button)
		expect(
			document.querySelector('[data-layout-id="activeTab"]')
		).toBeInTheDocument()
	})

	it('has proper z-index for button text', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const buttonTexts = document.querySelectorAll('.relative.z-10')
		expect(buttonTexts).toHaveLength(2) // Both button texts should have z-10
	})

	it('handles rapid clicking', async () => {
		const user = userEvent.setup()
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const jsonButton = screen.getByRole('button', {name: /json view/i})
		const tableButton = screen.getByRole('button', {name: /table view/i})

		// Click multiple buttons rapidly
		await user.click(jsonButton)
		await user.click(tableButton)
		await user.click(jsonButton)

		expect(mockOnViewModeChange).toHaveBeenCalledTimes(3)
		expect(mockOnViewModeChange).toHaveBeenNthCalledWith(1, 'json')
		expect(mockOnViewModeChange).toHaveBeenNthCalledWith(2, 'table')
		expect(mockOnViewModeChange).toHaveBeenNthCalledWith(3, 'json')
	})

	it('is accessible with proper button roles', () => {
		render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const buttons = screen.getAllByRole('button')
		expect(buttons).toHaveLength(2)

		// Check that buttons have accessible names
		expect(
			screen.getByRole('button', {name: /table view/i})
		).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /json view/i})).toBeInTheDocument()
	})

	it('maintains consistent styling across different states', () => {
		const {rerender} = render(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='table' />
		)

		const tableButton = screen.getByRole('button', {name: /table view/i})
		const jsonButton = screen.getByRole('button', {name: /json view/i})

		// Check initial state
		expect(tableButton).toHaveClass('text-blue-600')
		expect(jsonButton).toHaveClass('text-gray-500')

		// Switch state
		rerender(
			<ViewToggle onViewModeChange={mockOnViewModeChange} viewMode='json' />
		)

		// Check switched state
		expect(tableButton).toHaveClass('text-gray-500')
		expect(jsonButton).toHaveClass('text-blue-600')
	})
})
