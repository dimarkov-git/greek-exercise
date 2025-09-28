import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {
	Button,
	ErrorButton,
	GhostButton,
	IconButton,
	InfoButton,
	LinkButton,
	LoadingButton,
	OutlineButton,
	PrimaryButton,
	SecondaryButton,
	SuccessButton,
	WarningButton
} from './button'

describe('Button', () => {
	it('renders with default variant and size', () => {
		render(<Button>Click me</Button>)
		const button = screen.getByRole('button', {name: 'Click me'})

		expect(button).toBeInTheDocument()
		expect(button).toHaveClass('h-10', 'px-4', 'py-2')
	})

	it('handles click events', async () => {
		const handleClick = vi.fn()
		const user = userEvent.setup()

		render(<Button onClick={handleClick}>Click me</Button>)
		const button = screen.getByRole('button')

		await user.click(button)
		expect(handleClick).toHaveBeenCalledOnce()
	})

	it('renders with loading state', () => {
		render(<Button loading>Loading</Button>)
		const button = screen.getByRole('button')

		expect(button).toBeDisabled()
		expect(button.querySelector('.animate-spin')).toBeInTheDocument()
	})

	it('disables motion when loading', () => {
		render(<Button loading motionEnabled>Loading</Button>)
		const button = screen.getByRole('button')

		expect(button).toBeDisabled()
	})

	it('renders with different sizes', () => {
		render(
			<>
				<Button size='sm'>Small</Button>
				<Button size='lg'>Large</Button>
				<Button size='xl'>Extra Large</Button>
				<Button size='icon'>I</Button>
			</>
		)

		expect(screen.getByRole('button', {name: 'Small'})).toHaveClass('h-8')
		expect(screen.getByRole('button', {name: 'Large'})).toHaveClass('h-12')
		expect(screen.getByRole('button', {name: 'Extra Large'})).toHaveClass('h-14')
		expect(screen.getByRole('button', {name: 'I'})).toHaveClass('h-10', 'w-10')
	})

	it('renders with different variants', () => {
		render(
			<>
				<Button variant='primary'>Primary</Button>
				<Button variant='secondary'>Secondary</Button>
				<Button variant='success'>Success</Button>
				<Button variant='error'>Error</Button>
				<Button variant='warning'>Warning</Button>
				<Button variant='info'>Info</Button>
				<Button variant='outline'>Outline</Button>
				<Button variant='ghost'>Ghost</Button>
				<Button variant='link'>Link</Button>
			</>
		)

		expect(screen.getByRole('button', {name: 'Primary'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Secondary'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Success'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Error'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Warning'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Info'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Outline'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Ghost'})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: 'Link'})).toBeInTheDocument()
	})

	it('handles disabled state correctly', () => {
		const handleClick = vi.fn()
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>
		)
		const button = screen.getByRole('button')

		expect(button).toBeDisabled()
		expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
	})
})

// Test specialized button variants
describe('Specialized Button variants', () => {
	it('renders PrimaryButton', () => {
		render(<PrimaryButton>Primary</PrimaryButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders SecondaryButton', () => {
		render(<SecondaryButton>Secondary</SecondaryButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders SuccessButton', () => {
		render(<SuccessButton>Success</SuccessButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders ErrorButton', () => {
		render(<ErrorButton>Error</ErrorButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders WarningButton', () => {
		render(<WarningButton>Warning</WarningButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders InfoButton', () => {
		render(<InfoButton>Info</InfoButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders OutlineButton', () => {
		render(<OutlineButton>Outline</OutlineButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders GhostButton', () => {
		render(<GhostButton>Ghost</GhostButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders LinkButton', () => {
		render(<LinkButton>Link</LinkButton>)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders IconButton', () => {
		render(<IconButton>🏠</IconButton>)
		expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
	})

	it('renders LoadingButton with loading state', () => {
		render(<LoadingButton loading>Loading</LoadingButton>)
		const button = screen.getByRole('button')

		expect(button).toHaveTextContent('Loading...')
		expect(button.querySelector('.animate-spin')).toBeInTheDocument()
	})

	it('renders LoadingButton without loading state', () => {
		render(<LoadingButton loading={false}>Not Loading</LoadingButton>)
		const button = screen.getByRole('button')

		expect(button).toHaveTextContent('Not Loading')
		expect(button.querySelector('.animate-spin')).not.toBeInTheDocument()
	})
})