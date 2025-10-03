/**
 * Flashcard rating component
 *
 * Displays simplified rating buttons for SM-2 algorithm (desktop only).
 */

import type {QualityRating} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {flashcardRatingTranslations} from '../translations'

interface FlashcardRatingProps {
	onRate: (quality: QualityRating) => void
	disabled?: boolean
}

interface RatingConfig {
	quality: QualityRating
	label: string
	color: string
	hoverColor: string
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
			ariaLabel: "Mark as don't know"
		},
		{
			quality: 4,
			label: t('flashcard.know'),
			color: 'bg-green-600',
			hoverColor: 'hover:bg-green-700',
			ariaLabel: 'Mark as know'
		}
	]
}

/**
 * Rating buttons for flashcard quality assessment (desktop only)
 *
 * Provides 2 simplified quality levels mapped to SM-2 ratings:
 * - Don't Know (2): Still learning, shorter interval
 * - Know (4): Mastered, longer interval
 *
 * Hidden on mobile - mobile users swipe the card instead.
 */
export function FlashcardRating({
	onRate,
	disabled = false
}: FlashcardRatingProps) {
	const {t} = loadTranslations(flashcardRatingTranslations)
	const ratings = getRatingConfigs(t)

	return (
		<div className='mt-8 hidden w-full max-w-2xl md:block'>
			<p className='mb-4 text-center text-gray-700 text-sm dark:text-gray-300'>
				{t('flashcard.rateQuality')}
			</p>

			<div className='grid grid-cols-2 gap-4'>
				{ratings.map(({quality, label, color, hoverColor, ariaLabel}) => (
					<button
						aria-label={ariaLabel}
						className={`rounded-lg px-6 py-4 font-medium text-white text-xl transition-colors ${color} ${hoverColor} disabled:cursor-not-allowed disabled:opacity-50`}
						disabled={disabled}
						key={quality}
						onClick={() => onRate(quality)}
						type='button'
					>
						{label}
					</button>
				))}
			</div>
		</div>
	)
}
