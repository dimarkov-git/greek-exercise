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
	},
	{
		key: 'navigation.homeIcon',
		fallback: 'Home icon'
	},
	{
		key: 'navigation.libraryIcon',
		fallback: 'Library icon'
	},
	{
		key: 'navigation.builderIcon',
		fallback: 'Builder icon'
	}
]

const createNavigationItems = (t: (key: string) => string) => [
	{
		path: '/',
		label: t('navigation.home'),
		icon: (
			<svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
				<title>{t('navigation.homeIcon')}</title>
				<path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
			</svg>
		)
	},
	{
		path: '/exercises',
		label: t('navigation.library'),
		icon: (
			<svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
				<title>{t('navigation.libraryIcon')}</title>
				<path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
			</svg>
		)
	},
	{
		path: '/builder',
		label: t('navigation.builder'),
		icon: (
			<svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
				<title>{t('navigation.builderIcon')}</title>
				<path
					clipRule='evenodd'
					d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
					fillRule='evenodd'
				/>
			</svg>
		)
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
