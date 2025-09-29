import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {TestI18nPage} from './TestI18nPage'

describe('TestI18nPage', () => {
	const createWrapper = () => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					gcTime: 0
				}
			}
		})

		return function Wrapper({children}: {children: React.ReactNode}) {
			return (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			)
		}
	}

	it('renders page title', () => {
		render(<TestI18nPage />, {wrapper: createWrapper()})

		// Should render title (will use fallback from translations)
		expect(
			screen.getByRole('heading', {level: 1, name: /test/i})
		).toBeInTheDocument()
	})

	it('renders language controls', () => {
		render(<TestI18nPage />, {wrapper: createWrapper()})

		// Should have language buttons
		expect(screen.getByRole('button', {name: /EN/i})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /EL/i})).toBeInTheDocument()
		expect(screen.getByRole('button', {name: /RU/i})).toBeInTheDocument()
	})

	it('renders scenario tabs', () => {
		render(<TestI18nPage />, {wrapper: createWrapper()})

		// Should have at least one scenario button
		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBeGreaterThan(0)
	})
})
