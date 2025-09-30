import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {type RenderOptions, render as rtlRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {PropsWithChildren, ReactElement} from 'react'
import {MemoryRouter} from 'react-router'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: Number.POSITIVE_INFINITY,
			retry: false,
			refetchOnWindowFocus: false
		}
	}
})

export function render(
	ui: ReactElement,
	{route, ...options}: Omit<RenderOptions, 'wrapper'> & {route?: string} = {
		reactStrictMode: true
	}
) {
	const normalizedRoute = route ?? '/'
	const formattedRoute = normalizedRoute.startsWith('/')
		? normalizedRoute
		: `/${normalizedRoute}`

	queryClient.clear()

	return {
		user: userEvent.setup(),
		...rtlRender(ui, {
			wrapper: ({children}: PropsWithChildren) => (
				<QueryClientProvider client={queryClient}>
					<MemoryRouter initialEntries={[formattedRoute]}>
						{children}
					</MemoryRouter>
				</QueryClientProvider>
			),
			...options
		})
	}
}

// Re-export testing library utilities for convenience
export {
	act,
	cleanup,
	fireEvent,
	renderHook,
	screen,
	waitFor,
	within
} from '@testing-library/react'

// Export layout hook for tests that need it
export {useLayout} from '@/shared/lib'
