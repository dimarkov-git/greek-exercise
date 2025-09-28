import {lazy} from 'react'
import {Navigate, Route, Routes} from 'react-router'
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

export function AppRoutes() {
	return (
		<Routes>
			<Route element={<AppShell />} path='/'>
				<Route element={<HomePage />} index={true} />
				<Route element={<ExerciseLibrary />} path='exercises' />
				<Route element={<ExercisePage />} path='exercise/:exerciseId' />
				<Route element={<LearnPage />} path='learn/:exerciseId' />
				<Route element={<ExerciseBuilder />} path='builder' />
				<Route element={<Navigate replace={true} to='/' />} path='*' />
			</Route>
		</Routes>
	)
}
