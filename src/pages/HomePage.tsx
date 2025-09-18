import {motion} from 'framer-motion'
import {Head} from '@/components/Head'
import {MainNavigation} from '@/components/layout/MainNavigation'
import {useI18n} from '@/hooks/useI18n'

export function HomePage() {
	const {t} = useI18n()

	return (
		<>
			<Head title={t('appTitle')} />
			<div className='bg-gray-50 transition-colors dark:bg-gray-900'>
				{/* Hero Section */}
				<div className='px-4 py-16'>
					<div className='mx-auto max-w-6xl'>
						<motion.div
							animate={{opacity: 1, y: 0}}
							className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 px-8 py-16 text-center md:px-16 md:py-24'
							initial={{opacity: 0, y: -20}}
						>
							{/* Background decoration */}
							<div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent)]' />

							{/* Content */}
							<div className='relative'>
								<motion.h1
									animate={{opacity: 1}}
									className='mb-6 font-bold text-4xl text-white md:text-6xl'
									initial={{opacity: 0}}
									transition={{delay: 0.3}}
								>
									{t('appTitle')}
								</motion.h1>

								<motion.p
									animate={{opacity: 1}}
									className='mx-auto max-w-2xl text-slate-300 text-xl leading-relaxed'
									initial={{opacity: 0}}
									transition={{delay: 0.4}}
								>
									{t('appSubtitle')}
								</motion.p>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Navigation Cards Section */}
				<div className='px-4 pb-16'>
					<div className='mx-auto max-w-6xl'>
						<motion.div
							animate={{opacity: 1, y: 0}}
							initial={{opacity: 0, y: 20}}
							transition={{delay: 0.5}}
						>
							<MainNavigation />
						</motion.div>
					</div>
				</div>
			</div>
		</>
	)
}
