import {type DefaultOptions, QueryClient} from '@tanstack/react-query'

const baseQueryOptions: DefaultOptions = {
	queries: {
		retry: 2,
		staleTime: 5 * 60 * 1000,
		gcTime: 60 * 60 * 1000,
		refetchOnWindowFocus: false
	}
}

function mergeDefaultOptions(overrides?: DefaultOptions): DefaultOptions {
	if (!overrides) {
		return {
			...baseQueryOptions,
			queries: {...(baseQueryOptions.queries ?? {})}
		}
	}

	return {
		...baseQueryOptions,
		...overrides,
		queries: {
			...(baseQueryOptions.queries ?? {}),
			...(overrides.queries ?? {})
		}
	}
}

export function createQueryClient(overrides?: DefaultOptions) {
	return new QueryClient({
		defaultOptions: mergeDefaultOptions(overrides)
	})
}

export const queryClient = createQueryClient()
