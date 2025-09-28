import {motion} from 'framer-motion'
import {cn} from '@/shared/lib'

interface TextSkeletonProps {
	width?: string
	height?: string
	className?: string
}

export function TextSkeleton({
	width = '100px',
	height = '1em',
	className
}: TextSkeletonProps) {
	return (
		<motion.span
			animate={{
				opacity: [0.3, 0.8, 0.3]
			}}
			aria-hidden='true'
			className={cn(
				'inline-block rounded bg-gray-200 dark:bg-gray-700',
				className
			)}
			initial={{opacity: 0.3}}
			role='presentation'
			style={{width, height}}
			transition={{
				duration: 1.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: 'easeInOut'
			}}
		/>
	)
}
