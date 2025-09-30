import {motion} from 'framer-motion'
import type {exerciseLibraryTranslations} from '../translations'

interface LibraryHeaderProps {
	t: (
		entry: (typeof exerciseLibraryTranslations)[keyof typeof exerciseLibraryTranslations]
	) => string
	translations: typeof exerciseLibraryTranslations
}

export function LibraryHeader({t, translations}: LibraryHeaderProps) {
	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-12 text-center'
			initial={{opacity: 0, y: 20}}
		>
			<h1 className='mb-4 font-bold text-4xl text-gray-900 dark:text-white'>
				{t(translations.exerciseLibrary)}
			</h1>
			<p className='text-gray-600 text-xl dark:text-gray-400'>
				{t(translations.exerciseLibraryDesc)}
			</p>
		</motion.div>
	)
}
