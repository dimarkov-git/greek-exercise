import {motion} from 'framer-motion'
import {Link} from 'react-router'
import {TranslatedText} from '@/components/ui/TranslatedText'
import {useTranslations} from '@/hooks/useTranslations'
import type {TranslationRequest} from '@/types/translations'

const titleKey = 'app.title'

const HEADER_LOGO_TRANSLATIONS: TranslationRequest[] = [
	{
		key: titleKey
	}
]

export function HeaderLogo() {
	const {t, isLoading} = useTranslations(HEADER_LOGO_TRANSLATIONS)

	return (
		<motion.div
			animate={{opacity: 1, x: 0}}
			className='flex items-center'
			initial={{opacity: 0, x: -20}}
			transition={{delay: 0.1}}
		>
			<Link className='flex items-center gap-3' to='/'>
				<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white'>
					<span className='font-bold text-sm'>ΜΕ</span>
				</div>
				<TranslatedText
					as='span'
					className='hidden font-semibold text-gray-900 text-lg sm:block dark:text-white'
					isLoading={isLoading}
					skeletonWidth='120px'
					text={t(titleKey)}
				/>
			</Link>
		</motion.div>
	)
}
