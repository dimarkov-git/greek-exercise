import {motion} from 'framer-motion'
import {LanguageDropdown} from '@/shared/ui/language-dropdown'
import {ThemeToggle} from '@/shared/ui/theme-toggle'

export function HeaderSettings() {
	return (
		<motion.div
			animate={{opacity: 1, x: 0}}
			className='hidden items-center gap-2 md:flex'
			initial={{opacity: 0, x: 20}}
			transition={{delay: 0.3}}
		>
			<ThemeToggle />
			<LanguageDropdown />
		</motion.div>
	)
}
