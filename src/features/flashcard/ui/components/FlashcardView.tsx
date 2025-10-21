/**
 * Flashcard view component with flip animation
 *
 * Displays a card with front/back content and 3D flip animation.
 * Supports swipe gestures on mobile for rating cards.
 * Includes visual effects for swipe and rating interactions.
 */

import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import type {FlashCard, QualityRating} from '@/entities/exercise'
import {useSettingsStore} from '@/shared/model'

type EffectType = 'know' | 'dontKnow' | null

interface FlashcardViewProps {
	card: FlashCard
	isFlipped: boolean
	onFlip: () => void
	onRate?: (quality: QualityRating) => void
	onEffectTrigger?: (effect: 'know' | 'dontKnow') => void
	externalEffectType?: EffectType
}

/**
 * Edge hints component - shows swipe direction hints with dynamic intensity
 * Adapts opacity and intensity based on theme for better visibility
 */
function EdgeHints({
	isVisible,
	dragOffset
}: {
	isVisible: boolean
	dragOffset: number
}) {
	if (!isVisible) return null

	// Calculate intensity based on drag offset (0 to 1)
	const leftIntensity = Math.min(Math.abs(Math.min(dragOffset, 0)) / 100, 1)
	const rightIntensity = Math.min(Math.max(dragOffset, 0) / 100, 1)

	return (
		<>
			{/* Left edge hint - Don't Know (Orange) */}
			<motion.div
				className='pointer-events-none fixed inset-y-0 left-0 z-10 w-16'
				style={{
					background:
						'linear-gradient(to right, rgba(249, 115, 22, 0.5), transparent)',
					opacity: leftIntensity > 0.1 ? 0.5 + leftIntensity * 0.5 : 0.5,
					animation:
						leftIntensity > 0.1 ? 'none' : 'breathing 2s ease-in-out infinite'
				}}
				transition={{duration: 0.1}}
			/>

			{/* Right edge hint - Know (Green) */}
			<motion.div
				className='pointer-events-none fixed inset-y-0 right-0 z-10 w-16'
				style={{
					background:
						'linear-gradient(to left, rgba(34, 197, 94, 0.5), transparent)',
					opacity: rightIntensity > 0.1 ? 0.5 + rightIntensity * 0.5 : 0.5,
					animation:
						rightIntensity > 0.1
							? 'none'
							: 'breathing-opposite 2s ease-in-out infinite'
				}}
				transition={{duration: 0.1}}
			/>
		</>
	)
}

/**
 * Card drag overlay - progressively fills the entire card with color during swipe
 */
function DragOverlay({dragOffset}: {dragOffset: number}) {
	if (dragOffset === 0) return null

	const isLeft = dragOffset < 0
	const intensity = Math.min(Math.abs(dragOffset) / 120, 1) // Max at 120px for quicker feedback

	// Choose color based on direction with increasing opacity
	// Orange for "Don't Know" (left), Green for "Know" (right)
	const backgroundColor = isLeft
		? `rgba(249, 115, 22, ${intensity * 0.3})` // orange, max 0.3 opacity
		: `rgba(34, 197, 94, ${intensity * 0.3})` // green, max 0.3 opacity

	return (
		<div
			className='pointer-events-none absolute inset-0 z-5 rounded-2xl'
			style={{
				backgroundColor,
				transition: 'background-color 0.05s ease-out'
			}}
		/>
	)
}

/**
 * Card effects component - visual feedback for ratings
 */
function CardEffects({activeEffect}: {activeEffect: EffectType}) {
	if (!activeEffect) return null

	const isKnow = activeEffect === 'know'
	const color = isKnow ? 'rgb(34, 197, 94)' : 'rgb(249, 115, 22)' // green-500 : orange-500

	return (
		<>
			{/* Glow border effect */}
			<motion.div
				animate={{
					opacity: [0, 1, 0],
					scale: [0.95, 1.02, 1]
				}}
				className='pointer-events-none absolute inset-0 z-20 rounded-2xl'
				initial={{opacity: 0}}
				style={{
					boxShadow: `0 0 30px 5px ${color}`
				}}
				transition={{duration: 0.4, ease: 'easeOut'}}
			/>

			{/* Radial gradient overlay */}
			<motion.div
				animate={{
					opacity: [0, 0.6, 0],
					scale: [0.9, 1, 1]
				}}
				className='pointer-events-none absolute inset-0 z-10 rounded-2xl'
				initial={{opacity: 0}}
				style={{
					background: isKnow
						? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)'
						: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.3) 0%, transparent 70%)'
				}}
				transition={{duration: 0.3, ease: 'easeOut'}}
			/>
		</>
	)
}

/**
 * Use swipe gesture handler with effects
 */
function useSwipeGesture(
	isFlipped: boolean,
	onRate?: (quality: QualityRating) => void,
	onEffectTrigger?: (effect: 'know' | 'dontKnow') => void
) {
	const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
		null
	)
	const [activeEffect, setActiveEffect] = useState<EffectType>(null)

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
			setActiveEffect('dontKnow')
			onEffectTrigger?.('dontKnow')
			setTimeout(() => {
				onRate(2) // Don't know
				setSwipeDirection(null)
				setActiveEffect(null)
			}, 400)
		} else if (
			info.offset.x > swipeThreshold ||
			info.velocity.x > velocityThreshold
		) {
			setSwipeDirection('right')
			setActiveEffect('know')
			onEffectTrigger?.('know')
			setTimeout(() => {
				onRate(4) // Know
				setSwipeDirection(null)
				setActiveEffect(null)
			}, 400)
		}
	}

	return {swipeDirection, activeEffect, handleDragEnd}
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
 * Calculate rotation angle based on effect type
 */
function getRotateZ(effect: EffectType): number {
	if (effect === 'know') return 2
	if (effect === 'dontKnow') return -2
	return 0
}

/**
 * Flashcard view with 3D flip animation, swipe support, and visual effects
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Main view component with multiple UI states
export function FlashcardView({
	card,
	isFlipped,
	onFlip,
	onRate,
	onEffectTrigger,
	externalEffectType
}: FlashcardViewProps) {
	const userLanguage = useSettingsStore(s => s.userLanguage)
	const [dragOffset, setDragOffset] = useState(0)

	const {swipeDirection, activeEffect, handleDragEnd} = useSwipeGesture(
		isFlipped,
		onRate,
		onEffectTrigger
	)

	const handleClick = (e: React.MouseEvent) => {
		// Prevent flip if swiping or effect is active
		if (swipeDirection || activeEffect || externalEffectType) {
			e.stopPropagation()
			return
		}
		onFlip()
	}

	const handleDrag = (
		_event: MouseEvent | TouchEvent | PointerEvent,
		info: {offset: {x: number; y: number}}
	) => {
		// Update drag offset for dynamic effects
		setDragOffset(info.offset.x)
	}

	const handleDragEndWithReset = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: {offset: {x: number; y: number}; velocity: {x: number}}
	) => {
		// Reset drag offset
		setDragOffset(0)
		// Call original handler
		handleDragEnd(event, info)
	}

	const currentEffect: EffectType = activeEffect || externalEffectType || null

	return (
		<>
			{/* Edge hints for swipe direction */}
			<AnimatePresence>
				<EdgeHints
					dragOffset={dragOffset}
					isVisible={isFlipped && Boolean(onRate)}
				/>
			</AnimatePresence>

			<div className='perspective-1000 relative w-full max-w-2xl'>
				<motion.div
					animate={{
						rotateY: isFlipped ? 180 : 0,
						scale: currentEffect ? 1.02 : 1,
						rotateZ: getRotateZ(currentEffect)
					}}
					className='relative h-96 w-full cursor-pointer'
					drag={isFlipped && !currentEffect ? 'x' : false}
					dragConstraints={{left: 0, right: 0}}
					dragElastic={0.7}
					onClick={handleClick}
					onDrag={handleDrag}
					onDragEnd={handleDragEndWithReset}
					style={{transformStyle: 'preserve-3d'}}
					transition={{duration: 0.6, ease: 'easeInOut'}}
				>
					{/* Drag overlay - shows gradient during swipe */}
					<DragOverlay dragOffset={dragOffset} />

					{/* Card effects overlay */}
					<CardEffects activeEffect={currentEffect} />

					{/* Front of card */}
					<div
						className='absolute inset-0 flex items-center justify-center rounded-2xl bg-white p-8 shadow-xl transition-all dark:bg-gray-800'
						style={{
							backfaceVisibility: 'hidden',
							filter: currentEffect ? 'brightness(1.1)' : 'brightness(1)'
						}}
					>
						<div className='text-center'>
							<p className='font-bold text-3xl text-gray-900 dark:text-white'>
								{card.front}
							</p>
						</div>
					</div>

					{/* Back of card */}
					<div
						className='absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-50 p-8 shadow-xl transition-all dark:bg-blue-900/20'
						style={{
							backfaceVisibility: 'hidden',
							transform: 'rotateY(180deg)',
							filter: currentEffect ? 'brightness(1.1)' : 'brightness(1)'
						}}
					>
						<div className='text-center'>
							<p className='font-semibold text-2xl text-gray-900 dark:text-white'>
								{card.backHintI18n[userLanguage] || card.backHintI18n.en || ''}
							</p>
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
		</>
	)
}
