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
import type {WordFormExercise} from '@/types/exercises'
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
	},
	{
		key: 'exercise.difficulty',
		fallback: 'Difficulty'
	},
	{
		key: 'exercise.minutes',
		fallback: 'min'
	},
	{
		key: 'exercise.blocks',
		fallback: 'blocks'
	},
	{
		key: 'exercise.cases',
		fallback: 'cases'
	},
	{
		key: 'ui.leftArrow',
		fallback: '←'
	},
	{
		key: 'ui.playIcon',
		fallback: '▶'
	},
	{
		key: 'ui.hashSymbol',
		fallback: '#'
	}
]

type ViewMode = 'json' | 'table'

type TranslateFn = (key: string) => string

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

	if (isLoading) {
		return <LoadingOrError />
	}

	if (error || !exercise) {
		const errorProps = error instanceof Error ? {error} : undefined
		return <LoadingOrError {...errorProps} />
	}

	if (exercise.type !== 'word-form') {
		return (
			<UnsupportedExerciseNotice
				exerciseType={exercise.type}
				onBack={handleBack}
				t={t}
			/>
		)
	}

	return (
		<LearnPageContent
			exercise={exercise}
			onBack={handleBack}
			onStart={handleStartExercise}
			onViewModeChange={setViewMode}
			t={t}
			viewMode={viewMode}
		/>
	)
}

interface UnsupportedExerciseNoticeProps {
	exerciseType: string
	onBack: () => void
	t: TranslateFn
}

function UnsupportedExerciseNotice({
	exerciseType,
	onBack,
	t
}: UnsupportedExerciseNoticeProps) {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
			<Head title={t('learnExercise')} />
			<div className='text-center'>
				<h2 className='mb-4 font-semibold text-red-600 text-xl'>
					{t('exercise.unsupportedType')}
				</h2>
				<p className='mb-6 text-gray-600 dark:text-gray-400'>
					{t('exercise.notImplemented').replace('{type}', exerciseType)}
				</p>
				<button
					className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
					onClick={onBack}
					type='button'
				>
					{t('exercise.backToLibrary')}
				</button>
			</div>
		</div>
	)
}

interface LearnPageContentProps {
	exercise: WordFormExercise
	onBack: () => void
	onStart: () => void
	onViewModeChange: (mode: ViewMode) => void
	t: TranslateFn
	viewMode: ViewMode
}

function LearnPageContent({
	exercise,
	onBack,
	onStart,
	onViewModeChange,
	t,
	viewMode
}: LearnPageContentProps) {
	return (
		<div className='min-h-screen bg-gray-50 pb-16 dark:bg-gray-950'>
			<Head title={`${exercise.title} | ${t('learnExercise')}`} />
			<main className='mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8'>
				<LearnPageHero exercise={exercise} onBack={onBack} t={t} />
				<LearnPageActions
					onStart={onStart}
					onViewModeChange={onViewModeChange}
					t={t}
					viewMode={viewMode}
				/>
				<ExerciseTags t={t} tags={exercise.tags ?? []} />
				<section className='mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900'>
					{viewMode === 'table' ? (
						<TableView exercise={exercise} />
					) : (
						<JsonView exercise={exercise} />
					)}
				</section>
			</main>
		</div>
	)
}

interface LearnPageHeroProps {
	exercise: WordFormExercise
	onBack: () => void
	t: TranslateFn
}

function LearnPageHero({exercise, onBack, t}: LearnPageHeroProps) {
	return (
		<header className='rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-8 text-white shadow-2xl'>
			<button
				className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-sm transition hover:bg-white/20'
				onClick={onBack}
				type='button'
			>
				<span aria-hidden='true'>{t('ui.leftArrow')}</span>
				{t('exercise.backToLibrary')}
			</button>
			<p className='mt-6 font-semibold text-sm text-white/70 uppercase tracking-[0.3em]'>
				{t('learnExercise')}
			</p>
			<h1 className='mt-4 font-bold text-3xl leading-tight sm:text-4xl md:text-5xl'>
				{exercise.title}
			</h1>
			<p className='mt-4 max-w-3xl text-base text-white/80 sm:text-lg'>
				{exercise.description}
			</p>
			<ExerciseStats exercise={exercise} t={t} />
		</header>
	)
}

interface ExerciseStatsProps {
	exercise: WordFormExercise
	t: TranslateFn
}

function ExerciseStats({exercise, t}: ExerciseStatsProps) {
	const totalCases = exercise.blocks.reduce(
		(total, block) => total + block.cases.length,
		0
	)

	return (
		<dl className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			<StatCard
				label={t('exercise.difficulty')}
				value={exercise.difficulty.toUpperCase()}
			/>
			<StatCard
				label={t('exercise.minutes')}
				value={`${exercise.estimatedTimeMinutes}`}
			/>
			<StatCard
				label={t('exercise.blocks')}
				value={`${exercise.blocks.length}`}
			/>
			<StatCard label={t('exercise.cases')} value={`${totalCases}`} />
		</dl>
	)
}

interface StatCardProps {
	label: string
	value: string
}

function StatCard({label, value}: StatCardProps) {
	return (
		<div className='rounded-2xl bg-white/10 px-4 py-5 text-white shadow-sm backdrop-blur-sm'>
			<dt className='font-medium text-sm text-white/70 uppercase tracking-wide'>
				{label}
			</dt>
			<dd className='mt-2 font-semibold text-2xl'>{value}</dd>
		</div>
	)
}

interface LearnPageActionsProps {
	onStart: () => void
	onViewModeChange: (mode: ViewMode) => void
	t: TranslateFn
	viewMode: ViewMode
}

function LearnPageActions({
	onStart,
	onViewModeChange,
	t,
	viewMode
}: LearnPageActionsProps) {
	return (
		<div className='mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between'>
			<ViewToggle onViewModeChange={onViewModeChange} viewMode={viewMode} />
			<button
				className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2'
				onClick={onStart}
				type='button'
			>
				<span aria-hidden='true'>{t('ui.playIcon')}</span>
				{t('startExercise')}
			</button>
		</div>
	)
}

interface ExerciseTagsProps {
	tags: string[]
	t: TranslateFn
}

function ExerciseTags({tags, t}: ExerciseTagsProps) {
	if (tags.length === 0) {
		return null
	}

	return (
		<ul className='mt-6 flex flex-wrap gap-2'>
			{tags.map(tag => (
				<li
					className='inline-flex items-center rounded-full bg-blue-100/80 px-3 py-1 font-medium text-blue-700 text-xs uppercase tracking-wide dark:bg-blue-900/30 dark:text-blue-200'
					key={tag}
				>
					{`${t('ui.hashSymbol')}${tag}`}
				</li>
			))}
		</ul>
	)
}
