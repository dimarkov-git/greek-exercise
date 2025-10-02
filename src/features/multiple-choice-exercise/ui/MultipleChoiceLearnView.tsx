/**
 * Multiple-choice exercise learn view (stub)
 *
 * This is a placeholder for the multiple-choice learn view.
 * Full implementation coming in Phase 7.3.
 */

import type {ExerciseLearnViewProps} from '@/entities/exercise'

/**
 * Multiple-choice exercise learn view component (stub)
 *
 * @param props - Exercise learn view props
 * @returns Stub message
 */
export function MultipleChoiceLearnView({exercise}: ExerciseLearnViewProps) {
	return (
		<div className='rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800'>
			<div className='mb-4 text-6xl'>📝</div>
			<h3 className='mb-4 font-semibold text-gray-900 text-xl dark:text-white'>
				Multiple Choice Learn View
			</h3>
			<p className='mb-6 text-gray-600 dark:text-gray-400'>
				Learn view for <strong>{exercise.title}</strong> coming in Phase 7.3
			</p>
			<p className='text-gray-500 text-sm dark:text-gray-500'>
				Will display all questions with options, correct answers, and
				explanations
			</p>
		</div>
	)
}
