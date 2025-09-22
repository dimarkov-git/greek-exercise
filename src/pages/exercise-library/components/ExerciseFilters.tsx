import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'

type Translate = (key: string) => string

type Difficulty = string

type Tag = string

interface ExerciseFiltersProps {
	selectedDifficulties: Difficulty[]
	setSelectedDifficulties: (difficulties: Difficulty[]) => void
	selectedTags: Tag[]
	setSelectedTags: (tags: Tag[]) => void
	allTags: Tag[]
	t: Translate
}

export function ExerciseFilters({
	selectedDifficulties,
	setSelectedDifficulties,
	selectedTags,
	setSelectedTags,
	allTags,
	t
}: ExerciseFiltersProps) {
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

interface DifficultyFilterProps {
	selectedDifficulties: Difficulty[]
	setSelectedDifficulties: (difficulties: Difficulty[]) => void
	t: Translate
}

function DifficultyFilter({
	selectedDifficulties,
	setSelectedDifficulties,
	t
}: DifficultyFilterProps) {
	const toggleDifficulty = (difficulty: Difficulty) => {
		if (selectedDifficulties.includes(difficulty)) {
			setSelectedDifficulties(
				selectedDifficulties.filter(existing => existing !== difficulty)
			)
			return
		}

		setSelectedDifficulties([...selectedDifficulties, difficulty])
	}

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
						onClick={() => toggleDifficulty(difficulty)}
						type='button'
					>
						{t(`difficulty.${difficulty}`)}
					</button>
				))}
			</div>
		</div>
	)
}

interface TagsFilterProps {
	allTags: Tag[]
	selectedTags: Tag[]
	setSelectedTags: (tags: Tag[]) => void
	t: Translate
}

function TagsFilter({
	allTags,
	selectedTags,
	setSelectedTags,
	t
}: TagsFilterProps) {
	if (allTags.length === 0) return null

	const toggleTag = (tag: Tag) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter(existing => existing !== tag))
			return
		}

		setSelectedTags([...selectedTags, tag])
	}

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
						onClick={() => toggleTag(tag)}
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

interface FilterSummaryInlineProps {
	selectedDifficulties: Difficulty[]
	selectedTags: Tag[]
	t: Translate
}

function FilterSummaryInline({
	selectedDifficulties,
	selectedTags,
	t
}: FilterSummaryInlineProps) {
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
						selectedDifficulties.map(difficulty => (
							<span
								className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300'
								key={difficulty}
							>
								{t(`difficulty.${difficulty}`)}
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
