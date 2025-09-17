import {motion} from 'framer-motion'
import {Head} from '@/components/Head'
import {MainNavigation} from '@/components/layout/MainNavigation'
import {SettingsPanel} from '@/components/layout/SettingsPanel'
import {useI18n} from '@/hooks/useI18n'

export function HomePage() {
	const {t} = useI18n()

	return (
		<>
			<Head title={t('appTitle')} />
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 transition-colors dark:from-gray-900 dark:to-gray-800'>
				<div className='mx-auto max-w-7xl p-4 py-8'>
					{/* Header */}
					<motion.header
						animate={{opacity: 1, y: 0}}
						className='mb-12 text-center'
						initial={{opacity: 0, y: -20}}
					>
						<motion.h1
							animate={{opacity: 1}}
							className='mb-4 font-bold text-4xl text-gray-900 md:text-6xl dark:text-white'
							initial={{opacity: 0}}
							transition={{delay: 0.3}}
						>
							{t('appTitle')}
						</motion.h1>

						<motion.p
							animate={{opacity: 1}}
							className='mx-auto max-w-2xl text-gray-600 text-xl dark:text-gray-300'
							initial={{opacity: 0}}
							transition={{delay: 0.4}}
						>
							{t('appSubtitle')}
						</motion.p>
					</motion.header>

					{/* Main Content Grid */}
					<div className='grid gap-8 lg:grid-cols-3'>
						{/* Settings Panel */}
						<motion.div
							animate={{opacity: 1, x: 0}}
							className='lg:col-span-1'
							initial={{opacity: 0, x: -50}}
							transition={{delay: 0.5}}
						>
							<SettingsPanel />
						</motion.div>

						{/* Navigation Cards */}
						<motion.div
							animate={{opacity: 1, x: 0}}
							className='lg:col-span-2'
							initial={{opacity: 0, x: 50}}
							transition={{delay: 0.6}}
						>
							<MainNavigation />
						</motion.div>
					</div>
				</div>
			</div>
		</>
	)
}
