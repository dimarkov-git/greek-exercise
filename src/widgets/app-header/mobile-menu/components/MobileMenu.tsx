import {AnimatePresence, motion} from 'framer-motion'
import {Link, useLocation} from 'react-router'
import {cn} from '@/shared/lib'
import {loadTranslations} from '@/shared/lib/i18n'
import {LanguageDropdown} from '@/shared/ui/language-dropdown'
import {ThemeToggle} from '@/shared/ui/theme-toggle'
import {mobileMenuTranslations} from './translations'

const HOME_ICON = '🏠'
const LIBRARY_ICON = '📚'
const BUILDER_ICON = '🔧'

const createNavigationItems = (
	t: ReturnType<typeof loadTranslations<typeof mobileMenuTranslations>>['t']
) => [
	{
		path: '/',
		label: t(mobileMenuTranslations.home),
		icon: <span className='text-base'>{HOME_ICON}</span>
	},
	{
		path: '/exercises',
		label: t(mobileMenuTranslations.library),
		icon: <span className='text-base'>{LIBRARY_ICON}</span>
	},
	{
		path: '/builder',
		label: t(mobileMenuTranslations.builder),
		icon: <span className='text-base'>{BUILDER_ICON}</span>
	}
]

interface MobileMenuProps {
	readonly id: string
	readonly isOpen: boolean
	readonly onClose: () => void
}

export function MobileMenu({id, isOpen, onClose}: MobileMenuProps) {
	const {t} = loadTranslations(mobileMenuTranslations)
	const location = useLocation()

	const isActive = (path: string) => {
		if (path === '/' && location.pathname === '/') {
			return true
		}

		return path !== '/' && location.pathname.startsWith(path)
	}

	const navigationItems = createNavigationItems(t)

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop overlay for better mobile UX */}
					<motion.div
						animate={{opacity: 1}}
						className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden'
						exit={{opacity: 0}}
						initial={{opacity: 0}}
						onClick={onClose}
						transition={{duration: 0.2}}
					/>
					<motion.div
						animate={{opacity: 1, height: 'auto'}}
						className='relative z-50 border-[var(--color-border)] border-t bg-[var(--color-surface-overlay)] backdrop-blur-md md:hidden'
						data-testid='mobile-menu'
						exit={{opacity: 0, height: 0}}
						id={id}
						initial={{opacity: 0, height: 0}}
						transition={{duration: 0.2}}
					>
						<div className='space-y-1 py-3'>
							{navigationItems.map(item => (
								<Link
									className={cn(
										'flex items-center gap-3 rounded-lg px-3 py-3 font-medium text-sm transition-colors',
										isActive(item.path)
											? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
											: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-overlay)] hover:text-[var(--color-text-primary)]'
									)}
									key={item.path}
									onClick={onClose}
									to={item.path}
								>
									{item.icon}
									{item.label}
								</Link>
							))}

							<div className='border-[var(--color-border)] border-t pt-3'>
								<div className='flex items-center justify-between px-3 py-2'>
									<span className='font-medium text-[var(--color-text-secondary)] text-sm'>
										{t(mobileMenuTranslations.settings)}
									</span>
									<div className='flex items-center gap-2'>
										<ThemeToggle />
										<LanguageDropdown />
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
