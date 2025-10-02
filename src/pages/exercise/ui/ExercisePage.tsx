import {useCallback, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router'
import type {ExerciseResult} from '@/entities/exercise'
import {getExerciseRenderer, useExercise} from '@/entities/exercise'
// Import exercise types to trigger auto-registration
import '@/features/word-form-exercise'
import '@/features/flashcard-exercise'
import '@/features/multiple-choice-exercise'
import {useLayout} from '@/shared/lib'
import type {TranslationEntry} from '@/shared/lib/i18n'
import {loadTranslations} from '@/shared/lib/i18n'
import {LoadingOrError} from '@/shared/ui/loading-or-error'
import {exercisePageTranslations} from './translations'

/**
 * Page for running individual exercises
 * Handles loading, error states, and exercise completion
 */
export function ExercisePage() {
	const {exerciseId} = useParams()
	const navigate = useNavigate()
	const {setHeaderEnabled} = useLayout()
	const {data: exercise, isLoading, error} = useExercise(exerciseId)
	const {t} = loadTranslations(exercisePageTranslations)

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

	return renderExercise(
		exercise,
		handleComplete,
		handleExit,
		t as (entry: string | TranslationEntry) => string
	)
}

function renderExercise(
	exercise: NonNullable<ReturnType<typeof useExercise>['data']>,
	onComplete: (_result: Omit<ExerciseResult, 'completedAt'>) => void,
	onExit: () => void,
	t: (entry: string | TranslationEntry) => string
) {
	// Get renderer component from factory
	const Renderer = getExerciseRenderer(exercise.type)

	if (!Renderer) {
		// Exercise type not registered - show unsupported message
		return (
			<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
				<div className='text-center'>
					<h2 className='mb-4 font-semibold text-red-600 text-xl'>
						{t(exercisePageTranslations['exercise.unsupportedType'])}
					</h2>
					<p className='mb-6 text-gray-600 dark:text-gray-400'>
						{t(exercisePageTranslations['exercise.notImplemented']).replace(
							'{type}',
							exercise.type
						)}
					</p>
					<button
						className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
						onClick={onExit}
						type='button'
					>
						{t(exercisePageTranslations['exercise.backToLibrary'])}
					</button>
				</div>
			</div>
		)
	}

	// Render the exercise using the factory-retrieved component
	return (
		<Renderer exercise={exercise} onComplete={onComplete} onExit={onExit} />
	)
}
