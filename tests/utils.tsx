import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {
	type RenderHookOptions,
	type RenderHookResult,
	type RenderOptions,
	render as rtlRender,
	renderHook as rtlRenderHook
} from '@testing-library/react'
import userEventInstance from '@testing-library/user-event'
import type {PropsWithChildren, ReactNode} from 'react'
import {MemoryRouter, type MemoryRouterProps} from 'react-router'

const noop = () => {
	// intentionally empty: silence React Query logging during tests
}

interface TestProvidersProps {
	children: ReactNode
	queryClient: QueryClient
	routerProps: MemoryRouterProps
}

// biome-ignore lint/style/useComponentExportOnlyModules: internal test harness
function TestProviders({
	children,
	queryClient,
	routerProps
}: TestProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<MemoryRouter {...routerProps}>{children}</MemoryRouter>
		</QueryClientProvider>
	)
}

export function createTestQueryClient(): QueryClient {
	const queryClient = new QueryClient({
		logger: {log: noop, warn: noop, error: noop},
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
				cacheTime: 0
			},
			mutations: {
				retry: false
			}
		}
	})

	queryClient.setDefaultOptions({
		queries: {
			...queryClient.getDefaultOptions().queries,
			refetchOnWindowFocus: false
		}
	})

	return queryClient
}

interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	route?: string
	router?: MemoryRouterProps
	queryClient?: QueryClient
}

function resolveRouterOptions(
	route: string | undefined,
	router: MemoryRouterProps | undefined
): MemoryRouterProps {
	const initialEntries = router?.initialEntries ?? [route ?? '/']
	return {
		initialEntries,
		initialIndex: router?.initialIndex
	}
}

export function render(
	ui: ReactNode,
	{
		route,
		router,
		queryClient: providedClient,
		...renderOptions
	}: AppRenderOptions = {}
) {
	const queryClient = providedClient ?? createTestQueryClient()
	const routerProps = resolveRouterOptions(route, router)

	const result = rtlRender(ui as ReactNode, {
		wrapper: ({children}: PropsWithChildren) => (
			<TestProviders queryClient={queryClient} routerProps={routerProps}>
				{children}
			</TestProviders>
		),
		...renderOptions
	})

	return {
		user: userEventInstance.setup(),
		queryClient,
		...result
	}
}

interface HookRenderOptions<Properties>
	extends Omit<RenderHookOptions<Properties>, 'wrapper'> {
	router?: MemoryRouterProps
	route?: string
	queryClient?: QueryClient
}

export function renderHook<Result, Properties>(
	callback: (props: Properties) => Result,
	{
		router,
		route,
		queryClient: providedClient,
		...hookOptions
	}: HookRenderOptions<Properties> = {}
): RenderHookResult<Result, Properties> & {queryClient: QueryClient} {
	const queryClient = providedClient ?? createTestQueryClient()
	const routerProps = resolveRouterOptions(route, router)

	const result = rtlRenderHook(callback, {
		wrapper: ({children}: PropsWithChildren) => (
			<TestProviders queryClient={queryClient} routerProps={routerProps}>
				{children}
			</TestProviders>
		),
		...hookOptions
	})

	return {
		queryClient,
		...result
	}
}

export const userEvent = userEventInstance
