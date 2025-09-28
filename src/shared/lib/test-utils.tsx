import {QueryClientProvider} from '@tanstack/react-query'
import {type RenderOptions, render as rtlRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {PropsWithChildren, ReactElement} from 'react'
import {MemoryRouter} from 'react-router'
import {createQueryClient} from '@/app/queryClient'

export const queryClient = createQueryClient({
	queries: {
		gcTime: Number.POSITIVE_INFINITY,
		retry: false,
		refetchOnWindowFocus: false
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

// biome-ignore lint: test file
export * from '@testing-library/react'
