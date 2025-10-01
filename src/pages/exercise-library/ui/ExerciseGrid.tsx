import {AnimatePresence, motion} from 'framer-motion'
import {Link} from 'react-router'
import type {ExerciseSummary} from '@/entities/exercise'
import {useSettingsStore} from '@/shared/model'
import type {exerciseLibraryTranslations} from '../lib/translations'

interface ExerciseGridProps {
	exercises: ExerciseSummary[]
	onClearFilters: () => void
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

export function ExerciseGrid({
	exercises,
	onClearFilters,
	t,
	translations
}: ExerciseGridProps) {
	return (
		<>
			<motion.div
				animate={{opacity: 1}}
				className='mb-6 text-gray-500 text-sm dark:text-gray-400'
				initial={{opacity: 0}}
				transition={{delay: 0.3}}
			>
				{t(translations.exerciseCount).replace(
					'{filteredCount}',
					exercises.length.toString()
				)}
			</motion.div>

			<motion.div
				animate={{opacity: 1}}
				className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
				initial={{opacity: 0}}
				transition={{delay: 0.4}}
			>
				<AnimatePresence>
					{exercises.map((exercise, index) => (
						<ExerciseCard
							exercise={exercise}
							index={index}
							key={exercise.id}
							t={t}
							translations={translations}
						/>
					))}
				</AnimatePresence>
			</motion.div>

			{exercises.length === 0 && (
				<EmptyState
					onClearFilters={onClearFilters}
					t={t}
					translations={translations}
				/>
			)}
		</>
	)
}

interface ExerciseCardProps {
	exercise: ExerciseSummary
	index: number
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

function ExerciseCard({exercise, index, t, translations}: ExerciseCardProps) {
	const {uiLanguage} = useSettingsStore()

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
			data-testid='exercise-card'
			initial={{opacity: 0, y: 20}}
			transition={{delay: index * 0.1, duration: 0.4}}
		>
			<div className='p-6'>
				<div className='mb-4 flex items-start justify-between gap-4'>
					<div className='flex-1'>
						<h3 className='mb-2 font-semibold text-gray-900 text-lg dark:text-white'>
							{exercise.titleI18n?.[uiLanguage] || exercise.title}
						</h3>
						<p className='line-clamp-2 text-gray-600 text-sm dark:text-gray-400'>
							{exercise.descriptionI18n?.[uiLanguage] || exercise.description}
						</p>
					</div>
					<div className='flex flex-col items-end gap-2'>
						{exercise.source === 'custom' && (
							<span className='rounded-full border border-purple-400 border-dashed px-3 py-1 text-purple-600 text-xs uppercase tracking-wide dark:border-purple-500 dark:text-purple-300'>
								{t(translations['builder.customBadge'])}
							</span>
						)}
						<span
							className={`ml-3 rounded-full px-2 py-1 font-medium text-xs ${getDifficultyColor(
								exercise.difficulty
							)}`}
						>
							{getDifficultyLabel(exercise.difficulty, uiLanguage)}
						</span>
					</div>
				</div>

				{exercise.tags.length > 0 && (
					<div className='mb-4 flex flex-wrap gap-1'>
						{exercise.tags.slice(0, 3).map(tag => (
							<span
								className='rounded bg-blue-50 px-2 py-1 text-blue-600 text-xs dark:bg-blue-900/30 dark:text-blue-400'
								key={tag}
							>
								{t(translations['ui.hashSymbol'])}
								{tag}
							</span>
						))}
						{exercise.tags.length > 3 && (
							<span className='rounded bg-gray-50 px-2 py-1 text-gray-500 text-xs dark:bg-gray-700'>
								{t(translations['ui.plusSymbol'])}
								{exercise.tags.length - 3}
							</span>
						)}
					</div>
				)}

				<div className='mb-4 flex items-center justify-between text-gray-500 text-sm dark:text-gray-400'>
					<div className='flex items-center gap-4'>
						<span>
							{t(translations['ui.documentEmoji'])} {exercise.totalCases}{' '}
							{t(translations['exercise.cases'])}
						</span>
						<span>
							{t(translations['ui.booksEmoji'])} {exercise.totalBlocks}{' '}
							{t(translations['exercise.blocks'])}
						</span>
						<span>
							{t(translations['ui.timerEmoji'])} {exercise.estimatedTimeMinutes}{' '}
							{t(translations['exercise.minutes'])}
						</span>
					</div>
				</div>

				<div className='flex gap-2'>
					<Link
						className='flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
						data-testid='start-exercise-button'
						to={`/exercise/${exercise.id}`}
					>
						{t(translations.startExercise)}
					</Link>
					<Link
						className='flex items-center justify-center rounded-lg border border-blue-600 bg-transparent px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20'
						data-testid='learn-exercise-button'
						title={t(translations.learn)}
						to={`/learn/${exercise.id}`}
					>
						<svg
							aria-hidden='true'
							className='h-4 w-4'
							fill='currentColor'
							viewBox='0 0 20 20'
						>
							<path
								clipRule='evenodd'
								d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
								fillRule='evenodd'
							/>
						</svg>
					</Link>
				</div>
			</div>
		</motion.div>
	)
}

interface EmptyStateProps {
	onClearFilters: () => void
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

function EmptyState({onClearFilters, t, translations}: EmptyStateProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='py-16 text-center'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.4}}
		>
			<div className='mb-4 text-6xl'>{t(translations['ui.searchEmoji'])}</div>
			<h3 className='mb-2 font-semibold text-gray-900 text-xl dark:text-white'>
				{t(translations.noExercisesFound)}
			</h3>
			<p className='mb-6 text-gray-600 dark:text-gray-400'>
				{t(translations.noExercisesFoundDesc)}
			</p>
			<button
				className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
				onClick={onClearFilters}
				type='button'
			>
				{t(translations.clearFilters)}
			</button>
		</motion.div>
	)
}

function getDifficultyColor(difficulty: string): string {
	switch (difficulty) {
		case 'a0':
		case 'a1':
			return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
		case 'a2':
		case 'b1':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
		case 'b2':
		case 'c1':
		case 'c2':
			return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
	}
}

function getDifficultyLabel(difficulty: string, userLanguage: string): string {
	const labels = {
		a0: {en: 'A0', ru: 'А0', el: 'Α0'},
		a1: {en: 'A1', ru: 'А1', el: 'Α1'},
		intermediate: {en: 'Intermediate', ru: 'Средний', el: 'Μεσαίος'},
		advanced: {en: 'Advanced', ru: 'Продвинутый', el: 'Προχωρημένος'}
	}

	return (
		labels[difficulty as keyof typeof labels]?.[
			userLanguage as keyof (typeof labels)['a0']
		] || difficulty
	)
}
