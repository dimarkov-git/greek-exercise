import {AnimatePresence, motion} from 'framer-motion'
import type {ElementType, ReactNode} from 'react'
import {useEffect, useMemo, useState} from 'react'
import {TextSkeleton} from '../text-skeleton'

function useTranslatedTextSkeletonVisibility(
	isLoading: boolean,
	minAnimationMs: number
) {
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

	useEffect(() => {
		if (!isLoading) {
			setHasShownContent(false)
		}
	}, [isLoading])

	return showSkeleton
}

interface TranslatedSkeletonProps {
	content: ReactNode
	height: string
	width: string
}

function TranslatedSkeleton({content, height, width}: TranslatedSkeletonProps) {
	return (
		<motion.span
			animate={{opacity: 1}}
			exit={{opacity: 0}}
			initial={{opacity: 0}}
			key='skeleton'
			transition={{duration: 0.15}}
		>
			<TextSkeleton height={height} width={width} />
			<span className='sr-only'>{content}</span>
		</motion.span>
	)
}

function TranslatedContent({children}: {children: ReactNode}) {
	return (
		<motion.span
			animate={{opacity: 1, y: 0}}
			exit={{opacity: 0, y: -5}}
			initial={{opacity: 0, y: 5}}
			key='text'
			transition={{duration: 0.2, ease: 'easeOut'}}
		>
			{children}
		</motion.span>
	)
}

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
	const showSkeleton = useTranslatedTextSkeletonVisibility(
		isLoading,
		minAnimationMs
	)
	const content = useMemo(() => children || text, [children, text])

	return (
		<Component
			aria-busy={showSkeleton}
			className={className}
			data-variant='translated-text'
		>
			<AnimatePresence mode='wait'>
				{showSkeleton ? (
					<TranslatedSkeleton
						content={content}
						height={skeletonHeight ?? '1em'}
						width={skeletonWidth ?? '100px'}
					/>
				) : (
					<TranslatedContent>{content}</TranslatedContent>
				)}
			</AnimatePresence>
		</Component>
	)
}
