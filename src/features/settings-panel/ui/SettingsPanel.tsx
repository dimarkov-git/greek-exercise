import {motion} from 'framer-motion'
import {settingsLabelTranslations, useTranslations} from '@/shared/lib/i18n'
import {LanguageSelector} from '@/shared/ui/language-selector'
import {ThemeToggle} from '@/shared/ui/theme-toggle'
import {UserLanguageSelector} from '@/shared/ui/user-language-selector'

export function SettingsPanel() {
	const {t} = useTranslations(settingsLabelTranslations)

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
