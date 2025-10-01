import {motion} from 'framer-motion'
import {useId, useState} from 'react'
import {cn, useLayout} from '@/shared/lib'
import {MobileMenu, MobileMenuButton} from '../mobile-menu'
import {HeaderLogo} from './HeaderLogo'
import {HeaderNavigation} from './HeaderNavigation'
import {HeaderSettings} from './HeaderSettings'

interface HeaderProps {
	className?: string
}

export function Header({className}: HeaderProps) {
	const {headerEnabled} = useLayout()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const mobileMenuId = useId()

	return (
		<motion.header
			animate={{
				opacity: headerEnabled ? 1 : 0,
				y: headerEnabled ? 0 : -20
			}}
			className={cn(
				'fixed top-0 z-50 w-full border-gray-200 border-b bg-white/70 shadow-md backdrop-blur-md dark:border-gray-700 dark:bg-gray-800',
				headerEnabled ? 'block' : 'hidden',
				className
			)}
			initial={{opacity: 0, y: -20}}
		>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 items-center justify-between'>
					<HeaderLogo />
					<HeaderNavigation />
					<HeaderSettings />
					<MobileMenuButton
						isOpen={isMobileMenuOpen}
						menuId={mobileMenuId}
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					/>
				</div>
				<MobileMenu
					id={mobileMenuId}
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
				/>
			</div>
		</motion.header>
	)
}
