import {AnimatePresence, motion} from 'framer-motion'
import type {ElementType, ReactNode} from 'react'
import {useEffect, useState} from 'react'
import {TextSkeleton} from './TextSkeleton'

interface TranslatedTextProps {
	text: string
	isLoading?: boolean
	skeletonWidth?: string
	skeletonHeight?: string
	className?: string
	as?: ElementType
	children?: ReactNode
	minAnimationMs?: number
}

export function TranslatedText({
	text,
	isLoading = false,
	skeletonWidth,
	skeletonHeight,
	className = '',
	as: Component = 'span',
	children,
	minAnimationMs = 300
}: TranslatedTextProps) {
	const [showSkeleton, setShowSkeleton] = useState(isLoading)
	const [hasShownContent, setHasShownContent] = useState(!isLoading)

	useEffect(() => {
		if (isLoading) {
			setShowSkeleton(true)
			setHasShownContent(false)
			return
		}

		if (hasShownContent) {
			setShowSkeleton(false)
			return
		}

		const timer = setTimeout(() => {
			setShowSkeleton(false)
			setHasShownContent(true)
		}, minAnimationMs)

		return () => clearTimeout(timer)
	}, [isLoading, hasShownContent, minAnimationMs])

	// Reset hasShownContent when text changes to force animation
	useEffect(() => {
		if (!isLoading) {
			setHasShownContent(false)
		}
	}, [isLoading])

	return (
		<AnimatePresence mode='wait'>
			{showSkeleton ? (
				<motion.div
					animate={{opacity: 1}}
					exit={{opacity: 0}}
					initial={{opacity: 0}}
					key='skeleton'
					transition={{duration: 0.15}}
				>
					<TextSkeleton
						className={className}
						height={skeletonHeight ?? '1em'}
						width={skeletonWidth ?? '100px'}
					/>
				</motion.div>
			) : (
				<motion.div
					animate={{opacity: 1, y: 0}}
					exit={{opacity: 0, y: -5}}
					initial={{opacity: 0, y: 5}}
					key='text'
					transition={{duration: 0.2, ease: 'easeOut'}}
				>
					<Component className={className}>{children || text}</Component>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
