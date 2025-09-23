import {AnimatePresence, motion} from 'framer-motion'
import {Link} from 'react-router'
import type {ExerciseSummary} from '@/domain/exercises/types'
import type {ExerciseLibraryTranslationKey} from '@/i18n/dictionaries'
import type {Translator} from '@/i18n/dictionary'
import {useSettingsStore} from '@/stores/settings'

type LibraryTranslator = Translator<ExerciseLibraryTranslationKey>

interface ExerciseGridProps {
	exercises: ExerciseSummary[]
	onClearFilters: () => void
	t: LibraryTranslator
}

export function ExerciseGrid({
	exercises,
	onClearFilters,
	t
}: ExerciseGridProps) {
	return (
		<>
			<motion.div
				animate={{opacity: 1}}
				className='mb-6 text-gray-500 text-sm dark:text-gray-400'
				initial={{opacity: 0}}
				transition={{delay: 0.3}}
			>
				{t('exerciseCount').replace(
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
						/>
					))}
				</AnimatePresence>
			</motion.div>

			{exercises.length === 0 && (
				<EmptyState onClearFilters={onClearFilters} t={t} />
			)}
		</>
	)
}

interface ExerciseCardProps {
	exercise: ExerciseSummary
	index: number
	t: LibraryTranslator
}

function ExerciseCard({exercise, index, t}: ExerciseCardProps) {
	const {uiLanguage} = useSettingsStore()

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: index * 0.1, duration: 0.4}}
		>
			<div className='p-6'>
				<div className='mb-4 flex items-start justify-between'>
					<div className='flex-1'>
						<h3 className='mb-2 font-semibold text-gray-900 text-lg dark:text-white'>
							{exercise.titleI18n?.[uiLanguage] || exercise.title}
						</h3>
						<p className='line-clamp-2 text-gray-600 text-sm dark:text-gray-400'>
							{exercise.descriptionI18n?.[uiLanguage] || exercise.description}
						</p>
					</div>
					<span
						className={`ml-3 rounded-full px-2 py-1 font-medium text-xs ${getDifficultyColor(exercise.difficulty)}`}
					>
						{getDifficultyLabel(exercise.difficulty, uiLanguage)}
					</span>
				</div>

				{exercise.tags.length > 0 && (
					<div className='mb-4 flex flex-wrap gap-1'>
						{exercise.tags.slice(0, 3).map(tag => (
							<span
								className='rounded bg-blue-50 px-2 py-1 text-blue-600 text-xs dark:bg-blue-900/30 dark:text-blue-400'
								key={tag}
							>
								{t('ui.hashSymbol')}
								{tag}
							</span>
						))}
						{exercise.tags.length > 3 && (
							<span className='rounded bg-gray-50 px-2 py-1 text-gray-500 text-xs dark:bg-gray-700'>
								{t('ui.plusSymbol')}
								{exercise.tags.length - 3}
							</span>
						)}
					</div>
				)}

				<div className='mb-4 flex items-center justify-between text-gray-500 text-sm dark:text-gray-400'>
					<div className='flex items-center gap-4'>
						<span>
							{t('ui.documentEmoji')} {exercise.totalCases}{' '}
							{t('exercise.cases')}
						</span>
						<span>
							{t('ui.booksEmoji')} {exercise.totalBlocks} {t('exercise.blocks')}
						</span>
						<span>
							{t('ui.timerEmoji')} {exercise.estimatedTimeMinutes}{' '}
							{t('exercise.minutes')}
						</span>
					</div>
				</div>

				<div className='flex gap-2'>
					<Link
						className='flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
						data-testid='start-exercise-button'
						to={`/exercise/${exercise.id}`}
					>
						{t('startExercise')}
					</Link>
					<Link
						className='flex items-center justify-center rounded-lg border border-blue-600 bg-transparent px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20'
						data-testid='learn-exercise-button'
						title={t('learn')}
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
	t: LibraryTranslator
}

function EmptyState({onClearFilters, t}: EmptyStateProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='py-16 text-center'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.4}}
		>
			<div className='mb-4 text-6xl'>{t('ui.searchEmoji')}</div>
			<h3 className='mb-2 font-semibold text-gray-900 text-xl dark:text-white'>
				{t('noExercisesFound')}
			</h3>
			<p className='mb-6 text-gray-600 dark:text-gray-400'>
				{t('noExercisesFoundDesc')}
			</p>
			<button
				className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
				onClick={onClearFilters}
				type='button'
			>
				{t('clearFilters')}
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
