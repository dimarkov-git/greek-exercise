import {motion} from 'framer-motion'
import {useTranslations} from '@/hooks/useTranslations'
import {themeToggleTranslations} from '@/i18n/dictionaries'
import {useSettingsStore} from '@/stores/settings'

export function ThemeToggle() {
	const {theme, setTheme} = useSettingsStore()
	const {t} = useTranslations(themeToggleTranslations)

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	return (
		<motion.button
			animate={{opacity: 1, scale: 1}}
			className='flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-sm transition-all hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]'
			data-current-theme={theme}
			data-testid='theme-toggle'
			initial={{opacity: 0, scale: 0.9}}
			onClick={toggleTheme}
			title={theme === 'light' ? t('darkTheme') : t('lightTheme')}
			transition={{delay: 0.2}}
			type='button'
			whileHover={{scale: 1.05}}
			whileTap={{scale: 0.95}}
		>
			<div className='relative flex h-5 w-5 items-center justify-center overflow-hidden'>
				<motion.span
					animate={{
						x: theme === 'light' ? 0 : -28,
						opacity: theme === 'light' ? 1 : 0
					}}
					className='absolute text-lg drop-shadow-sm'
					initial={false}
					style={{
						filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))'
					}}
					transition={{
						type: 'spring',
						stiffness: 120,
						damping: 25,
						mass: 0.8
					}}
				>
					{t('ui.sunEmoji')}
				</motion.span>
				<motion.span
					animate={{
						x: theme === 'light' ? 28 : 0,
						opacity: theme === 'light' ? 0 : 1
					}}
					className='absolute text-lg'
					initial={false}
					transition={{
						type: 'spring',
						stiffness: 120,
						damping: 25,
						mass: 0.8
					}}
				>
					{t('ui.moonEmoji')}
				</motion.span>
			</div>
		</motion.button>
	)
}
