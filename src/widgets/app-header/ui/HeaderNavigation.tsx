import {motion} from 'framer-motion'
import {Link, useLocation} from 'react-router'
import {headerNavigationTranslations, useTranslations} from '@/shared/lib/i18n'
import {TranslatedText} from '@/shared/ui/translated-text'

const homeKey = 'navigation.home'
const libraryKey = 'navigation.library'
const builderKey = 'navigation.builder'

export function HeaderNavigation() {
	const {t, isLoading} = useTranslations(headerNavigationTranslations)
	const location = useLocation()

	const isActive = (path: string) => {
		if (path === '/' && location.pathname === '/') return true
		return path !== '/' && location.pathname.startsWith(path)
	}

	const navigationItems = [
		{
			path: '/',
			label: t(homeKey),
			icon: '🏠'
		},
		{
			path: '/exercises',
			label: t(libraryKey),
			icon: '📚'
		},
		{
			path: '/builder',
			label: t(builderKey),
			icon: '🔧'
		}
	]

	return (
		<motion.nav
			animate={{opacity: 1}}
			className='hidden items-center space-x-1 md:flex'
			initial={{opacity: 0}}
			transition={{delay: 0.2}}
		>
			{navigationItems.map((item, index) => (
				<motion.div
					animate={{opacity: 1, y: 0}}
					initial={{opacity: 0, y: -10}}
					key={item.path}
					transition={{delay: 0.2 + index * 0.1}}
				>
					<Link
						className={`flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
							isActive(item.path)
								? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
								: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
						}`}
						to={item.path}
					>
						<span className='p-0.5'>{item.icon}</span>
						<TranslatedText
							isLoading={isLoading}
							skeletonWidth='60px'
							text={item.label}
						/>
					</Link>
				</motion.div>
			))}
		</motion.nav>
	)
}
