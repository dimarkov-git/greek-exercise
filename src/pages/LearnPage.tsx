import {useCallback, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router'
import {Head} from '@/components/Head'
import {LoadingOrError} from '@/components/LoadingOrError'
import {JsonView} from '@/components/learn/JsonView'
import {TableView} from '@/components/learn/TableView'
import {ViewToggle} from '@/components/learn/ViewToggle'
import {useExercise} from '@/hooks/useExercises'
import {useLayout} from '@/hooks/useLayout'
import {useTranslations} from '@/hooks/useTranslations'
import type {TranslationRequest} from '@/types/translations'

const LEARN_PAGE_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'learnExercise',
		fallback: 'Learn Exercise'
	},
	{
		key: 'jsonView',
		fallback: 'JSON View'
	},
	{
		key: 'tableView',
		fallback: 'Table View'
	},
	{
		key: 'exerciseStructure',
		fallback: 'Exercise Structure'
	},
	{
		key: 'startExercise',
		fallback: 'Start Exercise'
	},
	{
		key: 'exercise.backToLibrary',
		fallback: 'Back to Library'
	},
	{
		key: 'exercise.unsupportedType',
		fallback: 'Unsupported Exercise Type'
	},
	{
		key: 'exercise.notImplemented',
		fallback: 'Exercise type "{type}" is not yet implemented.'
	}
]

type ViewMode = 'json' | 'table'

/**
 * Learn page for studying exercise structure before attempting
 */
export function LearnPage() {
	const {exerciseId} = useParams()
	const navigate = useNavigate()
	const {setHeaderEnabled} = useLayout()
	const {data: exercise, isLoading, error} = useExercise(exerciseId)
	const {t} = useTranslations(LEARN_PAGE_TRANSLATIONS)
	const [viewMode, setViewMode] = useState<ViewMode>('table')

	// Hide header on learn pages
	useEffect(() => {
		setHeaderEnabled(false)
		return () => setHeaderEnabled(true)
	}, [setHeaderEnabled])

	const handleBack = useCallback(() => {
		// biome-ignore lint/nursery/noFloatingPromises: navigate is synchronous
		navigate('/exercises', {replace: true})
	}, [navigate])

	const handleStartExercise = useCallback(() => {
		if (exerciseId) {
			// biome-ignore lint/nursery/noFloatingPromises: navigate is synchronous
			navigate(`/exercise/${exerciseId}`)
		}
	}, [navigate, exerciseId])

	// Handle loading and error states
	if (isLoading || error || !exercise) {
		return <LoadingOrError {...(error && {error})} />
	}

	// Only support word-form exercises for now
	if (exercise.type !== 'word-form') {
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
						onClick={handleBack}
						type='button'
					>
						{t('exercise.backToLibrary')}
					</button>
				</div>
			</div>
		)
	}

	return (
		<>
			<Head title={`${t('learnExercise')} - ${exercise.title}`} />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-6xl px-4 py-8'>
					{/* Header */}
					<div className='mb-8 flex items-center justify-between'>
						<div>
							<h1 className='mb-2 font-bold text-3xl text-gray-900 dark:text-white'>
								{exercise.title}
							</h1>
							<p className='text-gray-600 dark:text-gray-400'>
								{exercise.description}
							</p>
						</div>
						<div className='flex items-center gap-3'>
							<button
								className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
								onClick={handleBack}
								type='button'
							>
								{t('exercise.backToLibrary')}
							</button>
							<button
								className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
								onClick={handleStartExercise}
								type='button'
							>
								{t('startExercise')}
							</button>
						</div>
					</div>

					{/* View Toggle */}
					<div className='mb-6'>
						<ViewToggle onViewModeChange={setViewMode} viewMode={viewMode} />
					</div>

					{/* Content */}
					<div className='rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
						{viewMode === 'json' ? (
							<JsonView exercise={exercise} />
						) : (
							<TableView exercise={exercise} />
						)}
					</div>
				</div>
			</div>
		</>
	)
}
