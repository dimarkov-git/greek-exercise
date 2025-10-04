/**
 * Flashcard completion screen
 *
 * Shows review session statistics and next steps.
 */

import {motion} from 'framer-motion'
import {loadTranslations} from '@/shared/lib/i18n'
import {flashcardCompletionTranslations} from '../translations'

interface CompletionScreenProps {
	exerciseTitle: string
	reviewedCards: number
	correctCards: number
	totalCards: number
	averageQuality: number
	onRestart: () => void
	onExit?: (() => void) | undefined
}

/**
 * Completion screen with review statistics
 */
export function CompletionScreen({
	exerciseTitle,
	reviewedCards,
	correctCards,
	totalCards,
	averageQuality,
	onRestart,
	onExit
}: CompletionScreenProps) {
	const {t} = loadTranslations(flashcardCompletionTranslations)

	const accuracy =
		reviewedCards > 0 ? Math.round((correctCards / reviewedCards) * 100) : 0

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
			<motion.div
				animate={{opacity: 1, scale: 1}}
				className='w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'
				initial={{opacity: 0, scale: 0.9}}
				transition={{duration: 0.3}}
			>
				{/* Success icon */}
				<div className='mb-6 text-center'>
					<div className='mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20'>
						<span className='text-5xl'>✓</span>
					</div>
				</div>

				{/* Title */}
				<h2 className='mb-2 text-center font-bold text-2xl text-gray-900 dark:text-white'>
					{t('flashcard.reviewComplete')}
				</h2>
				<p className='mb-8 text-center text-gray-600 dark:text-gray-400'>
					{exerciseTitle}
				</p>

				{/* Statistics */}
				<div className='mb-8 space-y-4'>
					<div className='flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
						<span className='text-gray-700 dark:text-gray-300'>
							{t('flashcard.reviewedCards')}
						</span>
						<span className='font-bold text-gray-900 text-xl dark:text-white'>
							{reviewedCards} / {totalCards}
						</span>
					</div>

					<div className='flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
						<span className='text-gray-700 dark:text-gray-300'>
							{t('flashcard.accuracy')}
						</span>
						<span className='font-bold text-gray-900 text-xl dark:text-white'>
							{accuracy}%
						</span>
					</div>

					<div className='flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
						<span className='text-gray-700 dark:text-gray-300'>
							{t('flashcard.averageQuality')}
						</span>
						<span className='font-bold text-gray-900 text-xl dark:text-white'>
							{averageQuality.toFixed(1)} / 5
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className='space-y-3'>
					<button
						className='w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
						onClick={onRestart}
						type='button'
					>
						{t('flashcard.reviewAgain')}
					</button>

					{onExit && (
						<button
							className='w-full rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
							onClick={onExit}
							type='button'
						>
							{t('common.backToLibrary')}
						</button>
					)}
				</div>
			</motion.div>
		</div>
	)
}
