import {motion} from 'framer-motion'
import {NavigationCard} from '@/components/ui/NavigationCard'
import {useI18n} from '@/hooks/useI18n'

export function MainNavigation() {
	const {t} = useI18n()

	return (
		<motion.div
			animate={{opacity: 1}}
			className='grid gap-6 md:grid-cols-2'
			initial={{opacity: 0}}
			transition={{delay: 0.3}}
		>
			<motion.div
				animate={{opacity: 1, x: 0}}
				initial={{opacity: 0, x: -50}}
				transition={{delay: 0.4}}
			>
				<NavigationCard
					color='blue'
					description={t('exerciseLibraryDesc')}
					icon='📚'
					title={t('exerciseLibrary')}
					to='/exercises'
				/>
			</motion.div>

			<motion.div
				animate={{opacity: 1, x: 0}}
				initial={{opacity: 0, x: 50}}
				transition={{delay: 0.5}}
			>
				<NavigationCard
					color='purple'
					description={t('exerciseBuilderDesc')}
					icon='🔧'
					title={t('exerciseBuilder')}
					to='/builder'
				/>
			</motion.div>
		</motion.div>
	)
}
