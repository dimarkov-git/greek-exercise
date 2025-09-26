import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {AppErrorBoundary} from './AppErrorBoundary'

// Mock LoadingOrError component
vi.mock('@/components/LoadingOrError', () => ({
	LoadingOrError: ({error}: {error?: Error}) => (
		<div data-testid='loading-or-error'>
			{error ? `Error: ${error.message}` : 'Loading...'}
		</div>
	)
}))

describe('AppErrorBoundary', () => {
	it('renders children when there are no errors', () => {
		render(
			<AppErrorBoundary>
				<div data-testid='child-component'>Child Content</div>
			</AppErrorBoundary>
		)

		expect(screen.getByTestId('child-component')).toBeInTheDocument()
		expect(screen.getByText('Child Content')).toBeInTheDocument()
	})

	it('renders LoadingOrError fallback when child component throws error', () => {
		// Mock console.error to avoid error logs in test output
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {})

		function ThrowError(): React.JSX.Element {
			throw new Error('Test error message')
		}

		render(
			<AppErrorBoundary>
				<ThrowError />
			</AppErrorBoundary>
		)

		expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
		expect(screen.getByText('Error: Test error message')).toBeInTheDocument()

		consoleErrorSpy.mockRestore()
	})

	it('catches different types of errors', () => {
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {})

		function ThrowTypeError(): React.JSX.Element {
			throw new TypeError('Type error occurred')
		}

		render(
			<AppErrorBoundary>
				<ThrowTypeError />
			</AppErrorBoundary>
		)

		expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
		expect(screen.getByText('Error: Type error occurred')).toBeInTheDocument()

		consoleErrorSpy.mockRestore()
	})

	it('isolates errors to prevent cascade failures', () => {
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {})

		function WorkingComponent() {
			return <div data-testid='working-component'>I work fine</div>
		}

		function BrokenComponent(): React.JSX.Element {
			throw new Error('I am broken')
		}

		render(
			<div>
				<AppErrorBoundary>
					<BrokenComponent />
				</AppErrorBoundary>
				<WorkingComponent />
			</div>
		)

		// Error boundary should catch the error
		expect(screen.getByTestId('loading-or-error')).toBeInTheDocument()
		expect(screen.getByText('Error: I am broken')).toBeInTheDocument()

		// Working component should still render
		expect(screen.getByTestId('working-component')).toBeInTheDocument()

		consoleErrorSpy.mockRestore()
	})
})
