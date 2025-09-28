import type {PropsWithChildren} from 'react'
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary'
import {LoadingOrError} from '@/shared/ui/loading-or-error'

function renderFallback({error}: FallbackProps) {
	return <LoadingOrError error={error} />
}

export function AppErrorBoundary({children}: PropsWithChildren) {
	return (
		<ErrorBoundary fallbackRender={renderFallback}>{children}</ErrorBoundary>
	)
}
