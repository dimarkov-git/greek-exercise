import {motion} from 'framer-motion'
import {Link, useLocation} from 'react-router'
import {useI18n} from '@/hooks/useI18n'

export function HeaderNavigation() {
	const {t} = useI18n()
	const location = useLocation()

	const isActive = (path: string) => {
		if (path === '/' && location.pathname === '/') return true
		return path !== '/' && location.pathname.startsWith(path)
	}

	const navigationItems = [
		{
			path: '/',
			label: t('navigation.home'),
			icon: (
				<svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
					<title>Home icon</title>
					<path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
				</svg>
			)
		},
		{
			path: '/exercises',
			label: t('navigation.library'),
			icon: (
				<svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
					<title>Library icon</title>
					<path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
				</svg>
			)
		},
		{
			path: '/builder',
			label: t('navigation.builder'),
			icon: (
				<svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
					<title>Builder icon</title>
					<path
						clipRule='evenodd'
						d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
						fillRule='evenodd'
					/>
				</svg>
			)
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
						{item.icon}
						{item.label}
					</Link>
				</motion.div>
			))}
		</motion.nav>
	)
}
