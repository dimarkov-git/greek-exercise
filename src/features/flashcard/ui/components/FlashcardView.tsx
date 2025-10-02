/**
 * Flashcard view component with flip animation
 *
 * Displays a card with front/back content and 3D flip animation.
 */

import {motion} from 'framer-motion'
import type {FlashCard} from '@/entities/exercise'
import {HintSystem} from '@/shared/ui/hint-system'

interface FlashcardViewProps {
	card: FlashCard
	isFlipped: boolean
	onFlip: () => void
}

/**
 * Flashcard view with 3D flip animation
 */
export function FlashcardView({card, isFlipped, onFlip}: FlashcardViewProps) {
	return (
		<div className='perspective-1000 w-full max-w-2xl'>
			<motion.div
				animate={{rotateY: isFlipped ? 180 : 0}}
				className='relative h-96 w-full cursor-pointer'
				onClick={onFlip}
				style={{transformStyle: 'preserve-3d'}}
				transition={{duration: 0.6, ease: 'easeInOut'}}
			>
				{/* Front of card */}
				<div
					className='absolute inset-0 flex items-center justify-center rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'
					style={{backfaceVisibility: 'hidden'}}
				>
					<div className='text-center'>
						{card.frontHintI18n ? (
							<HintSystem
								className='font-bold text-3xl text-gray-900 dark:text-white'
								hints={card.frontHintI18n}
								primaryText={card.front}
							/>
						) : (
							<p className='font-bold text-3xl text-gray-900 dark:text-white'>
								{card.front}
							</p>
						)}
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
						{card.backHintI18n ? (
							<HintSystem
								className='font-semibold text-2xl text-gray-900 dark:text-white'
								hints={card.backHintI18n}
								primaryText={card.back}
							/>
						) : (
							<p className='font-semibold text-2xl text-gray-900 dark:text-white'>
								{card.back}
							</p>
						)}

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

			<p className='mt-4 text-center text-gray-500 text-sm dark:text-gray-400'>
				{isFlipped ? 'Click to flip back' : 'Click to flip'}
			</p>
		</div>
	)
}
