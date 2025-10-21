/**
 * Flashcard rating component
 *
 * Displays simplified rating buttons for SM-2 algorithm (desktop only).
 * Includes visual effects (ripple and glow) for button interactions.
 */

import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import type {QualityRating} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {flashcardRatingTranslations} from '../translations'

interface FlashcardRatingProps {
	onRate: (quality: QualityRating) => void
	disabled?: boolean
	onEffectTrigger?: (effect: 'know' | 'dontKnow') => void
}

interface RatingConfig {
	quality: QualityRating
	label: string
	color: string
	hoverColor: string
	glowColor: string
	effectType: 'dontKnow' | 'know'
	ariaLabel: string
}

/**
 * Get rating button configurations
 */
function getRatingConfigs(
	t: (entry: keyof typeof flashcardRatingTranslations) => string
): [RatingConfig, RatingConfig] {
	return [
		{
			quality: 2,
			label: t('flashcard.dontKnow'),
			color: 'bg-orange-600',
			hoverColor: 'hover:bg-orange-700',
			glowColor: 'rgba(249, 115, 22, 0.6)', // orange-500
			effectType: 'dontKnow',
			ariaLabel: "Mark as don't know"
		},
		{
			quality: 4,
			label: t('flashcard.know'),
			color: 'bg-green-600',
			hoverColor: 'hover:bg-green-700',
			glowColor: 'rgba(34, 197, 94, 0.6)', // green-500
			effectType: 'know',
			ariaLabel: 'Mark as know'
		}
	]
}

/**
 * Button effects component - ripple and glow effects
 */
function ButtonEffects({
	isActive,
	glowColor,
	ripplePosition
}: {
	isActive: boolean
	glowColor: string
	ripplePosition: {x: number; y: number} | null
}) {
	if (!isActive) return null

	return (
		<>
			{/* Glow effect */}
			<motion.div
				animate={{
					opacity: [0, 0.8, 0],
					scale: [0.9, 1.1, 1]
				}}
				className='pointer-events-none absolute inset-0 rounded-lg'
				initial={{opacity: 0}}
				style={{
					boxShadow: `0 0 20px 8px ${glowColor}`
				}}
				transition={{duration: 0.4, ease: 'easeOut'}}
			/>

			{/* Ripple effect */}
			{ripplePosition && (
				<motion.div
					animate={{
						scale: [0, 4],
						opacity: [1, 0]
					}}
					className='pointer-events-none absolute rounded-full'
					initial={{scale: 0, opacity: 1}}
					style={{
						left: ripplePosition.x,
						top: ripplePosition.y,
						width: 20,
						height: 20,
						backgroundColor: 'rgba(255, 255, 255, 0.5)',
						transform: 'translate(-50%, -50%)'
					}}
					transition={{duration: 0.6, ease: 'easeOut'}}
				/>
			)}
		</>
	)
}

/**
 * Rating buttons for flashcard quality assessment (desktop only)
 *
 * Provides 2 simplified quality levels mapped to SM-2 ratings:
 * - Don't Know (2): Still learning, shorter interval
 * - Know (4): Mastered, longer interval
 *
 * Hidden on mobile - mobile users swipe the card instead.
 * Includes ripple and glow effects on button click.
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Main rating component with effects and layout
export function FlashcardRating({
	onRate,
	disabled = false,
	onEffectTrigger
}: FlashcardRatingProps) {
	const {t} = loadTranslations(flashcardRatingTranslations)
	const ratings = getRatingConfigs(t)
	const [activeButton, setActiveButton] = useState<QualityRating | null>(null)
	const [ripplePosition, setRipplePosition] = useState<{
		x: number
		y: number
	} | null>(null)

	const handleButtonClick = (
		quality: QualityRating,
		effectType: 'know' | 'dontKnow',
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		if (disabled) return

		// Calculate ripple position relative to button
		const rect = event.currentTarget.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		setRipplePosition({x, y})
		setActiveButton(quality)
		onEffectTrigger?.(effectType)

		// Trigger rating after effect animation
		setTimeout(() => {
			onRate(quality)
			setActiveButton(null)
			setRipplePosition(null)
		}, 400)
	}

	return (
		<div className='mt-8 hidden w-full max-w-2xl md:block'>
			<p className='mb-4 text-center text-gray-700 text-sm dark:text-gray-300'>
				{t('flashcard.rateQuality')}
			</p>

			<div className='grid grid-cols-2 gap-4'>
				{ratings.map(
					({
						quality,
						label,
						color,
						hoverColor,
						glowColor,
						effectType,
						ariaLabel
					}) => (
						<motion.button
							animate={{
								scale: activeButton === quality ? 0.95 : 1
							}}
							aria-label={ariaLabel}
							className={`relative cursor-pointer overflow-hidden rounded-lg px-6 py-4 font-medium text-white text-xl transition-colors ${color} ${hoverColor} disabled:cursor-not-allowed disabled:opacity-50`}
							disabled={disabled || activeButton !== null}
							key={quality}
							onClick={e => handleButtonClick(quality, effectType, e)}
							transition={{duration: 0.2}}
							type='button'
						>
							<span className='relative z-10'>{label}</span>
							<AnimatePresence>
								<ButtonEffects
									glowColor={glowColor}
									isActive={activeButton === quality}
									ripplePosition={ripplePosition}
								/>
							</AnimatePresence>
						</motion.button>
					)
				)}
			</div>
		</div>
	)
}
