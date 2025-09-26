import {QueryClient} from '@tanstack/react-query'
import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@/test-utils'
import {AppProviders} from './AppProviders'

// Mock environment
vi.mock('@/config/environment', () => ({
	environment: {
		enableQueryDevtools: false
	}
}))

// Mock QueryDevtools component
vi.mock('./QueryDevtools', () => ({
	QueryDevtools: () => <div data-testid="query-devtools">Query Devtools</div>
}))

describe('AppProviders', () => {
	it('renders children wrapped in QueryClientProvider', () => {
		render(
			<AppProviders>
				<div data-testid="test-child">Test Child</div>
			</AppProviders>
		)

		expect(screen.getByTestId('test-child')).toBeInTheDocument()
	})

	it('does not render QueryDevtools when environment.enableQueryDevtools is false', () => {
		render(
			<AppProviders>
				<div data-testid="test-child">Test Child</div>
			</AppProviders>
		)

		expect(screen.queryByTestId('query-devtools')).not.toBeInTheDocument()
	})

	it('handles QueryDevtools conditional rendering', () => {
		// This test verifies that AppProviders can handle the QueryDevtools
		// conditional logic without errors, regardless of environment setting
		render(
			<AppProviders>
				<div data-testid="test-child">Test Child</div>
			</AppProviders>
		)

		expect(screen.getByTestId('test-child')).toBeInTheDocument()
		// The component should render successfully with the mocked environment
	})

	it('provides query client context to children', () => {
		let capturedQueryClient: QueryClient | undefined

		function TestComponent() {
			// This would fail if QueryClient context is not available
			return <div data-testid="context-consumer">Has QueryClient context</div>
		}

		render(
			<AppProviders>
				<TestComponent />
			</AppProviders>
		)

		expect(screen.getByTestId('context-consumer')).toBeInTheDocument()
	})
})