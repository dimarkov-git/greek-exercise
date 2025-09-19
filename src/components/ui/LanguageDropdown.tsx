import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {useTranslations} from '@/hooks/useTranslations'
import {useSettingsStore} from '@/stores/settings'
import type {Language} from '@/types/settings'
import {UI_LANGUAGES} from '@/types/settings'
import type {TranslationRequest} from '@/types/translations'

const LANGUAGE_DROPDOWN_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'header.selectLanguage',
		fallback: 'Select language'
	}
]

interface DropdownButtonProps {
	currentLanguage: {flag: string; name: string} | undefined
	isOpen: boolean
	onToggle: () => void
	title: string
	uiLanguage: string
}

function DropdownButton({
	currentLanguage,
	isOpen,
	onToggle,
	title,
	uiLanguage
}: DropdownButtonProps) {
	return (
		<motion.button
			animate={{opacity: 1, scale: 1}}
			className='flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-sm transition-all hover:border-gray-400 hover:shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
			data-current-language={uiLanguage}
			data-is-open={isOpen}
			data-testid='ui-language-dropdown'
			initial={{opacity: 0, scale: 0.9}}
			onClick={onToggle}
			title={title}
			transition={{delay: 0.3}}
			type='button'
			whileHover={{scale: 1.05}}
			whileTap={{scale: 0.95}}
		>
			<span className='text-lg'>{currentLanguage?.flag}</span>
			<motion.svg
				animate={{rotate: isOpen ? 180 : 0}}
				className='ml-1 h-4 w-4 fill-current'
				viewBox='0 0 12 12'
			>
				<title>Dropdown arrow</title>
				<path d='M6 8L2 4h8l-4 4z' />
			</motion.svg>
		</motion.button>
	)
}

interface DropdownMenuProps {
	otherLanguages: Array<{code: string; flag: string; name: string}>
	onLanguageChange: (language: Language) => void
	onClose: () => void
}

function DropdownMenu({
	otherLanguages,
	onLanguageChange,
	onClose
}: DropdownMenuProps) {
	return (
		<>
			<motion.div
				animate={{opacity: 1}}
				className='fixed inset-0 z-10 md:hidden'
				exit={{opacity: 0}}
				initial={{opacity: 0}}
				onClick={onClose}
			/>
			<motion.div
				animate={{opacity: 1, y: 0}}
				className='absolute top-full right-0 z-20 mt-1 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'
				data-testid='ui-language-dropdown-menu'
				exit={{opacity: 0, y: -10}}
				initial={{opacity: 0, y: -10}}
				transition={{duration: 0.15}}
			>
				<div className='py-1'>
					{otherLanguages.map(language => (
						<button
							className='flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 text-sm transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
							data-testid={`ui-language-option-${language.code}`}
							key={language.code}
							onClick={() => onLanguageChange(language.code as Language)}
							type='button'
						>
							<span className='text-base'>{language.flag}</span>
							<span>{language.name}</span>
						</button>
					))}
				</div>
			</motion.div>
		</>
	)
}

export function LanguageDropdown() {
	const {uiLanguage, setUiLanguage} = useSettingsStore()
	const {t} = useTranslations(LANGUAGE_DROPDOWN_TRANSLATIONS)
	const [isOpen, setIsOpen] = useState(false)

	const currentLanguage = UI_LANGUAGES.find(lang => lang.code === uiLanguage)
	const otherLanguages = UI_LANGUAGES.filter(lang => lang.code !== uiLanguage)

	const handleLanguageChange = (language: Language) => {
		setUiLanguage(language)
		setIsOpen(false)
	}

	return (
		<div className='relative'>
			<DropdownButton
				currentLanguage={currentLanguage}
				isOpen={isOpen}
				onToggle={() => setIsOpen(!isOpen)}
				title={t('header.selectLanguage')}
				uiLanguage={uiLanguage}
			/>
			<AnimatePresence>
				{isOpen && (
					<DropdownMenu
						onClose={() => setIsOpen(false)}
						onLanguageChange={handleLanguageChange}
						otherLanguages={otherLanguages}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
