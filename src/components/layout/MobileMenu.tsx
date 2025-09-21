import {AnimatePresence, motion} from 'framer-motion'
import {Link, useLocation} from 'react-router'
import {LanguageDropdown} from '@/components/ui/LanguageDropdown'
import {ThemeToggle} from '@/components/ui/ThemeToggle'
import {useTranslations} from '@/hooks/useTranslations'
import type {TranslationRequest} from '@/types/translations'

const MOBILE_MENU_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'navigation.home',
		fallback: 'Home'
	},
	{
		key: 'navigation.library',
		fallback: 'Library'
	},
	{
		key: 'navigation.builder',
		fallback: 'Builder'
	},
	{
		key: 'settings',
		fallback: 'Settings'
	}
]

const HOME_ICON = '🏠'
const LIBRARY_ICON = '📚'
const BUILDER_ICON = '🔧'

const createNavigationItems = (t: (key: string) => string) => [
	{
		path: '/',
		label: t('navigation.home'),
		icon: <span className='text-base'>{HOME_ICON}</span>
	},
	{
		path: '/exercises',
		label: t('navigation.library'),
		icon: <span className='text-base'>{LIBRARY_ICON}</span>
	},
	{
		path: '/builder',
		label: t('navigation.builder'),
		icon: <span className='text-base'>{BUILDER_ICON}</span>
	}
]

interface MobileMenuProps {
	isOpen: boolean
	onClose: () => void
}

export function MobileMenu({isOpen, onClose}: MobileMenuProps) {
	const {t} = useTranslations(MOBILE_MENU_TRANSLATIONS)
	const location = useLocation()

	const isActive = (path: string) => {
		if (path === '/' && location.pathname === '/') return true
		return path !== '/' && location.pathname.startsWith(path)
	}

	const navigationItems = createNavigationItems(t)

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					animate={{opacity: 1, height: 'auto'}}
					className='border-gray-200 border-t md:hidden dark:border-gray-700'
					data-testid='mobile-menu'
					exit={{opacity: 0, height: 0}}
					initial={{opacity: 0, height: 0}}
					transition={{duration: 0.2}}
				>
					<div className='space-y-1 py-3'>
						{navigationItems.map(item => (
							<Link
								className={`flex items-center gap-3 rounded-lg px-3 py-3 font-medium text-sm transition-colors ${
									isActive(item.path)
										? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
										: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
								}`}
								key={item.path}
								onClick={onClose}
								to={item.path}
							>
								{item.icon}
								{item.label}
							</Link>
						))}

						{/* Mobile Settings */}
						<div className='border-gray-200 border-t pt-3 dark:border-gray-700'>
							<div className='flex items-center justify-between px-3 py-2'>
								<span className='font-medium text-gray-700 text-sm dark:text-gray-300'>
									{t('settings')}
								</span>
								<div className='flex items-center gap-2'>
									<ThemeToggle />
									<LanguageDropdown />
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
