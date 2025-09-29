import {useCallback, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router'
import type {WordFormExercise} from '@/entities/exercise'
import {useExercise} from '@/entities/exercise'
import {JsonView, TableView, ViewToggle} from '@/features/learn-view'
import {useLayout} from '@/shared/lib'
import {loadTranslations} from '@/shared/lib/i18n'
import {useSettingsStore} from '@/shared/model'
import {UI_LANGUAGES, USER_LANGUAGES} from '@/shared/model/settings'
import {Head} from '@/shared/ui/head'
import {LoadingOrError} from '@/shared/ui/loading-or-error'
import {learnPageTranslations} from './translations'

type ViewMode = 'json' | 'table'

type LearnPageTranslator = (entry: string) => string

export function LearnPage() {
	const {exerciseId} = useParams()
	const navigate = useNavigate()
	const {setHeaderEnabled} = useLayout()
	const {data: exercise, isLoading, error} = useExercise(exerciseId)
	const {t} = loadTranslations(learnPageTranslations)
	const [viewMode, setViewMode] = useState<ViewMode>('table')

	useEffect(() => {
		setHeaderEnabled(false)
		return () => setHeaderEnabled(true)
	}, [setHeaderEnabled])

	const handleBack = useCallback(() => {
		// biome-ignore lint/nursery/noFloatingPromises: navigate resolves synchronously in this context.
		navigate('/exercises', {replace: true})
	}, [navigate])

	const handleStartExercise = useCallback(() => {
		if (exerciseId) {
			// biome-ignore lint/nursery/noFloatingPromises: navigate resolves synchronously in this context.
			navigate(`/exercise/${exerciseId}`)
		}
	}, [exerciseId, navigate])

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
				t={t as LearnPageTranslator}
			/>
		)
	}

	return (
		<LearnPageContent
			exercise={exercise}
			onBack={handleBack}
			onStart={handleStartExercise}
			onViewModeChange={setViewMode}
			t={t as LearnPageTranslator}
			viewMode={viewMode}
		/>
	)
}

interface UnsupportedExerciseNoticeProps {
	readonly exerciseType: string
	readonly onBack: () => void
	readonly t: LearnPageTranslator
}

function UnsupportedExerciseNotice({
	exerciseType,
	onBack,
	t
}: UnsupportedExerciseNoticeProps) {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
			<Head title={t(learnPageTranslations.learnExercise)} />
			<div className='text-center'>
				<h2 className='mb-4 font-semibold text-red-600 text-xl'>
					{t(learnPageTranslations['exercise.unsupportedType'])}
				</h2>
				<p className='mb-6 text-gray-600 dark:text-gray-400'>
					{t(learnPageTranslations['exercise.notImplemented']).replace('{type}', exerciseType)}
				</p>
				<button
					className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
					onClick={onBack}
					type='button'
				>
					{t(learnPageTranslations['exercise.backToLibrary'])}
				</button>
			</div>
		</div>
	)
}

interface LearnPageContentProps {
	readonly exercise: WordFormExercise
	readonly onBack: () => void
	readonly onStart: () => void
	readonly onViewModeChange: (mode: ViewMode) => void
	readonly t: LearnPageTranslator
	readonly viewMode: ViewMode
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
			<Head title={`${exercise.title} | ${t(learnPageTranslations.learnExercise)}`} />
			<main className='mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8'>
				<LearnPageHero exercise={exercise} onBack={onBack} t={t} />
				<LearnPageActions
					onStart={onStart}
					onViewModeChange={onViewModeChange}
					t={t}
					viewMode={viewMode}
				/>
				<ExerciseTags t={t} tags={exercise.tags ?? []} />
				<CurrentSettings t={t} />
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
	readonly exercise: WordFormExercise
	readonly onBack: () => void
	readonly t: LearnPageTranslator
}

function LearnPageHero({exercise, onBack, t}: LearnPageHeroProps) {
	return (
		<header className='rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-8 text-white shadow-2xl'>
			<button
				className='inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium text-sm transition hover:bg-white/20'
				onClick={onBack}
				type='button'
			>
				<span aria-hidden='true'>{t(learnPageTranslations['ui.leftArrow'])}</span>
				{t(learnPageTranslations['exercise.backToLibrary'])}
			</button>
			<p className='mt-6 font-semibold text-sm text-white/70 uppercase tracking-[0.3em]'>
				{t(learnPageTranslations.learnExercise)}
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
	readonly exercise: WordFormExercise
	readonly t: LearnPageTranslator
}

function ExerciseStats({exercise, t}: ExerciseStatsProps) {
	const totalCases = exercise.blocks.reduce(
		(total, block) => total + block.cases.length,
		0
	)

	return (
		<dl className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			<StatCard
				label={t(learnPageTranslations['exercise.difficulty'])}
				value={exercise.difficulty.toUpperCase()}
			/>
			<StatCard
				label={t(learnPageTranslations['exercise.minutes'])}
				value={`${exercise.estimatedTimeMinutes}`}
			/>
			<StatCard
				label={t(learnPageTranslations['exercise.blocks'])}
				value={`${exercise.blocks.length}`}
			/>
			<StatCard label={t(learnPageTranslations['exercise.cases'])} value={`${totalCases}`} />
		</dl>
	)
}

interface StatCardProps {
	readonly label: string
	readonly value: string
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
	readonly onStart: () => void
	readonly onViewModeChange: (mode: ViewMode) => void
	readonly t: LearnPageTranslator
	readonly viewMode: ViewMode
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
				<span aria-hidden='true'>{t(learnPageTranslations['ui.playIcon'])}</span>
				{t(learnPageTranslations.startExercise)}
			</button>
		</div>
	)
}

interface ExerciseTagsProps {
	readonly tags: string[]
	readonly t: LearnPageTranslator
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
					{`${t(learnPageTranslations['ui.hashSymbol'])}${tag}`}
				</li>
			))}
		</ul>
	)
}

interface CurrentSettingsProps {
	readonly t: LearnPageTranslator
}

function CurrentSettings({t}: CurrentSettingsProps) {
	const {theme, uiLanguage, userLanguage} = useSettingsStore()

	const getLanguageName = (
		code: string,
		languages: typeof UI_LANGUAGES | typeof USER_LANGUAGES
	) => {
		const lang = languages.find(l => l.code === code)
		return lang ? `${lang.flag} ${lang.name}` : code
	}

	return (
		<div className='mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
			<h3 className='mb-4 font-semibold text-gray-900 text-lg dark:text-white'>
				{t(learnPageTranslations['exercise.currentSettings'])}
			</h3>
			<p className='mb-4 text-gray-600 text-sm dark:text-gray-400'>
				{t(learnPageTranslations['exercise.settingsInfo'])}
			</p>
			<dl className='grid gap-4 sm:grid-cols-3'>
				<SettingItem
					label={t(learnPageTranslations.interfaceLanguage)}
					value={getLanguageName(uiLanguage, UI_LANGUAGES)}
				/>
				<SettingItem
					label={t(learnPageTranslations.userLanguage)}
					value={getLanguageName(userLanguage, USER_LANGUAGES)}
				/>
				<SettingItem
					label={t(learnPageTranslations.theme)}
					value={theme === 'dark' ? t(learnPageTranslations.darkTheme) : t(learnPageTranslations.lightTheme)}
				/>
			</dl>
		</div>
	)
}

interface SettingItemProps {
	readonly label: string
	readonly value: string
}

function SettingItem({label, value}: SettingItemProps) {
	return (
		<div className='rounded-xl bg-gray-50 p-4 dark:bg-gray-700'>
			<dt className='font-medium text-gray-700 text-sm dark:text-gray-300'>
				{label}
			</dt>
			<dd className='mt-1 font-semibold text-base text-gray-900 dark:text-white'>
				{value}
			</dd>
		</div>
	)
}
