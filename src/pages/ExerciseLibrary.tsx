import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {Link} from 'react-router'
import {Head} from '@/components/Head'
import {LoadingOrError} from '@/components/LoadingOrError'
import {UserLanguageSelector} from '@/components/ui/UserLanguageSelector'
import {useExercises} from '@/hooks/useExercises'
import {useI18n} from '@/hooks/useI18n'
import {useSettingsStore} from '@/stores/settings'
import type {ExerciseMetadata} from '@/types/exercises'

interface ExerciseCardProps {
	exercise: ExerciseMetadata
	index: number
}

function LibraryHeader({t}: {t: (key: string) => string}) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-12 text-center'
			initial={{opacity: 0, y: 20}}
		>
			<div className='mb-4 text-6xl'>📚</div>
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
	setSelectedDifficulty
}: {
	filteredExercises: import('@/types/exercises').ExerciseMetadata[]
	exercises: import('@/types/exercises').ExerciseMetadata[]
	setSelectedTags: (tags: string[]) => void
	setSelectedDifficulty: (difficulty: string) => void
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
				Showing {filteredExercises.length} of {exercises.length} exercises
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
						<ExerciseCard exercise={exercise} index={index} key={exercise.id} />
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
					<div className='mb-4 text-6xl'>🔍</div>
					<h3 className='mb-2 font-semibold text-gray-900 text-xl dark:text-white'>
						No exercises found
					</h3>
					<p className='mb-6 text-gray-600 dark:text-gray-400'>
						Try adjusting your filters or browse all exercises
					</p>
					<button
						className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
						onClick={() => {
							setSelectedTags([])
							setSelectedDifficulty('')
						}}
						type='button'
					>
						Clear Filters
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

function ExerciseCard({exercise, index}: ExerciseCardProps) {
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
								#{tag}
							</span>
						))}
						{exercise.tags.length > 3 && (
							<span className='rounded bg-gray-50 px-2 py-1 text-gray-500 text-xs dark:bg-gray-700'>
								+{exercise.tags.length - 3}
							</span>
						)}
					</div>
				)}

				{/* Stats */}
				<div className='mb-4 flex items-center justify-between text-gray-500 text-sm dark:text-gray-400'>
					<div className='flex items-center gap-4'>
						<span>📝 {exercise.totalCases} cases</span>
						<span>📚 {exercise.totalBlocks} blocks</span>
						<span>⏱️ {exercise.estimatedTimeMinutes} min</span>
					</div>
				</div>

				{/* Action */}
				<Link
					className='block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700'
					to={`/exercise/${exercise.id}`}
				>
					Start Exercise
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
	allTags
}: {
	selectedDifficulty: string
	setSelectedDifficulty: (difficulty: string) => void
	selectedTags: string[]
	setSelectedTags: (tags: string[]) => void
	allTags: string[]
}) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.2}}
		>
			<h3 className='mb-4 font-semibold text-gray-900 dark:text-white'>
				Filters
			</h3>

			{/* Difficulty Filter */}
			<div className='mb-4'>
				<div className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'>
					Difficulty
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
						All
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
						Tags
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
								#{tag}
							</button>
						))}
					</div>
				</div>
			)}
		</motion.div>
	)
}

export function ExerciseLibrary() {
	const {t} = useI18n()
	const {data: exercises, isLoading, error} = useExercises()
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')

	// Get all unique tags
	const allTags = exercises
		? [...new Set(exercises.flatMap(ex => ex.tags))].sort()
		: []

	// Filter exercises
	const filteredExercises =
		exercises?.filter(exercise => {
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
		}) || []

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
							/>

							<ExerciseGrid
								exercises={exercises}
								filteredExercises={filteredExercises}
								setSelectedDifficulty={setSelectedDifficulty}
								setSelectedTags={setSelectedTags}
							/>
						</>
					)}

					{/* Back to Home */}
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
							← Back to Home
						</Link>
					</motion.div>
				</div>
			</div>
		</>
	)
}
