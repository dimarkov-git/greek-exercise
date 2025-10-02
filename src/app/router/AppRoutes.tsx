import {lazy} from 'react'
import {Navigate, Route, Routes} from 'react-router'
import {environment} from '@/app/config'
import {HomePage} from '@/pages/home'
import {AppShell} from '../shell/AppShell'

const ExerciseLibrary = lazy(async () =>
	import('@/pages/exercise-library').then(module => ({
		default: module.ExerciseLibrary
	}))
)

const ExerciseBuilder = lazy(async () =>
	import('@/pages/exercise-builder').then(module => ({
		default: module.ExerciseBuilder
	}))
)

const ExercisePage = lazy(async () =>
	import('@/pages/exercise').then(module => ({
		default: module.ExercisePage
	}))
)

const LearnPage = lazy(async () =>
	import('@/pages/learn').then(module => ({default: module.LearnPage}))
)

const TestI18nPage = environment.isDevelopment
	? lazy(async () =>
			import('@/pages/test-i18n').then(module => ({
				default: module.TestI18nPage
			}))
		)
	: null

export function AppRoutes() {
	return (
		<Routes>
			<Route element={<AppShell />} path='/'>
				<Route element={<HomePage />} index={true} />
				<Route element={<ExerciseLibrary />} path='exercises' />
				<Route element={<ExercisePage />} path='exercise/:exerciseId' />
				<Route element={<LearnPage />} path='learn/:exerciseId' />
				<Route element={<ExerciseBuilder />} path='builder' />
				{environment.isDevelopment && TestI18nPage && (
					<Route element={<TestI18nPage />} path='test/i18n' />
				)}
				<Route element={<Navigate replace={true} to='/' />} path='*' />
			</Route>
		</Routes>
	)
}
