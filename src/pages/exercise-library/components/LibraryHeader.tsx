import {motion} from 'framer-motion'
import type {ExerciseLibraryTranslationKey} from '@/shared/lib/i18n/dictionaries'
import type {Translator} from '@/shared/lib/i18n/dictionary'

type LibraryTranslator = Translator<ExerciseLibraryTranslationKey>

interface LibraryHeaderProps {
	t: LibraryTranslator
}

export function LibraryHeader({t}: LibraryHeaderProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-12 text-center'
			initial={{opacity: 0, y: 20}}
		>
			<h1 className='mb-4 font-bold text-4xl text-gray-900 dark:text-white'>
				{t('exerciseLibrary')}
			</h1>
			<p className='text-gray-600 text-xl dark:text-gray-400'>
				{t('exerciseLibraryDesc')}
			</p>
		</motion.div>
	)
}
