/**
 * Multiple-choice exercise renderer (stub)
 *
 * This is a placeholder for the multiple-choice exercise renderer.
 * Full implementation coming in Phase 7.3.
 */

import type {ExerciseRendererProps} from '@/entities/exercise'
import type {MultipleChoiceExercise} from '../model/types'

/**
 * Multiple-choice exercise renderer component (stub)
 *
 * @param props - Exercise renderer props
 * @returns Stub message
 */
export function MultipleChoiceRenderer({
	exercise,
	onExit
}: ExerciseRendererProps<MultipleChoiceExercise>) {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
			<div className='max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800'>
				<div className='mb-4 text-6xl'>📝</div>
				<h2 className='mb-4 font-semibold text-2xl text-gray-900 dark:text-white'>
					Multiple Choice Exercise
				</h2>
				<p className='mb-2 text-gray-600 dark:text-gray-400'>
					<strong>{exercise.title}</strong>
				</p>
				<p className='mb-6 text-gray-500 text-sm dark:text-gray-500'>
					Coming in Phase 7.3: Interactive multiple-choice questions with
					instant feedback
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
