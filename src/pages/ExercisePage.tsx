import {useCallback, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router'
import {WordFormExercise} from '@/components/exercises/word-form/WordFormExercise'
import {LoadingOrError} from '@/components/LoadingOrError'
import type {ExerciseResult} from '@/entities/exercise'
import {useExercise} from '@/hooks/useExercises'
import {useLayout} from '@/hooks/useLayout'
import {useTranslations} from '@/hooks/useTranslations'
import {exerciseUiTranslations} from '@/i18n/dictionaries'

/**
 * Page for running individual exercises
 * Handles loading, error states, and exercise completion
 */
export function ExercisePage() {
	const {exerciseId} = useParams()
	const navigate = useNavigate()
	const {setHeaderEnabled} = useLayout()
	const {data: exercise, isLoading, error} = useExercise(exerciseId)
	const {t} = useTranslations(exerciseUiTranslations)

	// Hide header on exercise pages
	useEffect(() => {
		setHeaderEnabled(false)
		return () => setHeaderEnabled(true) // Cleanup on unmount
	}, [setHeaderEnabled])

	const handleComplete = useCallback(
		(_result: Omit<ExerciseResult, 'completedAt'>) => {
			// Show completion stats briefly, then return to library
			setTimeout(() => {
				// biome-ignore lint/nursery/noFloatingPromises: navigate is synchronous
				navigate('/exercises', {replace: true})
			}, 3000)
		},
		[navigate]
	)

	const handleExit = useCallback(() => {
		// biome-ignore lint/nursery/noFloatingPromises: navigate is synchronous
		navigate('/exercises', {replace: true})
	}, [navigate])

	// Handle loading and error states
	if (isLoading) {
		return <LoadingOrError />
	}

	if (error || !exercise) {
		const errorProps = error instanceof Error ? {error} : undefined
		return <LoadingOrError {...errorProps} />
	}

	// Render exercise based on type
	switch (exercise.type) {
		case 'word-form':
			return (
				<WordFormExercise
					exercise={exercise}
					onComplete={handleComplete}
					onExit={handleExit}
				/>
			)
		default:
			return (
				<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
					<div className='text-center'>
						<h2 className='mb-4 font-semibold text-red-600 text-xl'>
							{t('exercise.unsupportedType')}
						</h2>
						<p className='mb-6 text-gray-600 dark:text-gray-400'>
							{t('exercise.notImplemented').replace('{type}', exercise.type)}
						</p>
						<button
							className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
							onClick={handleExit}
							type='button'
						>
							{t('exercise.backToLibrary')}
						</button>
					</div>
				</div>
			)
	}
}
