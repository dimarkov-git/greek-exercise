import {motion} from 'framer-motion'
import {Link} from 'react-router'
import {useI18n} from '@/hooks/useI18n'

export function HeaderLogo() {
	const {t} = useI18n()

	return (
		<motion.div
			animate={{opacity: 1, x: 0}}
			className='flex items-center'
			initial={{opacity: 0, x: -20}}
			transition={{delay: 0.1}}
		>
			<Link className='flex items-center gap-3' to='/'>
				<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white'>
					<span className='font-bold text-sm'>ΕΛ</span>
				</div>
				<span className='hidden font-semibold text-gray-900 text-lg sm:block dark:text-white'>
					{t('appTitle')}
				</span>
			</Link>
		</motion.div>
	)
}
