import {motion} from 'framer-motion'
import {useI18n} from '@/hooks/useI18n'
import {useSettingsStore} from '@/stores/settings'
import type {Language} from '@/types/settings'
import {USER_LANGUAGES} from '@/types/settings'

export function UserLanguageSelector() {
	const {userLanguage, setUserLanguage} = useSettingsStore()
	const {t} = useI18n()

	const onLanguageChange = (language: Language) => {
		setUserLanguage(language)
	}

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='space-y-2'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.1}}
		>
			<div className='block font-medium text-gray-700 text-sm dark:text-gray-300'>
				{t('userLanguageLabel')}
			</div>
			<div className='flex gap-1.5'>
				{USER_LANGUAGES.map(language => (
					<motion.button
						className={`flex items-center rounded-md border px-3 py-1.5 text-sm transition-all${
							userLanguage === language.code
								? 'border-green-500 bg-green-500 text-white shadow-sm'
								: 'border-gray-300 bg-white text-gray-700 hover:border-green-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-green-600'
						}
						`}
						key={language.code}
						onClick={() => onLanguageChange(language.code)}
						title={language.name}
						whileHover={{scale: 1.02}}
						whileTap={{scale: 0.98}}
					>
						<span className='text-base'>{language.flag}</span>
					</motion.button>
				))}
			</div>
		</motion.div>
	)
}
