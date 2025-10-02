/**
 * Flashcard rating component
 *
 * Displays quality rating buttons for SM-2 algorithm.
 */

import type {QualityRating} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {flashcardRatingTranslations} from '../translations'

interface FlashcardRatingProps {
	onRate: (quality: QualityRating) => void
	disabled?: boolean
}

/**
 * Rating buttons for flashcard quality assessment
 *
 * Provides 4 quality levels mapped to SM-2 ratings:
 * - Again (1): Incorrect, show again
 * - Hard (2): Correct but difficult
 * - Good (3): Correct with normal effort
 * - Easy (4): Correct with ease
 */
export function FlashcardRating({
	onRate,
	disabled = false
}: FlashcardRatingProps) {
	const {t} = loadTranslations(flashcardRatingTranslations)

	const ratings: Array<{
		quality: QualityRating
		label: string
		color: string
		hoverColor: string
	}> = [
		{
			quality: 1,
			label: t('flashcard.again'),
			color: 'bg-red-600',
			hoverColor: 'hover:bg-red-700'
		},
		{
			quality: 2,
			label: t('flashcard.hard'),
			color: 'bg-orange-600',
			hoverColor: 'hover:bg-orange-700'
		},
		{
			quality: 3,
			label: t('flashcard.good'),
			color: 'bg-green-600',
			hoverColor: 'hover:bg-green-700'
		},
		{
			quality: 4,
			label: t('flashcard.easy'),
			color: 'bg-blue-600',
			hoverColor: 'hover:bg-blue-700'
		}
	]

	return (
		<div className='mt-8 w-full max-w-2xl'>
			<p className='mb-4 text-center text-gray-700 dark:text-gray-300'>
				{t('flashcard.rateQuality')}
			</p>
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
				{ratings.map(({quality, label, color, hoverColor}) => (
					<button
						className={`rounded-lg px-4 py-3 font-medium text-white transition-colors ${color} ${hoverColor} disabled:cursor-not-allowed disabled:opacity-50`}
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
