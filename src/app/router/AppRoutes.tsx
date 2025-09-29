import {lazy} from 'react'
import {Navigate, Route, Routes} from 'react-router'
import {AppModeEnum, environment} from '@/app/config'
import {HomePage} from '@/pages/HomePage'
import {AppShell} from '../shell/AppShell'

const ExerciseLibrary = lazy(async () =>
	import('@/pages/exercise-library/ExerciseLibrary').then(module => ({
		default: module.ExerciseLibrary
	}))
)

const ExerciseBuilder = lazy(async () =>
	import('@/pages/ExerciseBuilder').then(module => ({
		default: module.ExerciseBuilder
	}))
)

const ExercisePage = lazy(async () =>
	import('@/pages/ExercisePage').then(module => ({
		default: module.ExercisePage
	}))
)

const LearnPage = lazy(async () =>
	import('@/pages/LearnPage').then(module => ({default: module.LearnPage}))
)

const showTestSection = environment.mode === AppModeEnum.development

const TestI18nPage = showTestSection
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
				{showTestSection && TestI18nPage && (
					<Route element={<TestI18nPage />} path='test/i18n' />
				)}
				<Route element={<Navigate replace={true} to='/' />} path='*' />
			</Route>
		</Routes>
	)
}
