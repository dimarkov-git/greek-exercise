/**
 * Flashcard exercise renderer (stub)
 *
 * This is a placeholder for the flashcard exercise renderer.
 * Full implementation coming in Phase 7.2.
 */

import type {ExerciseRendererProps} from '@/entities/exercise'

/**
 * Flashcard exercise renderer component (stub)
 *
 * @param props - Exercise renderer props
 * @returns Stub message
 */
export function FlashcardRenderer({exercise, onExit}: ExerciseRendererProps) {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
			<div className='max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800'>
				<div className='mb-4 text-6xl'>🎴</div>
				<h2 className='mb-4 font-semibold text-2xl text-gray-900 dark:text-white'>
					Flashcard Exercise
				</h2>
				<p className='mb-2 text-gray-600 dark:text-gray-400'>
					<strong>{exercise.title}</strong>
				</p>
				<p className='mb-6 text-gray-500 text-sm dark:text-gray-500'>
					Coming in Phase 7.2: Spaced Repetition System (SRS) with SM-2
					algorithm
				</p>
				<button
					className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
					onClick={onExit}
					type='button'
				>
					Back to Library
				</button>
			</div>
		</div>
	)
}
