import {motion} from 'framer-motion'
import {useI18n} from '@/hooks/useI18n'
import {useSettingsStore} from '@/stores/settings'

export function ThemeToggle() {
	const {theme, setTheme} = useSettingsStore()
	const {t} = useI18n()

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	return (
		<motion.button
			animate={{opacity: 1, scale: 1}}
			className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition-all hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
			initial={{opacity: 0, scale: 0.9}}
			onClick={toggleTheme}
			title={theme === 'light' ? t('lightTheme') : t('darkTheme')}
			transition={{delay: 0.2}}
			whileHover={{scale: 1.05}}
			whileTap={{scale: 0.95}}
		>
			<span className='text-base'>{theme === 'light' ? '☀️' : '🌙'}</span>
			<motion.div
				className={`relative h-4 w-8 rounded-full transition-colors ${
					theme === 'light' ? 'bg-gray-200' : 'bg-blue-600'
				}`}
			>
				<motion.div
					animate={{
						x: theme === 'light' ? 1 : 15
					}}
					className='absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm'
					transition={{type: 'spring', stiffness: 500, damping: 30}}
				/>
			</motion.div>
		</motion.button>
	)
}
