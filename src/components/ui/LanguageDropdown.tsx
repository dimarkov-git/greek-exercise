import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {useTranslations} from '@/hooks/useTranslations'
import {languageDropdownTranslations} from '@/shared/lib/i18n/dictionaries'
import {useSettingsStore} from '@/shared/model'
import type {Language} from '@/shared/model/settings'
import {UI_LANGUAGES} from '@/shared/model/settings'

interface DropdownButtonProps {
	currentLanguage: {flag: string; name: string} | undefined
	isOpen: boolean
	onToggle: () => void
	title: string
	uiLanguage: string
	dropdownArrowTitle: string
}

function DropdownButton({
	currentLanguage,
	isOpen,
	onToggle,
	title,
	uiLanguage,
	dropdownArrowTitle
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
				className='ml-1 h-4 w-4 fill-gray-600 dark:fill-gray-300'
				viewBox='0 0 12 12'
			>
				<title>{dropdownArrowTitle}</title>
				<path d='M6 8L2 4h8l-4 4z' />
			</motion.svg>
		</motion.button>
	)
}

interface DropdownMenuProps {
	allLanguages: Array<{code: string; flag: string; name: string}>
	currentLanguage: string
	selectedLanguageTitle: string
	onLanguageChange: (language: Language) => void
	onClose: () => void
}

function DropdownMenu({
	allLanguages,
	currentLanguage,
	selectedLanguageTitle,
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
					{allLanguages.map(language => {
						const isActive = language.code === currentLanguage
						return (
							<button
								className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
									isActive
										? 'cursor-default bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
										: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
								}`}
								data-testid={`ui-language-option-${language.code}`}
								disabled={isActive}
								key={language.code}
								onClick={() =>
									!isActive && onLanguageChange(language.code as Language)
								}
								type='button'
							>
								<span className='text-base'>{language.flag}</span>
								<span className='flex-1'>{language.name}</span>
								{isActive && (
									<span className='text-blue-600 dark:text-blue-400'>
										<svg
											className='h-4 w-4'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<title>{selectedLanguageTitle}</title>
											<path
												clipRule='evenodd'
												d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
												fillRule='evenodd'
											/>
										</svg>
									</span>
								)}
							</button>
						)
					})}
				</div>
			</motion.div>
		</>
	)
}

export function LanguageDropdown() {
	const {uiLanguage, setUiLanguage} = useSettingsStore()
	const {t} = useTranslations(languageDropdownTranslations)
	const [isOpen, setIsOpen] = useState(false)

	const currentLanguage = UI_LANGUAGES.find(lang => lang.code === uiLanguage)
	const allLanguages = UI_LANGUAGES

	const handleLanguageChange = (language: Language) => {
		setUiLanguage(language)
		setIsOpen(false)
	}

	return (
		<div className='relative'>
			<DropdownButton
				currentLanguage={currentLanguage}
				dropdownArrowTitle={t('ui.dropdownArrow')}
				isOpen={isOpen}
				onToggle={() => setIsOpen(!isOpen)}
				title={t('header.selectLanguage')}
				uiLanguage={uiLanguage}
			/>
			<AnimatePresence>
				{isOpen && (
					<DropdownMenu
						allLanguages={allLanguages}
						currentLanguage={uiLanguage}
						onClose={() => setIsOpen(false)}
						onLanguageChange={handleLanguageChange}
						selectedLanguageTitle={t('ui.selectedLanguage')}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
