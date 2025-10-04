import {motion} from 'framer-motion'
import {Link} from 'react-router'

interface NavigationCardProps {
	title: string
	description: string
	icon: string
	to: string
	color?: 'blue' | 'purple' | 'green' | 'orange'
}

const colorClasses = {
	blue: {
		bg: 'from-blue-400 to-blue-600',
		border: 'border-blue-200 dark:border-blue-800',
		hover: 'hover:border-blue-300 dark:hover:border-blue-700'
	},
	purple: {
		bg: 'from-purple-400 to-purple-600',
		border: 'border-purple-200 dark:border-purple-800',
		hover: 'hover:border-purple-300 dark:hover:border-purple-700'
	},
	green: {
		bg: 'from-green-400 to-green-600',
		border: 'border-green-200 dark:border-green-800',
		hover: 'hover:border-green-300 dark:hover:border-green-700'
	},
	orange: {
		bg: 'from-orange-400 to-orange-600',
		border: 'border-orange-200 dark:border-orange-800',
		hover: 'hover:border-orange-300 dark:hover:border-orange-700'
	}
}

export function NavigationCard({
	title,
	description,
	icon,
	to,
	color = 'blue'
}: NavigationCardProps) {
	const colors = colorClasses[color]

	// Create test ID from the route path
	const testId = `nav-card-${to.replace('/', '')}`

	return (
		<Link className='block' data-testid={testId} to={to}>
			<motion.div
				animate={{opacity: 1, y: 0}}
				className='group relative cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700'
				initial={{opacity: 0, y: 20}}
				whileHover={{
					scale: 1.01
				}}
				whileTap={{scale: 0.99}}
			>
				{/* Content */}
				<div className='p-8'>
					<div className='mb-4 flex items-center gap-4'>
						<div
							className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-2xl shadow-sm`}
						>
							{icon}
						</div>
						<h2 className='font-bold text-gray-900 text-xl group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-200'>
							{title}
						</h2>
					</div>

					<p className='text-gray-600 leading-relaxed group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'>
						{description}
					</p>

					{/* Arrow indicator */}
					<motion.div
						className='absolute top-4 right-4 text-gray-400 transition-colors duration-200 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400'
						transition={{type: 'spring', stiffness: 400, damping: 20}}
						whileHover={{x: 5}}
					>
						<svg
							aria-hidden='true'
							className='h-6 w-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								d='M9 5l7 7-7 7'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
							/>
						</svg>
					</motion.div>
				</div>
			</motion.div>
		</Link>
	)
}
