import {motion} from 'framer-motion'
import {NavigationCard} from '@/components/ui/NavigationCard'
import {useTranslations} from '@/hooks/useTranslations'
import type {TranslationRequest} from '@/types/translations'

const MAIN_NAVIGATION_TRANSLATIONS: TranslationRequest[] = [
	{
		key: 'exerciseLibrary',
		fallback: 'Exercise Library'
	},
	{
		key: 'exerciseLibraryDesc',
		fallback: 'Browse and execute available exercises'
	},
	{
		key: 'exerciseBuilder',
		fallback: 'Exercise Builder'
	},
	{
		key: 'exerciseBuilderDesc',
		fallback: 'Create your own exercises'
	}
]

export function MainNavigation() {
	const {t} = useTranslations(MAIN_NAVIGATION_TRANSLATIONS)

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
