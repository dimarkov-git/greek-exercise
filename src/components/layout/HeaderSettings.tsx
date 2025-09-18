import {motion} from 'framer-motion'
import {LanguageDropdown} from '@/components/ui/LanguageDropdown'
import {ThemeToggle} from '@/components/ui/ThemeToggle'

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
