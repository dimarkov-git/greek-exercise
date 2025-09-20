import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {Link} from 'react-router'
import {Head} from '@/components/Head'
import {LoadingOrError} from '@/components/LoadingOrError'
import {UserLanguageSelector} from '@/components/ui/UserLanguageSelector'
import {useExercises} from '@/hooks/useExercises'
import {useTranslations} from '@/hooks/useTranslations'
import {useSettingsStore} from '@/stores/settings'
import type {ExerciseMetadata} from '@/types/exercises'
import type {TranslationRequest} from '@/types/translations'

const EXERCISE_LIBRARY_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'exerciseLibrary',
		fallback: 'Exercise Library'
	},
	{
		key: 'exerciseLibraryDesc',
		fallback: 'Browse and execute available exercises'
	},
	{
		key: 'settings',
		fallback: 'Settings'
	},
	{
		key: 'userLanguageDescription',
		fallback:
			'Choose a language you already know. It will be used for hints in exercises.'
	},
	{
		key: 'exerciseCount',
		fallback: 'Showing {filteredCount} of {totalCount} exercises'
	},
	{
		key: 'noExercisesFound',
		fallback: 'No exercises found'
	},
	{
		key: 'noExercisesFoundDesc',
		fallback: 'Try adjusting your filters or browse all exercises'
	},
	{
		key: 'clearFilters',
		fallback: 'Clear Filters'
	},
	{
		key: 'startExercise',
		fallback: 'Start Exercise'
	},
	{
		key: 'filters',
		fallback: 'Filters'
	},
	{
		key: 'difficulty',
		fallback: 'Difficulty'
	},
	{
		key: 'tags',
		fallback: 'Tags'
	},
	{
		key: 'all',
		fallback: 'All'
	},
	{
		key: 'ui.searchEmoji',
		fallback: '🔍'
	},
	{
		key: 'ui.documentEmoji',
		fallback: '📝'
	},
	{
		key: 'ui.booksEmoji',
		fallback: '📚'
	},
	{
		key: 'ui.timerEmoji',
		fallback: '⏱️'
	},
	{
		key: 'exercise.cases',
		fallback: 'cases'
	},
	{
		key: 'exercise.blocks',
		fallback: 'blocks'
	},
	{
		key: 'exercise.minutes',
		fallback: 'min'
	},
	{
		key: 'ui.hashSymbol',
		fallback: '#'
	},
	{
		key: 'ui.plusSymbol',
		fallback: '+'
	},
	{
		key: 'ui.backToHome',
		fallback: '← Back to Home'
	}
]

interface ExerciseCardProps {
	exercise: ExerciseMetadata
	index: number
	t: (key: string) => string
}

function LibraryHeader({t}: {t: (key: string) => string}) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-12 text-center'
			initial={{opacity: 0, y: 20}}
		>
			<h1 className='mb-4 font-bold text-4xl text-gray-900 dark:text-white'>
				{t('exerciseLibrary')}
			</h1>
			<p className='text-gray-600 text-xl dark:text-gray-400'>
				{t('exerciseLibraryDesc')}
			</p>
		</motion.div>
	)
}

function ExerciseGrid({
	filteredExercises,
	exercises,
	setSelectedTags,
	setSelectedDifficulty,
	t
}: {
	filteredExercises: import('@/types/exercises').ExerciseMetadata[]
	exercises: import('@/types/exercises').ExerciseMetadata[]
	setSelectedTags: (tags: string[]) => void
	setSelectedDifficulty: (difficulty: string) => void
	t: (key: string) => string
}) {
	return (
		<>
			{/* Results Count */}
			<motion.div
				animate={{opacity: 1}}
				className='mb-6 text-gray-500 text-sm dark:text-gray-400'
				initial={{opacity: 0}}
				transition={{delay: 0.3}}
			>
				{t('exerciseCount')
					.replace('{filteredCount}', filteredExercises.length.toString())
					.replace('{totalCount}', exercises.length.toString())}
			</motion.div>

			{/* Exercises Grid */}
			<motion.div
				animate={{opacity: 1}}
				className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
				initial={{opacity: 0}}
				transition={{delay: 0.4}}
			>
				<AnimatePresence>
					{filteredExercises.map((exercise, index) => (
						<ExerciseCard
							exercise={exercise}
							index={index}
							key={exercise.id}
							t={t}
						/>
					))}
				</AnimatePresence>
			</motion.div>

			{/* Empty State */}
			{filteredExercises.length === 0 && (
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
						onClick={() => {
							setSelectedTags([])
							setSelectedDifficulty('')
						}}
						type='button'
					>
						{t('clearFilters')}
					</button>
				</motion.div>
			)}
		</>
	)
}

function getDifficultyColor(difficulty: string): string {
	switch (difficulty) {
		case 'beginner':
			return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
		case 'intermediate':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
		case 'advanced':
			return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
	}
}

function getDifficultyLabel(difficulty: string, userLanguage: string): string {
	const labels = {
		beginner: {en: 'Beginner', ru: 'Начальный', el: 'Αρχάριος'},
		intermediate: {en: 'Intermediate', ru: 'Средний', el: 'Μεσαίος'},
		advanced: {en: 'Advanced', ru: 'Продвинутый', el: 'Προχωρημένος'}
	}
	return (
		labels[difficulty as keyof typeof labels]?.[
			userLanguage as keyof typeof labels.beginner
		] || difficulty
	)
}

function ExerciseCard({exercise, index, t}: ExerciseCardProps) {
	const {userLanguage} = useSettingsStore()

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: index * 0.1, duration: 0.4}}
		>
			<div className='p-6'>
				{/* Header */}
				<div className='mb-4 flex items-start justify-between'>
					<div className='flex-1'>
						<h3 className='mb-2 font-semibold text-gray-900 text-lg dark:text-white'>
							{exercise.titleI18n[userLanguage] || exercise.title}
						</h3>
						<p className='line-clamp-2 text-gray-600 text-sm dark:text-gray-400'>
							{exercise.descriptionI18n[userLanguage] || exercise.description}
						</p>
					</div>
					<span
						className={`ml-3 rounded-full px-2 py-1 font-medium text-xs ${getDifficultyColor(exercise.difficulty)}`}
					>
						{getDifficultyLabel(exercise.difficulty, userLanguage)}
					</span>
				</div>

				{/* Tags */}
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

				{/* Stats */}
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

				{/* Action */}
				<Link
					className='block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700'
					to={`/exercise/${exercise.id}`}
				>
					{t('startExercise')}
				</Link>
			</div>
		</motion.div>
	)
}

function UserSettings({t}: {t: (key: string) => string}) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.1}}
		>
			<h3 className='mb-4 font-semibold text-gray-900 dark:text-white'>
				{t('settings')}
			</h3>

			<div className='mb-4'>
				<p className='mb-3 text-gray-600 text-sm dark:text-gray-400'>
					{t('userLanguageDescription')}
				</p>
				<UserLanguageSelector />
			</div>
		</motion.div>
	)
}

function ExerciseFilters({
	selectedDifficulty,
	setSelectedDifficulty,
	selectedTags,
	setSelectedTags,
	allTags,
	t
}: {
	selectedDifficulty: string
	setSelectedDifficulty: (difficulty: string) => void
	selectedTags: string[]
	setSelectedTags: (tags: string[]) => void
	allTags: string[]
	t: (key: string) => string
}) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.2}}
		>
			<h3 className='mb-4 font-semibold text-gray-900 dark:text-white'>
				{t('filters')}
			</h3>

			{/* Difficulty Filter */}
			<div className='mb-4'>
				<div className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'>
					{t('difficulty')}
				</div>
				<div className='flex flex-wrap gap-2'>
					<button
						className={`rounded-full px-3 py-1 font-medium text-sm transition-colors ${
							selectedDifficulty === ''
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
						}`}
						onClick={() => setSelectedDifficulty('')}
						type='button'
					>
						{t('all')}
					</button>
					{['beginner', 'intermediate', 'advanced'].map(difficulty => (
						<button
							className={`rounded-full px-3 py-1 font-medium text-sm transition-colors ${
								selectedDifficulty === difficulty
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
							}`}
							key={difficulty}
							onClick={() => setSelectedDifficulty(difficulty)}
							type='button'
						>
							{difficulty}
						</button>
					))}
				</div>
			</div>

			{/* Tags Filter */}
			{allTags.length > 0 && (
				<div>
					<div className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'>
						{t('tags')}
					</div>
					<div className='flex flex-wrap gap-2'>
						{allTags.map(tag => (
							<button
								className={`rounded-full px-3 py-1 font-medium text-sm transition-colors ${
									selectedTags.includes(tag)
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
								}`}
								key={tag}
								onClick={() => {
									if (selectedTags.includes(tag)) {
										setSelectedTags(
											selectedTags.filter(existingTag => existingTag !== tag)
										)
									} else {
										setSelectedTags([...selectedTags, tag])
									}
								}}
								type='button'
							>
								{t('ui.hashSymbol')}
								{tag}
							</button>
						))}
					</div>
				</div>
			)}
		</motion.div>
	)
}

function useExerciseFiltering() {
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')

	const filterExercises = (exercises: ExerciseMetadata[] | undefined) => {
		if (!exercises) return []

		return exercises.filter(exercise => {
			// Tag filter
			if (selectedTags.length > 0) {
				const hasSelectedTag = selectedTags.some(tag =>
					exercise.tags.includes(tag)
				)
				if (!hasSelectedTag) return false
			}

			// Difficulty filter
			if (selectedDifficulty && exercise.difficulty !== selectedDifficulty) {
				return false
			}

			return true
		})
	}

	const getAllTags = (exercises: ExerciseMetadata[] | undefined) =>
		exercises ? [...new Set(exercises.flatMap(ex => ex.tags))].sort() : []

	return {
		selectedTags,
		setSelectedTags,
		selectedDifficulty,
		setSelectedDifficulty,
		filterExercises,
		getAllTags
	}
}

function BackToHomeSection({t}: {t: (key: string) => string}) {
	return (
		<motion.div
			animate={{opacity: 1}}
			className='mt-12 text-center'
			initial={{opacity: 0}}
			transition={{delay: 0.6}}
		>
			<Link
				className='inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
				to='/'
			>
				{t('ui.backToHome')}
			</Link>
		</motion.div>
	)
}

export function ExerciseLibrary() {
	const {t} = useTranslations(EXERCISE_LIBRARY_TRANSLATIONS)
	const {data: exercises, isLoading, error} = useExercises()
	const {
		selectedTags,
		setSelectedTags,
		selectedDifficulty,
		setSelectedDifficulty,
		filterExercises,
		getAllTags
	} = useExerciseFiltering()

	const allTags = getAllTags(exercises)
	const filteredExercises = filterExercises(exercises)

	return (
		<>
			<Head title={t('exerciseLibrary')} />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-6xl px-4 py-8'>
					<LibraryHeader t={t} />

					{/* Loading/Error States */}
					{(isLoading || error) && <LoadingOrError {...(error && {error})} />}

					{/* Content */}
					{exercises && (
						<>
							<UserSettings t={t} />

							<ExerciseFilters
								allTags={allTags}
								selectedDifficulty={selectedDifficulty}
								selectedTags={selectedTags}
								setSelectedDifficulty={setSelectedDifficulty}
								setSelectedTags={setSelectedTags}
								t={t}
							/>

							<ExerciseGrid
								exercises={exercises}
								filteredExercises={filteredExercises}
								setSelectedDifficulty={setSelectedDifficulty}
								setSelectedTags={setSelectedTags}
								t={t}
							/>
						</>
					)}

					<BackToHomeSection t={t} />
				</div>
			</div>
		</>
	)
}
