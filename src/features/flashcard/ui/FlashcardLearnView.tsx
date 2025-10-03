/**
 * Flashcard exercise learn view
 *
 * Displays all flashcards in table or JSON format for learning/review.
 */

import {useState} from 'react'
import type {
	ExerciseLearnViewProps,
	FlashcardExercise
} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {useSettingsStore} from '@/shared/model'
import {flashcardStorage} from '../lib/flashcard-storage'
import {flashcardLearnViewTranslations} from './translations'

/**
 * Table view of flashcards
 */
function TableView({exercise}: {exercise: FlashcardExercise}) {
	const {t} = loadTranslations(flashcardLearnViewTranslations)
	const userLanguage = useSettingsStore(state => state.userLanguage)
	const [stats, setStats] = useState<{
		total: number
		new: number
		learning: number
		review: number
		dueToday: number
	} | null>(null)

	// Load SRS stats on mount
	useState(() => {
		flashcardStorage
			.getExerciseStats(exercise.id)
			.then(setStats)
			.catch(() => {
				// Silently ignore - stats won't be displayed
			})
	})

	return (
		<div className='space-y-6'>
			{/* SRS Statistics */}
			{stats && (
				<div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
					<h3 className='mb-4 font-semibold text-gray-900 text-lg dark:text-white'>
						{t('flashcard.srsStatistics')}
					</h3>
					<div className='grid grid-cols-2 gap-4 sm:grid-cols-5'>
						<div className='text-center'>
							<div className='font-bold text-2xl text-blue-600 dark:text-blue-400'>
								{stats.total}
							</div>
							<div className='text-gray-600 text-sm dark:text-gray-400'>
								{t('flashcard.total')}
							</div>
						</div>
						<div className='text-center'>
							<div className='font-bold text-2xl text-gray-600 dark:text-gray-400'>
								{stats.new}
							</div>
							<div className='text-gray-600 text-sm dark:text-gray-400'>
								{t('flashcard.new')}
							</div>
						</div>
						<div className='text-center'>
							<div className='font-bold text-2xl text-orange-600 dark:text-orange-400'>
								{stats.learning}
							</div>
							<div className='text-gray-600 text-sm dark:text-gray-400'>
								{t('flashcard.learning')}
							</div>
						</div>
						<div className='text-center'>
							<div className='font-bold text-2xl text-green-600 dark:text-green-400'>
								{stats.review}
							</div>
							<div className='text-gray-600 text-sm dark:text-gray-400'>
								{t('flashcard.review')}
							</div>
						</div>
						<div className='text-center'>
							<div className='font-bold text-2xl text-red-600 dark:text-red-400'>
								{stats.dueToday}
							</div>
							<div className='text-gray-600 text-sm dark:text-gray-400'>
								{t('flashcard.dueToday')}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Cards table */}
			<div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
				<table className='w-full'>
					<thead className='bg-gray-50 dark:bg-gray-800'>
						<tr>
							<th className='px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300'>
								#
							</th>
							<th className='px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300'>
								{t('flashcard.front')}
							</th>
							<th className='px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300'>
								{t('flashcard.back')}
							</th>
							<th className='px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300'>
								{t('flashcard.hint')}
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
						{exercise.cards.map((card, index) => (
							<tr key={card.id}>
								<td className='whitespace-nowrap px-6 py-4 text-gray-500 text-sm dark:text-gray-400'>
									{index + 1}
								</td>
								<td className='px-6 py-4'>
									<div className='font-medium text-gray-900 dark:text-white'>
										{card.front}
									</div>
									{card.frontHintI18n?.[userLanguage] && (
										<div className='text-gray-500 text-sm dark:text-gray-400'>
											{card.frontHintI18n[userLanguage]}
										</div>
									)}
								</td>
								<td className='px-6 py-4'>
									<div className='font-medium text-gray-900 dark:text-white'>
										{card.back}
									</div>
									{card.backHintI18n?.[userLanguage] && (
										<div className='text-gray-500 text-sm dark:text-gray-400'>
											{card.backHintI18n[userLanguage]}
										</div>
									)}
								</td>
								<td className='px-6 py-4 text-gray-500 text-sm dark:text-gray-400'>
									{card.additionalHint || '—'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

/**
 * JSON view of flashcard exercise
 */
function JsonView({exercise}: {exercise: FlashcardExercise}) {
	return (
		<div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
			<pre className='overflow-x-auto text-gray-800 text-sm dark:text-gray-200'>
				{JSON.stringify(exercise, null, 2)}
			</pre>
		</div>
	)
}

/**
 * Flashcard exercise learn view component
 */
export function FlashcardLearnView({
	exercise,
	viewMode
}: ExerciseLearnViewProps<FlashcardExercise>) {
	const {t} = loadTranslations(flashcardLearnViewTranslations)

	return (
		<div className='space-y-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='font-bold text-2xl text-gray-900 dark:text-white'>
						{exercise.title}
					</h2>
					<p className='text-gray-600 dark:text-gray-400'>
						{exercise.cards.length} {t('flashcard.cards')}
					</p>
				</div>
			</div>

			{/* View content */}
			{viewMode === 'table' ? (
				<TableView exercise={exercise} />
			) : (
				<JsonView exercise={exercise} />
			)}
		</div>
	)
}
