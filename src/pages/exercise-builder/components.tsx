import {motion} from 'framer-motion'
import type {ChangeEvent} from 'react'
import {Link} from 'react-router'
import {TableView} from '@/components/learn/TableView'
import type {WordFormExerciseWithDefaults} from '@/domain/exercises/types'
import type {CustomExerciseRecord} from '@/stores/customExercises'
import type {WordFormExerciseJSON} from '@/types/exercises'
import type {BuilderSaveStatus, BuilderTranslator} from './state'

export function BuilderHero({t}: {readonly t: BuilderTranslator}) {
	return (
		<motion.header
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 p-10 text-white shadow-2xl'
			initial={{opacity: 0, y: 20}}
			transition={{duration: 0.6}}
		>
			<div className='flex flex-wrap items-start justify-between gap-6'>
				<div className='max-w-3xl'>
					<div className='text-6xl'>{t('ui.toolsEmoji')}</div>
					<h1 className='mt-6 font-bold text-3xl sm:text-4xl md:text-5xl'>
						{t('exerciseBuilder')}
					</h1>
					<p className='mt-4 text-lg text-white/80'>
						{t('exerciseBuilderDesc')}
					</p>
					<p className='mt-6 text-sm text-white/70 sm:text-base'>
						{t('builder.libraryInfo')}
					</p>
				</div>
				<div className='flex flex-col gap-3 text-sm sm:flex-row sm:text-base'>
					<Link
						className='inline-flex cursor-pointer items-center justify-center rounded-full bg-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/25'
						to='/'
					>
						{t('ui.backToHome')}
					</Link>
					<Link
						className='inline-flex cursor-pointer items-center justify-center rounded-full bg-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/25'
						to='/exercises'
					>
						{t('builder.openLibrary')}
					</Link>
				</div>
			</div>
		</motion.header>
	)
}

export interface TypeSelectorPanelProps {
	readonly selectedType: 'word-form'
	readonly onTypeChange: (type: 'word-form') => void
	readonly t: BuilderTranslator
}

export function TypeSelectorPanel({
	selectedType,
	onTypeChange,
	t
}: TypeSelectorPanelProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.1, duration: 0.4}}
		>
			<div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start'>
				<div>
					<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
						{t('builder.typeSectionTitle')}
					</h2>
					<p className='text-gray-600 text-sm dark:text-gray-400'>
						{t('builder.typeHelp')}
					</p>
				</div>
                                <select
                                        className='cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 md:justify-self-end md:self-start dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
					onChange={(event: ChangeEvent<HTMLSelectElement>) =>
						onTypeChange(event.target.value as 'word-form')
					}
					value={selectedType}
				>
					<option value='word-form'>{t('builder.wordFormType')}</option>
				</select>
			</div>
			<p className='mt-4 rounded-xl bg-purple-50 p-4 text-purple-900 text-sm dark:bg-purple-900/20 dark:text-purple-200'>
				{t('builder.jsonEditorHelp')}
			</p>
		</motion.div>
	)
}

export interface JsonEditorPanelProps {
	readonly jsonValue: string
	readonly hasErrors: boolean
	readonly saveStatus: BuilderSaveStatus
	readonly onJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
	readonly onReset: () => void
	readonly onFormat: () => void
	readonly onSave: () => void
	readonly t: BuilderTranslator
}

export function JsonEditorPanel({
	jsonValue,
	hasErrors,
	saveStatus,
	onJsonChange,
	onReset,
	onFormat,
	onSave,
	t
}: JsonEditorPanelProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.15, duration: 0.4}}
		>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
					{t('builder.jsonEditorTitle')}
				</h2>
				<div className='flex flex-wrap gap-2'>
					<button
						className='cursor-pointer rounded-full border border-purple-500 px-4 py-2 font-medium text-purple-600 text-sm transition hover:bg-purple-50 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-900/30'
						onClick={onFormat}
						type='button'
					>
						{t('builder.formatJson')}
					</button>
					<button
						className='cursor-pointer rounded-full border border-gray-300 px-4 py-2 font-medium text-gray-600 text-sm transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
						onClick={onReset}
						type='button'
					>
						{t('builder.resetTemplate')}
					</button>
				</div>
			</div>
			<textarea
				aria-label={t('builder.jsonEditorTitle')}
				className='resize-vertical mt-4 h-[480px] w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 font-mono text-gray-800 text-sm leading-6 shadow-inner focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100'
				onChange={onJsonChange}
				spellCheck={false}
				value={jsonValue}
			/>
			<div className='mt-4 flex flex-wrap items-center gap-3'>
				<button
					className='inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2 font-semibold text-sm text-white shadow-lg transition hover:from-purple-600 hover:to-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'
					disabled={hasErrors}
					onClick={onSave}
					type='button'
				>
					{t('builder.saveToLibrary')}
				</button>
				{saveStatus === 'success' && (
					<span className='text-green-600 text-sm dark:text-green-400'>
						{t('builder.saveSuccess')}
					</span>
				)}
				{saveStatus === 'error' && (
					<span className='text-red-600 text-sm dark:text-red-400'>
						{t('builder.saveError')}
					</span>
				)}
			</div>
		</motion.div>
	)
}

export interface ValidationPanelProps {
	readonly hasErrors: boolean
	readonly validationErrors: readonly string[]
	readonly t: BuilderTranslator
}

export function ValidationPanel({
	hasErrors,
	validationErrors,
	t
}: ValidationPanelProps) {
	const badgeClass = hasErrors
		? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
		: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.2, duration: 0.4}}
		>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
					{t('builder.validationTitle')}
				</h2>
				<span
					className={`inline-flex items-center rounded-full px-3 py-1 font-semibold text-xs uppercase tracking-wide ${badgeClass}`}
				>
					{hasErrors
						? t('builder.validationError')
						: t('builder.validationSuccess')}
				</span>
			</div>
			{hasErrors ? (
				<ul className='mt-4 space-y-2 text-red-600 text-sm dark:text-red-300'>
					{validationErrors.map(error => (
						<li key={error}>{error}</li>
					))}
				</ul>
			) : (
				<p className='mt-4 rounded-xl bg-emerald-50 p-4 text-emerald-700 text-sm dark:bg-emerald-900/20 dark:text-emerald-300'>
					{t('builder.validationHint')}
				</p>
			)}
		</motion.div>
	)
}

export function PreviewPanel({
	previewExercise,
	t
}: {
	readonly previewExercise: WordFormExerciseWithDefaults | null
	readonly t: BuilderTranslator
}) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.25, duration: 0.4}}
		>
			<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
				{t('builder.previewTitle')}
			</h2>
			{previewExercise ? (
				<div className='mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800'>
					<TableView exercise={previewExercise} />
				</div>
			) : (
				<div className='mt-4 rounded-2xl border border-gray-300 border-dashed bg-gray-50 p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400'>
					<p className='font-medium'>{t('builder.previewUnavailable')}</p>
					<p className='mt-2 text-sm'>{t('builder.previewUnavailableHint')}</p>
				</div>
			)}
		</motion.div>
	)
}

export interface SavedExercisesSectionProps {
	readonly formattedSavedExercises: readonly (CustomExerciseRecord & {
		readonly formattedDate: string
	})[]
	readonly onLoad: (exercise: WordFormExerciseJSON) => void
	readonly onDelete: (id: string) => void
	readonly t: BuilderTranslator
}

export function SavedExercisesSection({
	formattedSavedExercises,
	onLoad,
	onDelete,
	t
}: SavedExercisesSectionProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.3, duration: 0.4}}
		>
			<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
				{t('builder.savedExercisesTitle')}
			</h2>
			{formattedSavedExercises.length === 0 ? (
				<p className='mt-4 rounded-xl bg-gray-50 p-4 text-gray-600 text-sm dark:bg-gray-800/40 dark:text-gray-300'>
					{t('builder.noSavedExercises')}
				</p>
			) : (
				<ul className='mt-4 space-y-4'>
					{formattedSavedExercises.map(record => (
						<SavedExerciseCard
							key={record.exercise.id}
							onDelete={onDelete}
							onLoad={onLoad}
							record={record}
							t={t}
						/>
					))}
				</ul>
			)}
		</motion.div>
	)
}

interface SavedExerciseCardProps {
	readonly record: CustomExerciseRecord & {readonly formattedDate: string}
	readonly onLoad: (exercise: WordFormExerciseJSON) => void
	readonly onDelete: (id: string) => void
	readonly t: BuilderTranslator
}

function SavedExerciseCard({
	record,
	onLoad,
	onDelete,
	t
}: SavedExerciseCardProps) {
	const tags = record.exercise.tags ?? []

	return (
		<li className='rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900'>
			<div className='flex flex-wrap items-start justify-between gap-3'>
				<div>
					<h3 className='font-semibold text-gray-900 dark:text-white'>
						{record.exercise.title}
					</h3>
					<p className='text-gray-600 text-sm dark:text-gray-400'>
						{record.exercise.description}
					</p>
					<p className='mt-2 text-gray-500 text-xs dark:text-gray-500'>
						{t('builder.lastUpdated').replace('{date}', record.formattedDate)}
					</p>
				</div>
				<div className='flex flex-wrap gap-2'>
					<button
						className='cursor-pointer rounded-full bg-blue-600 px-4 py-2 font-medium text-sm text-white transition hover:bg-blue-700'
						onClick={() => onLoad(record.exercise)}
						type='button'
					>
						{t('builder.loadButton')}
					</button>
					<button
						className='cursor-pointer rounded-full border border-red-500 px-4 py-2 font-medium text-red-600 text-sm transition hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-900/30'
						onClick={() => onDelete(record.exercise.id)}
						type='button'
					>
						{t('builder.deleteButton')}
					</button>
				</div>
			</div>
			<div className='mt-3 flex flex-wrap gap-2 text-xs'>
				{tags.map(tag => (
					<span
						className='rounded-full bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
						key={tag}
					>
						{t('ui.hashSymbol')}
						{tag}
					</span>
				))}
			</div>
		</li>
	)
}
