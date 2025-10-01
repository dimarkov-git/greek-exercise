import {motion} from 'framer-motion'
import {shouldShowTestSection} from '@/shared/config'
import {loadTranslations} from '@/shared/lib/i18n'
import {NavigationCard} from '@/shared/ui/navigation-card'
import {translations} from './main-navigation-translations'

export function MainNavigation() {
	const {t} = loadTranslations(translations)

	const showTestSection = shouldShowTestSection()

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
						description={t(translations.exerciseLibraryDesc)}
						icon='📚'
						title={t(translations.exerciseLibrary)}
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
						description={t(translations.exerciseBuilderDesc)}
						icon='🔧'
						title={t(translations.exerciseBuilder)}
						to='/builder'
					/>
				</motion.div>
			</div>

			{showTestSection && (
				<div className='grid md:grid-cols-2'>
					<motion.div
						animate={{opacity: 1, x: 0}}
						initial={{opacity: 0, x: 50}}
						transition={{delay: 0.6}}
					>
						<NavigationCard
							color='orange'
							description={t(translations.testSectionDesc)}
							icon='🧪'
							title={t(translations.testSection)}
							to='/test/i18n'
						/>
					</motion.div>
				</div>
			)}
		</motion.div>
	)
}
