import {motion} from 'framer-motion'
import {useState} from 'react'
import {useLocation} from 'react-router'
import {HeaderLogo} from './HeaderLogo'
import {HeaderNavigation} from './HeaderNavigation'
import {HeaderSettings} from './HeaderSettings'
import {MobileMenu} from './MobileMenu'
import {MobileMenuButton} from './MobileMenuButton'

interface HeaderProps {
	className?: string
}

export function Header({className}: HeaderProps) {
	const location = useLocation()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	// Hide header on exercise pages
	const isExercisePage = location.pathname.startsWith('/exercise/')
	if (isExercisePage) {
		return null
	}

	return (
		<motion.header
			animate={{opacity: 1, y: 0}}
			className={`fixed top-0 z-50 w-full border-gray-200 border-b bg-white/70 shadow-md backdrop-blur-md dark:border-gray-700 dark:bg-gray-800 ${
				className || ''
			}`}
			initial={{opacity: 0, y: -20}}
		>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 items-center justify-between'>
					<HeaderLogo />
					<HeaderNavigation />
					<HeaderSettings />
					<MobileMenuButton
						isOpen={isMobileMenuOpen}
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					/>
				</div>
				<MobileMenu
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
				/>
			</div>
		</motion.header>
	)
}
