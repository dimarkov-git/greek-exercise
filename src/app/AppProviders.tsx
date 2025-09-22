import {QueryClientProvider} from '@tanstack/react-query'
import type {PropsWithChildren} from 'react'
import {environment} from '@/config/environment'
import {QueryDevtools} from './QueryDevtools'
import {queryClient} from './queryClient'

export function AppProviders({children}: PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{environment.enableQueryDevtools ? <QueryDevtools /> : null}
		</QueryClientProvider>
	)
}
