import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {useI18n} from '@/hooks/useI18n'
import {useSettingsStore} from '@/stores/settings'
import type {Language} from '@/types/settings'
import {UI_LANGUAGES} from '@/types/settings'

export function LanguageDropdown() {
	const {uiLanguage, setUiLanguage} = useSettingsStore()
	const {t} = useI18n()
	const [isOpen, setIsOpen] = useState(false)

	const currentLanguage = UI_LANGUAGES.find(lang => lang.code === uiLanguage)
	const otherLanguages = UI_LANGUAGES.filter(lang => lang.code !== uiLanguage)

	const handleLanguageChange = (language: Language) => {
		setUiLanguage(language)
		setIsOpen(false)
	}

	return (
		<div className='relative'>
			<motion.button
				animate={{opacity: 1, scale: 1}}
				className='flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-sm transition-all hover:border-gray-400 hover:shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
				initial={{opacity: 0, scale: 0.9}}
				onClick={() => setIsOpen(!isOpen)}
				title={t('header.selectLanguage')}
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

			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop for mobile */}
						<motion.div
							animate={{opacity: 1}}
							className='fixed inset-0 z-10 md:hidden'
							exit={{opacity: 0}}
							initial={{opacity: 0}}
							onClick={() => setIsOpen(false)}
						/>

						{/* Dropdown menu */}
						<motion.div
							animate={{opacity: 1, y: 0}}
							className='absolute top-full right-0 z-20 mt-1 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'
							exit={{opacity: 0, y: -10}}
							initial={{opacity: 0, y: -10}}
							transition={{duration: 0.15}}
						>
							<div className='py-1'>
								{otherLanguages.map(language => (
									<button
										className='flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 text-sm transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
										key={language.code}
										onClick={() => handleLanguageChange(language.code)}
										type='button'
									>
										<span className='text-base'>{language.flag}</span>
										<span>{language.name}</span>
									</button>
								))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}
