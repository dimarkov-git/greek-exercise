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
		key: 'hintLanguage',
		fallback: 'Hint language'
	},
	{
		key: 'userLanguageDescription',
		fallback:
			'Choose a language you already know. It will be used for hints in exercises.'
	},
	{
		key: 'exerciseCount',
		fallback: 'Available exercises: {filteredCount}'
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
		key: 'learn',
		fallback: 'Learn'
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
		key: 'ui.hintLanguage',
		fallback: 'Hint language'
	},
	{
		key: 'ui.chevronDown',
		fallback: '▼'
	},
	{
		key: 'ui.colon',
		fallback: ':'
	},
	{
		key: 'ui.chevronUp',
		fallback: '▲'
	},
	{
		key: 'ui.expand',
		fallback: 'Expand'
	},
	{
		key: 'ui.collapse',
		fallback: 'Collapse'
	},
	{
		key: 'difficulty.a0',
		fallback: 'A0'
	},
	{
		key: 'difficulty.a1',
		fallback: 'A1'
	},
	{
		key: 'difficulty.a2',
		fallback: 'A2'
	},
	{
		key: 'difficulty.b1',
		fallback: 'B1'
	},
	{
		key: 'difficulty.b2',
		fallback: 'B2'
	},
	{
		key: 'difficulty.c1',
		fallback: 'C1'
	},
	{
		key: 'difficulty.c2',
		fallback: 'C2'
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
	setSelectedTags,
	setSelectedDifficulties,
	t
}: {
	filteredExercises: import('@/types/exercises').ExerciseMetadata[]
	setSelectedTags: (tags: string[]) => void
	setSelectedDifficulties: (difficulties: string[]) => void
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
				{t('exerciseCount').replace(
					'{filteredCount}',
					filteredExercises.length.toString()
				)}
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
							setSelectedDifficulties([])
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
			userLanguage as keyof typeof labels.a0
		] || difficulty
	)
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
				{/* Header */}
				<div className='mb-4 flex items-start justify-between'>
					<div className='flex-1'>
						<h3 className='mb-2 font-semibold text-gray-900 text-lg dark:text-white'>
							{exercise.titleI18n[uiLanguage] || exercise.title}
						</h3>
						<p className='line-clamp-2 text-gray-600 text-sm dark:text-gray-400'>
							{exercise.descriptionI18n[uiLanguage] || exercise.description}
						</p>
					</div>
					<span
						className={`ml-3 rounded-full px-2 py-1 font-medium text-xs ${getDifficultyColor(exercise.difficulty)}`}
					>
						{getDifficultyLabel(exercise.difficulty, uiLanguage)}
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

				{/* Actions */}
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

function SettingsSummaryInline({t}: {t: (key: string) => string}) {
	const {userLanguage} = useSettingsStore()

	const getLanguageFlag = (lang: string) => {
		switch (lang) {
			case 'ru':
				return '🇷🇺'
			case 'en':
				return '🇺🇸'
			default:
				return '🌐'
		}
	}

	return (
		<span className='text-gray-600 text-sm dark:text-gray-400'>
			{t('hintLanguage')}
			{t('ui.colon')} {getLanguageFlag(userLanguage)}
		</span>
	)
}

function UserSettings({t}: {t: (key: string) => string}) {
	const [isCollapsed, setIsCollapsed] = useState(false)

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.1}}
		>
			{/* Header with collapse button */}
			<motion.button
				className='flex w-full cursor-pointer items-center justify-between p-6 text-left transition-all hover:bg-gray-50 hover:pb-7 dark:hover:bg-gray-700'
				onClick={() => setIsCollapsed(!isCollapsed)}
				type='button'
			>
				<div className='flex flex-1 items-baseline gap-3'>
					<h3 className='font-semibold text-gray-900 dark:text-white'>
						{t('settings')}
					</h3>
					{isCollapsed && <SettingsSummaryInline t={t} />}
				</div>
				<motion.svg
					animate={{rotate: isCollapsed ? 0 : 180}}
					className='h-4 w-4 fill-gray-500 transition-transform dark:fill-gray-400'
					transition={{duration: 0.2}}
					viewBox='0 0 12 12'
				>
					<title>{isCollapsed ? t('ui.expand') : t('ui.collapse')}</title>
					<path d='M6 8L2 4h8l-4 4z' />
				</motion.svg>
			</motion.button>

			{/* Collapsible content */}
			<AnimatePresence>
				{!isCollapsed && (
					<motion.div
						animate={{height: 'auto', opacity: 1}}
						exit={{height: 0, opacity: 0}}
						initial={{height: 0, opacity: 0}}
						style={{overflow: 'hidden'}}
						transition={{duration: 0.3}}
					>
						<div className='px-6 pb-6'>
							<p className='mb-3 text-gray-600 text-sm dark:text-gray-400'>
								{t('userLanguageDescription')}
							</p>
							<UserLanguageSelector />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

function DifficultyFilter({
	selectedDifficulties,
	setSelectedDifficulties,
	t
}: {
	selectedDifficulties: string[]
	setSelectedDifficulties: (difficulties: string[]) => void
	t: (key: string) => string
}) {
	return (
		<div className='mb-4'>
			<div className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'>
				{t('difficulty')}
			</div>
			<div className='flex flex-wrap gap-2'>
				<button
					className={`cursor-pointer rounded-full px-3 py-1 font-medium text-sm transition-colors ${
						selectedDifficulties.length === 0
							? 'bg-blue-600 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
					}`}
					onClick={() => setSelectedDifficulties([])}
					type='button'
				>
					{t('all')}
				</button>
				{['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'].map(difficulty => (
					<button
						className={`cursor-pointer rounded-full px-3 py-1 font-medium text-sm transition-colors ${
							selectedDifficulties.includes(difficulty)
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
						}`}
						key={difficulty}
						onClick={() => {
							if (selectedDifficulties.includes(difficulty)) {
								setSelectedDifficulties(
									selectedDifficulties.filter(d => d !== difficulty)
								)
							} else {
								setSelectedDifficulties([...selectedDifficulties, difficulty])
							}
						}}
						type='button'
					>
						{t(`difficulty.${difficulty}`)}
					</button>
				))}
			</div>
		</div>
	)
}

function TagsFilter({
	selectedTags,
	setSelectedTags,
	allTags,
	t
}: {
	selectedTags: string[]
	setSelectedTags: (tags: string[]) => void
	allTags: string[]
	t: (key: string) => string
}) {
	if (allTags.length === 0) return null

	return (
		<div>
			<div className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'>
				{t('tags')}
			</div>
			<div className='flex flex-wrap gap-2'>
				{allTags.map(tag => (
					<button
						className={`cursor-pointer rounded-full px-3 py-1 font-medium text-sm transition-colors ${
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
	)
}

function FilterSummaryInline({
	selectedDifficulties,
	selectedTags,
	t
}: {
	selectedDifficulties: string[]
	selectedTags: string[]
	t: (key: string) => string
}) {
	return (
		<div className='flex items-center gap-2 text-sm'>
			<div className='flex items-center gap-1'>
				<span className='text-gray-600 dark:text-gray-400'>
					{t('difficulty')}
					{t('ui.colon')}
				</span>
				<div className='flex gap-1'>
					{selectedDifficulties.length === 0 ? (
						<span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300'>
							{t('all')}
						</span>
					) : (
						selectedDifficulties.map(d => (
							<span
								className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300'
								key={d}
							>
								{t(`difficulty.${d}`)}
							</span>
						))
					)}
				</div>
			</div>
			{selectedTags.length > 0 && (
				<div className='flex items-center gap-1'>
					<span className='text-gray-600 dark:text-gray-400'>
						{t('tags')}
						{t('ui.colon')}
					</span>
					<div className='flex gap-1'>
						{selectedTags.slice(0, 3).map(tag => (
							<span
								className='inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-700 dark:text-gray-300'
								key={tag}
							>
								{tag}
							</span>
						))}
						{selectedTags.length > 3 && (
							<span className='text-gray-500 text-xs dark:text-gray-400'>
								{t('ui.plusSymbol')}
								{selectedTags.length - 3}
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

function ExerciseFilters({
	selectedDifficulties,
	setSelectedDifficulties,
	selectedTags,
	setSelectedTags,
	allTags,
	t
}: {
	selectedDifficulties: string[]
	setSelectedDifficulties: (difficulties: string[]) => void
	selectedTags: string[]
	setSelectedTags: (tags: string[]) => void
	allTags: string[]
	t: (key: string) => string
}) {
	const [isCollapsed, setIsCollapsed] = useState(false)

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-8 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.2}}
		>
			<motion.button
				className='flex w-full cursor-pointer items-center justify-between p-6 text-left transition-all hover:bg-gray-50 hover:pb-7 dark:hover:bg-gray-700'
				onClick={() => setIsCollapsed(!isCollapsed)}
				type='button'
			>
				<div className='flex flex-1 items-baseline gap-3'>
					<h3 className='font-semibold text-gray-900 dark:text-white'>
						{t('filters')}
					</h3>
					{isCollapsed && (
						<FilterSummaryInline
							selectedDifficulties={selectedDifficulties}
							selectedTags={selectedTags}
							t={t}
						/>
					)}
				</div>
				<motion.svg
					animate={{rotate: isCollapsed ? 0 : 180}}
					className='h-4 w-4 fill-gray-500 transition-transform dark:fill-gray-400'
					transition={{duration: 0.2}}
					viewBox='0 0 12 12'
				>
					<title>{isCollapsed ? t('ui.expand') : t('ui.collapse')}</title>
					<path d='M6 8L2 4h8l-4 4z' />
				</motion.svg>
			</motion.button>

			<AnimatePresence>
				{!isCollapsed && (
					<motion.div
						animate={{height: 'auto', opacity: 1}}
						exit={{height: 0, opacity: 0}}
						initial={{height: 0, opacity: 0}}
						style={{overflow: 'hidden'}}
						transition={{duration: 0.3}}
					>
						<div className='px-6 pb-6'>
							<DifficultyFilter
								selectedDifficulties={selectedDifficulties}
								setSelectedDifficulties={setSelectedDifficulties}
								t={t}
							/>
							<TagsFilter
								allTags={allTags}
								selectedTags={selectedTags}
								setSelectedTags={setSelectedTags}
								t={t}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

function useExerciseFiltering() {
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])

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
			if (
				selectedDifficulties.length > 0 &&
				!selectedDifficulties.includes(exercise.difficulty)
			) {
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
		selectedDifficulties,
		setSelectedDifficulties,
		filterExercises,
		getAllTags
	}
}

export function ExerciseLibrary() {
	const {t} = useTranslations(EXERCISE_LIBRARY_TRANSLATIONS)
	const {data: exercises, isLoading, error} = useExercises()
	const {
		selectedTags,
		setSelectedTags,
		selectedDifficulties,
		setSelectedDifficulties,
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
								selectedDifficulties={selectedDifficulties}
								selectedTags={selectedTags}
								setSelectedDifficulties={setSelectedDifficulties}
								setSelectedTags={setSelectedTags}
								t={t}
							/>

							<ExerciseGrid
								filteredExercises={filteredExercises}
								setSelectedDifficulties={setSelectedDifficulties}
								setSelectedTags={setSelectedTags}
								t={t}
							/>
						</>
					)}
				</div>
			</div>
		</>
	)
}
