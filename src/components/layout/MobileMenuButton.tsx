import {motion} from 'framer-motion'
import {useTranslations} from '@/hooks/useTranslations'
import type {TranslationRequest} from '@/types/translations'

const MOBILE_MENU_BUTTON_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'navigation.menu',
		fallback: 'Menu'
	},
	{
		key: 'navigation.close',
		fallback: 'Close'
	}
]

interface MobileMenuButtonProps {
	isOpen: boolean
	onClick: () => void
}

export function MobileMenuButton({isOpen, onClick}: MobileMenuButtonProps) {
	const {t} = useTranslations(MOBILE_MENU_BUTTON_TRANSLATIONS)

	return (
		<motion.button
			animate={{opacity: 1, scale: 1}}
			className='flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 md:hidden dark:border-gray-600 dark:bg-gray-800'
			initial={{opacity: 0, scale: 0.9}}
			onClick={onClick}
			transition={{delay: 0.3}}
			type='button'
			whileTap={{scale: 0.95}}
		>
			<svg
				className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-90' : ''}`}
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<title>{isOpen ? t('navigation.close') : t('navigation.menu')}</title>
				<path
					d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
				/>
			</svg>
		</motion.button>
	)
}
