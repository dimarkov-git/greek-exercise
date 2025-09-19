import {motion} from 'framer-motion'

interface TextSkeletonProps {
	width?: string
	height?: string
	className?: string
}

export function TextSkeleton({
	width = '100px',
	height = '1em',
	className = ''
}: TextSkeletonProps) {
	return (
		<motion.div
			animate={{
				opacity: [0.3, 0.8, 0.3]
			}}
			className={`rounded bg-gray-200 dark:bg-gray-700 ${className}`}
			initial={{opacity: 0.3}}
			style={{width, height}}
			transition={{
				duration: 1.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: 'easeInOut'
			}}
		/>
	)
}
