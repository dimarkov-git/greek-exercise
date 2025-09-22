import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {type RenderOptions, render as rtlRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {PropsWithChildren, ReactElement} from 'react'
import {HashRouter} from 'react-router'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {gcTime: Number.POSITIVE_INFINITY, retry: false}
	}
})

export function render(
	ui: ReactElement,
	{route, ...options}: Omit<RenderOptions, 'wrapper'> & {route?: string} = {
		reactStrictMode: true
	}
) {
	const normalizedRoute = route?.startsWith('#')
		? route.slice(1)
		: (route ?? '/')
	const formattedRoute = normalizedRoute.startsWith('/')
		? normalizedRoute
		: `/${normalizedRoute}`

	window.location.hash = `#${formattedRoute}`

	return {
		user: userEvent.setup(),
		...rtlRender(ui, {
			wrapper: ({children}: PropsWithChildren) => (
				<QueryClientProvider client={queryClient}>
					<HashRouter>{children}</HashRouter>
				</QueryClientProvider>
			),
			...options
		})
	}
}

// biome-ignore lint: test file
export * from '@testing-library/react'
