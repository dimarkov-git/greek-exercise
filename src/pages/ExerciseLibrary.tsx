import {motion} from 'framer-motion'
import {Link} from 'react-router'
import {Head} from '@/components/Head'
import {useI18n} from '@/hooks/useI18n'

export function ExerciseLibrary() {
	const {t} = useI18n()

	return (
		<>
			<Head title={t('exerciseLibrary')} />
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
						<div className='mb-8 text-6xl'>📚</div>
						<h1 className='mb-4 font-bold text-4xl text-gray-900 dark:text-white'>
							{t('exerciseLibrary')}
						</h1>
						<p className='mb-8 text-gray-600 text-xl dark:text-gray-400'>
							{t('exerciseLibraryDesc')}
						</p>
						<p className='mb-8 text-gray-500 text-lg dark:text-gray-500'>
							Coming soon... 🚧
						</p>
						<Link
							className='inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600'
							to='/'
						>
							← Back to Home
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</>
	)
}
