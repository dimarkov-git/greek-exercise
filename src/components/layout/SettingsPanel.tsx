import {motion} from 'framer-motion'
import {LanguageSelector} from '@/components/ui/LanguageSelector'
import {ThemeToggle} from '@/components/ui/ThemeToggle'
import {UserLanguageSelector} from '@/components/ui/UserLanguageSelector'
import {useTranslations} from '@/hooks/useTranslations'
import type {TranslationRequest} from '@/types/translations'

const SETTINGS_PANEL_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'settings',
		fallback: 'Settings'
	}
]

export function SettingsPanel() {
	const {t} = useTranslations(SETTINGS_PANEL_TRANSLATIONS)

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900'
			initial={{opacity: 0, y: -20}}
		>
			<motion.div
				animate={{opacity: 1}}
				className='mb-4 flex items-center justify-between'
				initial={{opacity: 0}}
				transition={{delay: 0.1}}
			>
				<h2 className='font-semibold text-gray-900 text-lg dark:text-white'>
					{t('settings')}
				</h2>
				<ThemeToggle />
			</motion.div>

			<div className='space-y-4'>
				<LanguageSelector />
				<UserLanguageSelector />
			</div>
		</motion.div>
	)
}
