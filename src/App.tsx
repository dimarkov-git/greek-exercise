import {lazy, Suspense} from 'react'
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary'
import {Navigate, Route, Routes} from 'react-router'
import {LoadingOrError} from '@/components/LoadingOrError'
import {Footer} from '@/components/layout/Footer'
import {HomePage} from '@/pages/HomePage'

const ExerciseLibrary = lazy(async () =>
	import('@/pages/ExerciseLibrary').then(m => ({default: m.ExerciseLibrary}))
)

const ExerciseBuilder = lazy(async () =>
	import('@/pages/ExerciseBuilder').then(m => ({default: m.ExerciseBuilder}))
)

const ExercisePage = lazy(async () =>
	import('@/pages/ExercisePage').then(m => ({default: m.ExercisePage}))
)

function renderError({error}: FallbackProps) {
	return <LoadingOrError error={error} />
}

export function App() {
	return (
		<div className='flex min-h-screen flex-col'>
			<ErrorBoundary fallbackRender={renderError}>
				<Suspense fallback={<LoadingOrError />}>
					<main className='flex-1'>
						<Routes>
							<Route element={<HomePage />} index={true} />
							<Route element={<ExerciseLibrary />} path='/exercises' />
							<Route element={<ExercisePage />} path='/exercise/:exerciseId' />
							<Route element={<ExerciseBuilder />} path='/builder' />
							<Route element={<Navigate replace={true} to='/' />} path='*' />
						</Routes>
					</main>
				</Suspense>
				<Footer />
			</ErrorBoundary>
		</div>
	)
}
