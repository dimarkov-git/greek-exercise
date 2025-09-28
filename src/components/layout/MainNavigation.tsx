import {motion} from 'framer-motion'
import {useTranslations} from '@/hooks/useTranslations'
import {mainNavigationTranslations} from '@/shared/lib/i18n/dictionaries'
import {NavigationCard} from '@/shared/ui/navigation-card'

export function MainNavigation() {
	const {t} = useTranslations(mainNavigationTranslations)

	return (
		<motion.div
			animate={{opacity: 1}}
			className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'
			initial={{opacity: 0}}
			transition={{delay: 0.3}}
		>
			<div className='grid md:grid-cols-2'>
				<motion.div
					animate={{opacity: 1, x: 0}}
					className='border-gray-200 border-b md:border-r md:border-b-0 dark:border-gray-700'
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
			</div>
		</motion.div>
	)
}
