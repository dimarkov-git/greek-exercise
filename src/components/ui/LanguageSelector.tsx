import {zodResolver} from '@hookform/resolvers/zod'
import {motion} from 'framer-motion'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {useTranslations} from '@/hooks/useTranslations'
import {useSettingsStore} from '@/stores/settings'
import type {Language} from '@/types/settings'
import {UI_LANGUAGES} from '@/types/settings'
import type {TranslationRequest} from '@/types/translations'

const LANGUAGE_SELECTOR_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'interfaceLanguage',
		fallback: 'Interface language'
	}
]

const LanguageSchema = z.object({
	uiLanguage: z.enum(['el', 'ru', 'en'])
})

export function LanguageSelector() {
	const {uiLanguage, setUiLanguage} = useSettingsStore()
	const {t} = useTranslations(LANGUAGE_SELECTOR_TRANSLATIONS)

	const {setValue} = useForm({
		resolver: zodResolver(LanguageSchema),
		defaultValues: {uiLanguage}
	})

	const onLanguageChange = (language: Language) => {
		setValue('uiLanguage', language)
		setUiLanguage(language)
	}

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='space-y-2'
			initial={{opacity: 0, y: 20}}
		>
			<div className='block font-medium text-gray-700 text-sm dark:text-gray-300'>
				{t('interfaceLanguage')}
			</div>
			<div className='flex gap-1.5'>
				{UI_LANGUAGES.map(language => (
					<motion.button
						className={`flex items-center rounded-md border px-3 py-1.5 text-sm transition-all${
							uiLanguage === language.code
								? 'border-blue-500 bg-blue-500 text-white shadow-sm'
								: 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-600'
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
