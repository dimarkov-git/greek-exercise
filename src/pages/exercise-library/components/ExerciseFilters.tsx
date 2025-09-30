import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import type {Difficulty} from '@/entities/exercise'
import type {Language} from '@/shared/model/settings'
import {UI_LANGUAGES} from '@/shared/model/settings'
import type {exerciseLibraryTranslations} from '../translations'

const LANGUAGE_DISPLAY = new Map<Language, string>(
	UI_LANGUAGES.map(option => [option.code, `${option.flag} ${option.name}`])
)

interface ExerciseFiltersProps {
	difficultyOptions: Difficulty[]
	languageOptions: Language[]
	selectedDifficulties: Difficulty[]
	setSelectedDifficulties: (difficulties: Difficulty[]) => void
	selectedLanguages: Language[]
	setSelectedLanguages: (languages: Language[]) => void
	selectedTags: string[]
	setSelectedTags: (tags: string[]) => void
	tagOptions: string[]
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

export function ExerciseFilters({
	difficultyOptions,
	languageOptions,
	selectedDifficulties,
	setSelectedDifficulties,
	selectedLanguages,
	setSelectedLanguages,
	selectedTags,
	setSelectedTags,
	tagOptions,
	t,
	translations
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
						{t(translations.filters)}
					</h3>
					{isCollapsed && (
						<FilterSummaryInline
							selectedDifficulties={selectedDifficulties}
							selectedLanguages={selectedLanguages}
							selectedTags={selectedTags}
							t={t}
							translations={translations}
						/>
					)}
				</div>
				<motion.svg
					animate={{rotate: isCollapsed ? 0 : 180}}
					className='h-4 w-4 fill-gray-500 transition-transform dark:fill-gray-400'
					transition={{duration: 0.2}}
					viewBox='0 0 12 12'
				>
					<title>
						{isCollapsed
							? t(translations['ui.expand'])
							: t(translations['ui.collapse'])}
					</title>
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
								options={difficultyOptions}
								selectedDifficulties={selectedDifficulties}
								setSelectedDifficulties={setSelectedDifficulties}
								t={t}
								translations={translations}
							/>
							<LanguageFilter
								languageOptions={languageOptions}
								selectedLanguages={selectedLanguages}
								setSelectedLanguages={setSelectedLanguages}
								t={t}
								translations={translations}
							/>
							<TagsFilter
								allTags={tagOptions}
								selectedTags={selectedTags}
								setSelectedTags={setSelectedTags}
								t={t}
								translations={translations}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

interface DifficultyFilterProps {
	options: Difficulty[]
	selectedDifficulties: Difficulty[]
	setSelectedDifficulties: (difficulties: Difficulty[]) => void
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

function DifficultyFilter({
	options,
	selectedDifficulties,
	setSelectedDifficulties,
	t,
	translations
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
				{t(translations.difficulty)}
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
					{t(translations.all)}
				</button>
				{options.map(difficulty => (
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
						{t(
							translations[
								`difficulty.${difficulty}` as keyof typeof translations
							]
						)}
					</button>
				))}
			</div>
		</div>
	)
}

interface LanguageFilterProps {
	languageOptions: Language[]
	selectedLanguages: Language[]
	setSelectedLanguages: (languages: Language[]) => void
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

function LanguageFilter({
	languageOptions,
	selectedLanguages,
	setSelectedLanguages,
	t,
	translations
}: LanguageFilterProps) {
	if (languageOptions.length === 0) {
		return null
	}

	const toggleLanguage = (language: Language) => {
		if (selectedLanguages.includes(language)) {
			setSelectedLanguages(
				selectedLanguages.filter(existing => existing !== language)
			)
			return
		}

		setSelectedLanguages([...selectedLanguages, language])
	}

	return (
		<div className='mb-4'>
			<div className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'>
				{t(translations.language)}
			</div>
			<div className='flex flex-wrap gap-2'>
				<button
					className={`cursor-pointer rounded-full px-3 py-1 font-medium text-sm transition-colors ${
						selectedLanguages.length === 0
							? 'bg-blue-600 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
					}`}
					onClick={() => setSelectedLanguages([])}
					type='button'
				>
					{t(translations.all)}
				</button>
				{languageOptions.map(language => (
					<button
						className={`cursor-pointer rounded-full px-3 py-1 font-medium text-sm transition-colors ${
							selectedLanguages.includes(language)
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
						}`}
						key={language}
						onClick={() => toggleLanguage(language)}
						type='button'
					>
						{LANGUAGE_DISPLAY.get(language) ?? language.toUpperCase()}
					</button>
				))}
			</div>
		</div>
	)
}

interface TagsFilterProps {
	allTags: string[]
	selectedTags: string[]
	setSelectedTags: (tags: string[]) => void
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

function TagsFilter({
	allTags,
	selectedTags,
	setSelectedTags,
	t,
	translations
}: TagsFilterProps) {
	if (allTags.length === 0) return null

	const toggleTag = (tag: string) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter(existing => existing !== tag))
			return
		}

		setSelectedTags([...selectedTags, tag])
	}

	return (
		<div>
			<div className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'>
				{t(translations.tags)}
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
						{t(translations['ui.hashSymbol'])}
						{tag}
					</button>
				))}
			</div>
		</div>
	)
}

interface FilterSummaryInlineProps {
	selectedDifficulties: Difficulty[]
	selectedLanguages: Language[]
	selectedTags: string[]
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

function FilterSummaryInline({
	selectedDifficulties,
	selectedLanguages,
	selectedTags,
	t,
	translations
}: FilterSummaryInlineProps) {
	return (
		<div className='flex items-center gap-2 text-sm'>
			<div className='flex items-center gap-1'>
				<span className='text-gray-600 dark:text-gray-400'>
					{t(translations.difficulty)}
					{t(translations['ui.colon'])}
				</span>
				<div className='flex gap-1'>
					{selectedDifficulties.length === 0 ? (
						<span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300'>
							{t(translations.all)}
						</span>
					) : (
						selectedDifficulties.map(difficulty => (
							<span
								className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300'
								key={difficulty}
							>
								{t(
									translations[
										`difficulty.${difficulty}` as keyof typeof translations
									]
								)}
							</span>
						))
					)}
				</div>
			</div>
			<div className='flex items-center gap-1'>
				<span className='text-gray-600 dark:text-gray-400'>
					{t(translations.language)}
					{t(translations['ui.colon'])}
				</span>
				<div className='flex gap-1'>
					{selectedLanguages.length === 0 ? (
						<span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300'>
							{t(translations.all)}
						</span>
					) : (
						selectedLanguages.map(language => (
							<span
								className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300'
								key={language}
							>
								{LANGUAGE_DISPLAY.get(language) ?? language.toUpperCase()}
							</span>
						))
					)}
				</div>
			</div>
			{selectedTags.length > 0 && (
				<div className='flex items-center gap-1'>
					<span className='text-gray-600 dark:text-gray-400'>
						{t(translations.tags)}
						{t(translations['ui.colon'])}
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
								{t(translations['ui.plusSymbol'])}
								{selectedTags.length - 3}
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
