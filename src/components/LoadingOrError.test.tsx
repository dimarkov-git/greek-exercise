import {describe, expect, it} from 'vitest'
import {render, screen} from '@/test-utils'
import {LoadingOrError} from './LoadingOrError'

describe('LoadingOrError', () => {
	it('displays loading message when no error is provided', () => {
		render(<LoadingOrError />)

		expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument()
		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	it('displays error message when error is provided', () => {
		const testError = new Error('Something went wrong')

		render(<LoadingOrError error={testError} />)

		expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument()
		expect(screen.getByText('Something went wrong')).toBeInTheDocument()
		expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
	})

	it('handles empty error message gracefully', () => {
		const emptyError = new Error('')

		render(<LoadingOrError error={emptyError} />)

		const heading = screen.getByRole('heading', {level: 1})
		expect(heading).toBeInTheDocument()
		// When error message is empty, the heading should be empty
		expect(heading).toHaveTextContent('')
	})

	it('applies correct CSS classes for layout', () => {
		render(<LoadingOrError />)

		const container = screen.getByText('Loading...').parentElement
		expect(container).toHaveClass(
			'flex',
			'min-h-screen',
			'items-center',
			'justify-center'
		)
	})

	it('applies correct CSS classes to heading', () => {
		render(<LoadingOrError />)

		const heading = screen.getByRole('heading', {level: 1})
		expect(heading).toHaveClass('text-xl')
	})

	it('handles undefined error property correctly', () => {
		render(<LoadingOrError />)

		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	it('displays different error messages', () => {
		const networkError = new Error('Network connection failed')

		render(<LoadingOrError error={networkError} />)

		expect(screen.getByText('Network connection failed')).toBeInTheDocument()
	})
})
