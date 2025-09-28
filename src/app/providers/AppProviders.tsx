import {QueryClientProvider} from '@tanstack/react-query'
import type {PropsWithChildren} from 'react'
import {environment} from '@/app/config/environment'
import {queryClient} from '../config/queryClient'
import {QueryDevtools} from './QueryDevtools'

export function AppProviders({children}: PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{environment.enableQueryDevtools ? <QueryDevtools /> : null}
		</QueryClientProvider>
	)
}
