import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {
	EmailInput,
	Input,
	LoadingInput,
	NumberInput,
	PasswordInput,
	SearchInput,
	TextInput
} from './input'

describe('Input', () => {
	it('renders with default variant and size', () => {
		render(<Input placeholder='Enter text' />)
		const input = screen.getByRole('textbox')

		expect(input).toBeInTheDocument()
		expect(input).toHaveClass('h-10', 'px-4', 'py-2', 'text-sm')
	})

	it('handles value changes', async () => {
		const handleChange = vi.fn()
		const user = userEvent.setup()

		render(<Input onChange={handleChange} placeholder='Type here' />)
		const input = screen.getByRole('textbox')

		await user.type(input, 'Hello')
		expect(handleChange).toHaveBeenCalledTimes(5)
	})

	it('renders with different sizes', () => {
		render(
			<>
				<Input placeholder='Small' size='sm' />
				<Input placeholder='Large' size='lg' />
				<Input placeholder='Extra Large' size='xl' />
			</>
		)

		expect(screen.getByPlaceholderText('Small')).toHaveClass('h-8')
		expect(screen.getByPlaceholderText('Large')).toHaveClass('h-12')
		expect(screen.getByPlaceholderText('Extra Large')).toHaveClass('h-14')
	})

	it('renders with different variants', () => {
		render(
			<>
				<Input placeholder='Default' variant='default' />
				<Input placeholder='Success' variant='success' />
				<Input placeholder='Error' variant='error' />
				<Input placeholder='Warning' variant='warning' />
				<Input placeholder='Info' variant='info' />
				<Input placeholder='Ghost' variant='ghost' />
			</>
		)

		expect(screen.getByPlaceholderText('Default')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Success')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Error')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Warning')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Info')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Ghost')).toBeInTheDocument()
	})

	it('renders with left icon', () => {
		const icon = <span data-testid='left-icon'>🔍</span>
		render(<Input icon={icon} iconPosition='left' placeholder='Search' />)

		expect(screen.getByTestId('left-icon')).toBeInTheDocument()
	})

	it('renders with right icon', () => {
		const icon = <span data-testid='right-icon'>💡</span>
		render(<Input icon={icon} iconPosition='right' placeholder='Idea' />)

		expect(screen.getByTestId('right-icon')).toBeInTheDocument()
	})

	it('renders loading spinner', () => {
		render(<Input loading={true} placeholder='Loading...' />)
		const input = screen.getByRole('textbox')

		expect(input).toBeDisabled()
		expect(
			input.parentElement?.querySelector('.animate-spin')
		).toBeInTheDocument()
	})

	it('renders clear button when clearable and has value', async () => {
		const handleClear = vi.fn()
		const user = userEvent.setup()

		render(
			<Input
				clearable={true}
				onClear={handleClear}
				placeholder='Type and clear'
				value='Some text'
			/>
		)

		const clearButton = screen.getByRole('button')
		expect(clearButton).toBeInTheDocument()

		await user.click(clearButton)
		expect(handleClear).toHaveBeenCalledOnce()
	})

	it('does not render clear button when no value', () => {
		render(<Input clearable={true} placeholder='Empty input' value='' />)
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('handles disabled state correctly', () => {
		render(<Input disabled={true} placeholder='Disabled input' />)
		const input = screen.getByRole('textbox')

		expect(input).toBeDisabled()
		expect(input).toHaveClass(
			'disabled:cursor-not-allowed',
			'disabled:opacity-50'
		)
	})

	it('does not show clear button when disabled', () => {
		render(
			<Input
				clearable={true}
				disabled={true}
				placeholder='Disabled with clear'
				value='text'
			/>
		)
		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})
})

// Test specialized input variants
describe('Specialized Input variants', () => {
	it('renders SearchInput with search icon and clearable', () => {
		render(<SearchInput placeholder='Search...' />)
		const input = screen.getByRole('searchbox')

		expect(input).toBeInTheDocument()
		expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
	})

	it('renders EmailInput with email icon', () => {
		render(<EmailInput placeholder='Email...' />)
		const input = screen.getByRole('textbox')

		expect(input).toHaveAttribute('type', 'email')
		expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
	})

	it('renders PasswordInput with lock icon', () => {
		render(<PasswordInput placeholder='Password...' />)
		const input = screen.getByPlaceholderText('Password...')

		expect(input).toHaveAttribute('type', 'password')
		expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
	})

	it('renders NumberInput with number type', () => {
		render(<NumberInput placeholder='Number...' />)
		const input = screen.getByRole('spinbutton')

		expect(input).toHaveAttribute('type', 'number')
	})

	it('renders TextInput with text type', () => {
		render(<TextInput placeholder='Text...' />)
		const input = screen.getByRole('textbox')

		expect(input).toHaveAttribute('type', 'text')
	})

	it('renders LoadingInput with loading state', () => {
		render(<LoadingInput loading={true} placeholder='Loading...' />)
		const input = screen.getByRole('textbox')

		expect(input).toBeDisabled()
		expect(
			input.parentElement?.querySelector('.animate-spin')
		).toBeInTheDocument()
	})

	it('renders LoadingInput without loading state', () => {
		render(<LoadingInput loading={false} placeholder='Not loading...' />)
		const input = screen.getByRole('textbox')

		expect(input).not.toBeDisabled()
		expect(
			input.parentElement?.querySelector('.animate-spin')
		).not.toBeInTheDocument()
	})
})
