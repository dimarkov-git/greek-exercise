import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {useSettingsStore} from '@/shared/model'
import {UserLanguageSelector} from '@/shared/ui/user-language-selector'
import type {exerciseLibraryTranslations} from '../translations'

interface UserSettingsProps {
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

export function UserSettings({t, translations}: UserSettingsProps) {
	const [isCollapsed, setIsCollapsed] = useState(false)

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.1}}
		>
			<motion.button
				className='flex w-full cursor-pointer items-center justify-between p-6 text-left transition-all hover:bg-gray-50 hover:pb-7 dark:hover:bg-gray-700'
				onClick={() => setIsCollapsed(!isCollapsed)}
				type='button'
			>
				<div className='flex flex-1 items-baseline gap-3'>
					<h3 className='font-semibold text-gray-900 dark:text-white'>
						{t(translations.settings)}
					</h3>
					{isCollapsed && (
						<SettingsSummaryInline t={t} translations={translations} />
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
							<p className='mb-3 text-gray-600 text-sm dark:text-gray-400'>
								{t(translations.userLanguageDescription)}
							</p>
							<UserLanguageSelector />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

interface SettingsSummaryInlineProps {
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

function SettingsSummaryInline({t, translations}: SettingsSummaryInlineProps) {
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
			{t(translations.hintLanguage)}
			{t(translations['ui.colon'])} {getLanguageFlag(userLanguage)}
		</span>
	)
}
