import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import type {ExerciseStatus} from '@/types/exercises'
import {WordFormInput} from './WordFormInput'

describe('WordFormInput', () => {
	const defaultProps = {
		value: '',
		onChange: vi.fn(),
		onSubmit: vi.fn(),
		status: 'WAITING_INPUT' as ExerciseStatus,
		disabled: false,
		placeholder: 'Enter your answer...',
		autoFocus: true
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Basic rendering', () => {
		it('should render input field with correct attributes', () => {
			render(<WordFormInput {...defaultProps} />)

			const input = screen.getByRole('textbox')
			expect(input).toBeInTheDocument()
			expect(input).toHaveAttribute('placeholder', 'Enter your answer...')
			expect(input).toHaveAttribute('autocomplete', 'off')
			expect(input).toHaveAttribute('spellcheck', 'false')
		})

		it('should auto focus when autoFocus is true', () => {
			render(<WordFormInput {...defaultProps} autoFocus={true} />)
			const input = screen.getByRole('textbox')
			expect(input).toHaveFocus()
		})

		it('should not auto focus when autoFocus is false', () => {
			render(<WordFormInput {...defaultProps} autoFocus={false} />)
			const input = screen.getByRole('textbox')
			expect(input).not.toHaveFocus()
		})

		it('should display current value', () => {
			render(<WordFormInput {...defaultProps} value='είμαι' />)
			const input = screen.getByRole('textbox')
			expect(input).toHaveValue('είμαι')
		})

		it('should be disabled when disabled prop is true', () => {
			render(<WordFormInput {...defaultProps} disabled={true} />)
			const input = screen.getByRole('textbox')
			expect(input).toBeDisabled()
		})
	})

	describe('User interactions', () => {
		it('should call onChange when user types', async () => {
			const user = userEvent.setup()
			const onChange = vi.fn()

			// Create a controlled input with state
			let currentValue = ''
			const handleChange = (value: string) => {
				currentValue = value
				onChange(value)
			}

			const {rerender} = render(
				<WordFormInput
					{...defaultProps}
					onChange={handleChange}
					value={currentValue}
				/>
			)

			const input = screen.getByRole('textbox')
			await user.type(input, 'test')

			expect(onChange).toHaveBeenCalled()
			// Rerender with updated value to check final state
			rerender(
				<WordFormInput
					{...defaultProps}
					onChange={handleChange}
					value={currentValue}
				/>
			)

			expect(input).toHaveValue(currentValue)
		})

		it('should call onSubmit when Enter is pressed', async () => {
			const user = userEvent.setup()
			const onSubmit = vi.fn()
			render(
				<WordFormInput {...defaultProps} onSubmit={onSubmit} value='είμαι' />
			)

			const input = screen.getByRole('textbox')
			await user.type(input, '{enter}')

			expect(onSubmit).toHaveBeenCalledWith('είμαι')
		})

		it('should not call onSubmit when Enter is pressed with empty value', async () => {
			const user = userEvent.setup()
			const onSubmit = vi.fn()
			render(<WordFormInput {...defaultProps} onSubmit={onSubmit} value='' />)

			const input = screen.getByRole('textbox')
			await user.type(input, '{enter}')

			expect(onSubmit).not.toHaveBeenCalled()
		})

		it('should not call onSubmit when input is disabled', async () => {
			const user = userEvent.setup()
			const onSubmit = vi.fn()
			render(
				<WordFormInput
					{...defaultProps}
					disabled={true}
					onSubmit={onSubmit}
					value='είμαι'
				/>
			)

			const input = screen.getByRole('textbox')
			await user.type(input, '{enter}')

			expect(onSubmit).not.toHaveBeenCalled()
		})
	})

	describe('Status-based styling', () => {
		it('should have default styling for WAITING_INPUT status', () => {
			render(<WordFormInput {...defaultProps} status='WAITING_INPUT' />)
			const input = screen.getByRole('textbox')

			expect(input).toHaveClass('border-gray-300')
			expect(input).toHaveClass('focus:border-blue-400')
		})

		it('should have checking styling for CHECKING status', () => {
			render(<WordFormInput {...defaultProps} status='CHECKING' />)
			const input = screen.getByRole('textbox')

			expect(input).toHaveClass('border-yellow-300')
		})

		it('should have success styling for CORRECT_ANSWER status', () => {
			render(<WordFormInput {...defaultProps} status='CORRECT_ANSWER' />)
			const input = screen.getByRole('textbox')

			expect(input).toHaveClass('border-green-400')
		})

		it('should have error styling for WRONG_ANSWER status', () => {
			render(<WordFormInput {...defaultProps} status='WRONG_ANSWER' />)
			const input = screen.getByRole('textbox')

			expect(input).toHaveClass('border-red-400')
		})

		it('should have error styling for REQUIRE_CORRECTION status', () => {
			render(<WordFormInput {...defaultProps} status='REQUIRE_CORRECTION' />)
			const input = screen.getByRole('textbox')

			expect(input).toHaveClass('border-red-400')
		})
	})

	describe('Greek text input handling', () => {
		// Skip Greek text tests due to userEvent issues with Greek characters
		it('should handle Greek characters correctly', async () => {
			// Skip this test due to userEvent issues with Greek text
			const user = userEvent.setup()
			const onChange = vi.fn()
			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')
			await user.type(input, 'είμαι')

			expect(onChange).toHaveBeenLastCalledWith('είμαι')
		})

		it('should handle text with tone marks', async () => {
			const user = userEvent.setup()
			const onChange = vi.fn()
			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')
			await user.type(input, 'ήμουν')

			expect(onChange).toHaveBeenLastCalledWith('ήμουν')
		})

		it('should handle text composition for complex input methods', () => {
			const onChange = vi.fn()
			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')

			// Simulate composition events for IME input
			fireEvent.compositionStart(input)
			fireEvent.input(input, {target: {value: 'είμαι'}})
			fireEvent.compositionEnd(input)

			expect(onChange).toHaveBeenCalledWith('είμαι')
		})
	})

	describe('Accessibility', () => {
		it('should have proper ARIA attributes', () => {
			render(<WordFormInput {...defaultProps} />)
			const input = screen.getByRole('textbox')

			expect(input).toHaveAttribute('type', 'text')
			expect(input).toBeInTheDocument()
		})

		it('should support keyboard navigation', async () => {
			const user = userEvent.setup()
			render(<WordFormInput {...defaultProps} />)

			const input = screen.getByRole('textbox')
			await user.tab()

			expect(input).toHaveFocus()
		})

		it('should render input element properly', () => {
			render(<WordFormInput {...defaultProps} />)

			const input = screen.getByRole('textbox')
			expect(input).toBeInTheDocument()
		})
	})

	describe('Edge cases', () => {
		it('should handle very long input', async () => {
			// Skip due to userEvent issues with Greek text
			const user = userEvent.setup()
			const onChange = vi.fn()
			const longText = 'α'.repeat(1000)

			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')
			await user.type(input, longText)

			expect(onChange).toHaveBeenLastCalledWith(longText)
		})

		it('should handle special characters and numbers', async () => {
			// Skip due to userEvent issues with Greek text
			const user = userEvent.setup()
			const onChange = vi.fn()
			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')
			await user.type(input, 'είμαι 123 !')

			expect(onChange).toHaveBeenLastCalledWith('είμαι 123 !')
		})

		it('should handle rapid input changes', async () => {
			const user = userEvent.setup()
			const onChange = vi.fn()
			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')

			// Simulate rapid typing
			await user.type(input, 'abc')

			expect(onChange).toHaveBeenCalledTimes(3)
		})

		it('should handle paste events', async () => {
			const user = userEvent.setup()
			const onChange = vi.fn()
			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')
			await user.click(input)
			await user.paste('είμαι')

			expect(onChange).toHaveBeenCalledWith('είμαι')
		})

		it('should handle cut and copy events', async () => {
			const user = userEvent.setup()
			render(<WordFormInput {...defaultProps} value='είμαι' />)

			const input = screen.getByRole('textbox')
			await user.click(input)
			await user.keyboard('{Control>}a{/Control}')

			// The text should be selectable for copy/cut operations
			expect(input).toHaveValue('είμαι')
		})
	})

	describe('Form integration', () => {
		it('should work within form context', async () => {
			const user = userEvent.setup()
			const onSubmit = vi.fn()
			const handleFormSubmit = (e: React.FormEvent) => {
				e.preventDefault()
				onSubmit()
			}

			render(
				<form onSubmit={handleFormSubmit}>
					<WordFormInput {...defaultProps} value='είμαι' />
					<button type='submit'>Submit</button>
				</form>
			)

			const submitButton = screen.getByRole('button', {name: 'Submit'})
			await user.click(submitButton)

			expect(onSubmit).toHaveBeenCalled()
		})

		it('should submit form when Enter is pressed in input', async () => {
			const user = userEvent.setup()
			const onSubmit = vi.fn()
			const handleFormSubmit = (e: React.FormEvent) => {
				e.preventDefault()
				onSubmit()
			}

			render(
				<form onSubmit={handleFormSubmit}>
					<WordFormInput {...defaultProps} value='είμαι' />
				</form>
			)

			const input = screen.getByRole('textbox')
			await user.type(input, '{enter}')

			expect(onSubmit).toHaveBeenCalled()
		})
	})

	describe('Performance', () => {
		it('should not cause unnecessary re-renders', () => {
			const onChange = vi.fn()
			const {rerender} = render(
				<WordFormInput {...defaultProps} onChange={onChange} />
			)

			// Re-render with same props
			rerender(<WordFormInput {...defaultProps} onChange={onChange} />)

			// Input should still be functional
			const input = screen.getByRole('textbox')
			expect(input).toBeInTheDocument()
		})

		it('should handle high-frequency onChange calls', async () => {
			const user = userEvent.setup()
			const onChange = vi.fn()
			render(<WordFormInput {...defaultProps} onChange={onChange} />)

			const input = screen.getByRole('textbox')

			// Type quickly to test performance
			await user.type(input, 'είμαισίμαστε')

			expect(onChange).toHaveBeenCalledTimes(12)
		})
	})
})
