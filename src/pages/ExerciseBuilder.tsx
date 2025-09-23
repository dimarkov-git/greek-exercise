import {motion} from 'framer-motion'
import {Link} from 'react-router'
import {Head} from '@/components/Head'
import {useTranslations} from '@/hooks/useTranslations'
import {exerciseBuilderTranslations} from '@/i18n/dictionaries'

export function ExerciseBuilder() {
	const {t} = useTranslations(exerciseBuilderTranslations)

	return (
		<>
			<Head title={t('exerciseBuilder')} />
			<motion.div
				animate={{opacity: 1}}
				className='min-h-screen bg-gray-50 p-4 dark:bg-gray-900'
				initial={{opacity: 0}}
			>
				<div className='mx-auto max-w-4xl'>
					<motion.div
						animate={{opacity: 1, y: 0}}
						className='py-16 text-center'
						initial={{opacity: 0, y: 20}}
					>
						<div className='mb-8 text-6xl'>{t('ui.toolsEmoji')}</div>
						<h1 className='mb-4 font-bold text-4xl text-gray-900 dark:text-white'>
							{t('exerciseBuilder')}
						</h1>
						<p className='mb-8 text-gray-600 text-xl dark:text-gray-400'>
							{t('exerciseBuilderDesc')}
						</p>
						<p className='mb-8 text-gray-500 text-lg dark:text-gray-500'>
							{t('comingSoon')}
						</p>
						<Link
							className='inline-flex items-center gap-2 rounded-lg bg-purple-500 px-6 py-3 text-white transition-colors hover:bg-purple-600'
							to='/'
						>
							{t('ui.backToHome')}
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</>
	)
}
