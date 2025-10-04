/**
 * Flashcard view component with flip animation
 *
 * Displays a card with front/back content and 3D flip animation.
 * Supports swipe gestures on mobile for rating cards.
 */

import {motion} from 'framer-motion'
import {useState} from 'react'
import type {FlashCard, QualityRating} from '@/entities/exercise'
import {HintSystem} from '@/shared/ui/hint-system'

interface FlashcardViewProps {
	card: FlashCard
	isFlipped: boolean
	onFlip: () => void
	onRate?: (quality: QualityRating) => void
}

interface CardContentProps {
	text: string
	hintI18n?: Partial<Record<string, string>>
	className: string
}

/**
 * Render card content with optional hints
 */
function CardContent({text, hintI18n, className}: CardContentProps) {
	if (hintI18n) {
		return (
			<HintSystem className={className} hints={hintI18n} primaryText={text} />
		)
	}
	return <p className={className}>{text}</p>
}

/**
 * Use swipe gesture handler
 */
function useSwipeGesture(
	isFlipped: boolean,
	onRate?: (quality: QualityRating) => void
) {
	const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
		null
	)

	const handleDragEnd = (
		_event: MouseEvent | TouchEvent | PointerEvent,
		info: {offset: {x: number; y: number}; velocity: {x: number}}
	) => {
		// Only allow swipe when card is flipped and onRate is provided
		if (!(isFlipped && onRate)) return

		const swipeThreshold = 100
		const velocityThreshold = 500

		if (
			info.offset.x < -swipeThreshold ||
			info.velocity.x < -velocityThreshold
		) {
			setSwipeDirection('left')
			setTimeout(() => {
				onRate(2) // Don't know
				setSwipeDirection(null)
			}, 200)
		} else if (
			info.offset.x > swipeThreshold ||
			info.velocity.x > velocityThreshold
		) {
			setSwipeDirection('right')
			setTimeout(() => {
				onRate(4) // Know
				setSwipeDirection(null)
			}, 200)
		}
	}

	return {swipeDirection, handleDragEnd}
}

/**
 * Get instruction text based on card state
 */
function getInstructionText(isFlipped: boolean, hasOnRate: boolean) {
	if (!isFlipped) return 'Click to flip'
	if (!hasOnRate) return 'Click to flip back'
	return 'Click to flip back or swipe to rate'
}

/**
 * Flashcard view with 3D flip animation and swipe support
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Complex UI component with animations
export function FlashcardView({
	card,
	isFlipped,
	onFlip,
	onRate
}: FlashcardViewProps) {
	const {swipeDirection, handleDragEnd} = useSwipeGesture(isFlipped, onRate)

	const handleClick = (e: React.MouseEvent) => {
		// Prevent flip if swiping
		if (swipeDirection) {
			e.stopPropagation()
			return
		}
		onFlip()
	}

	return (
		<div className='perspective-1000 w-full max-w-2xl'>
			<motion.div
				animate={{rotateY: isFlipped ? 180 : 0}}
				className='relative h-96 w-full cursor-pointer'
				drag={isFlipped ? 'x' : false}
				dragConstraints={{left: 0, right: 0}}
				dragElastic={0.7}
				onClick={handleClick}
				onDragEnd={handleDragEnd}
				style={{transformStyle: 'preserve-3d'}}
				transition={{duration: 0.6, ease: 'easeInOut'}}
			>
				{/* Front of card */}
				<div
					className='absolute inset-0 flex items-center justify-center rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'
					style={{backfaceVisibility: 'hidden'}}
				>
					<div className='text-center'>
						<CardContent
							className='font-bold text-3xl text-gray-900 dark:text-white'
							{...(card.frontHintI18n && {hintI18n: card.frontHintI18n})}
							text={card.front}
						/>
					</div>
				</div>

				{/* Back of card */}
				<div
					className='absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-50 p-8 shadow-xl dark:bg-blue-900/20'
					style={{
						backfaceVisibility: 'hidden',
						transform: 'rotateY(180deg)'
					}}
				>
					<div className='text-center'>
						<CardContent
							className='font-semibold text-2xl text-gray-900 dark:text-white'
							{...(card.backHintI18n && {hintI18n: card.backHintI18n})}
							text={card.back}
						/>

						{card.additionalHint && (
							<div className='mt-4 text-gray-600 text-sm dark:text-gray-400'>
								{card.additionalHintI18n ? (
									<HintSystem
										className='italic'
										hints={card.additionalHintI18n}
										primaryText={card.additionalHint}
									/>
								) : (
									<span className='italic'>{card.additionalHint}</span>
								)}
							</div>
						)}
					</div>
				</div>
			</motion.div>

			{/* Swipe indicator on mobile when flipped */}
			{isFlipped && onRate && swipeDirection && (
				<div className='mt-2 text-center font-medium text-sm md:hidden'>
					{swipeDirection === 'left' ? (
						<span className='text-orange-600'>← Don't Know</span>
					) : (
						<span className='text-green-600'>Know →</span>
					)}
				</div>
			)}

			<p className='mt-4 text-center text-gray-500 text-sm dark:text-gray-400'>
				{getInstructionText(isFlipped, Boolean(onRate))}
			</p>
		</div>
	)
}
