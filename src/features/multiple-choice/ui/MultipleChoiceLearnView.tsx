/**
 * Multiple-choice exercise learn view
 *
 * Displays all questions and answers in table or JSON format for learning/review.
 */

import type {ExerciseLearnViewProps} from '@/entities/exercise'
import {useSettingsStore} from '@/shared/model'
import type {MultipleChoiceExercise} from '../model/types'

/**
 * Table view of multiple-choice questions
 */
function TableView({exercise}: {exercise: MultipleChoiceExercise}) {
	const userLanguage = useSettingsStore(state => state.userLanguage)

	return (
		<div className='space-y-6'>
			{exercise.questions.map((question, qIndex) => {
				const questionText = question.textI18n?.[userLanguage] ?? question.text
				const correctOption = question.options.find(
					opt => opt.id === question.correctOptionId
				)
				const correctText = correctOption
					? (correctOption.textI18n?.[userLanguage] ?? correctOption.text)
					: 'N/A'
				const hintText = question.hint
					? (question.hintI18n?.[userLanguage] ?? question.hint)
					: null

				return (
					<div
						className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'
						key={question.id}
					>
						<div className='mb-4'>
							<span className='rounded bg-blue-100 px-2 py-1 font-medium text-blue-800 text-sm dark:bg-blue-900/50 dark:text-blue-300'>
								Question {qIndex + 1}
							</span>
						</div>

						<h3 className='mb-4 font-semibold text-gray-900 text-lg dark:text-white'>
							{questionText}
						</h3>

						{/* Options */}
						<div className='mb-4 space-y-2'>
							<p className='mb-2 font-medium text-gray-700 text-sm dark:text-gray-300'>
								Options:
							</p>
							{question.options.map((option, oIndex) => {
								const optionText =
									option.textI18n?.[userLanguage] ?? option.text
								const isCorrect = option.id === question.correctOptionId

								return (
									<div
										className={`flex items-center gap-2 rounded p-2 ${
											isCorrect
												? 'bg-green-50 dark:bg-green-900/20'
												: 'bg-gray-50 dark:bg-gray-700'
										}`}
										key={option.id}
									>
										<span className='font-medium text-gray-600 dark:text-gray-400'>
											{oIndex + 1}.
										</span>
										<span
											className={
												isCorrect
													? 'text-green-900 dark:text-green-100'
													: 'text-gray-900 dark:text-white'
											}
										>
											{optionText}
										</span>
										{isCorrect && (
											<span className='ml-auto text-green-600 dark:text-green-400'>
												✓ Correct
											</span>
										)}
									</div>
								)
							})}
						</div>

						{/* Correct Answer */}
						<div className='rounded-lg border-2 border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20'>
							<p className='font-medium text-green-800 text-sm dark:text-green-300'>
								<span className='text-green-600 dark:text-green-400'>✓</span>{' '}
								Correct answer: {correctText}
							</p>
						</div>

						{/* Hint */}
						{hintText && (
							<div className='mt-3 rounded-lg border-2 border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20'>
								<p className='text-blue-800 text-sm dark:text-blue-300'>
									💡 {hintText}
								</p>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

/**
 * JSON view of exercise data
 */
function JsonView({exercise}: {exercise: MultipleChoiceExercise}) {
	return (
		<div className='rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900'>
			<pre className='overflow-x-auto text-gray-800 text-sm dark:text-gray-300'>
				<code>{JSON.stringify(exercise, null, 2)}</code>
			</pre>
		</div>
	)
}

/**
 * Multiple-choice exercise learn view component
 *
 * @param props - Exercise learn view props
 * @returns Learn view with table or JSON display
 */
export function MultipleChoiceLearnView({
	exercise,
	viewMode
}: ExerciseLearnViewProps<MultipleChoiceExercise>) {
	if (viewMode === 'json') {
		return <JsonView exercise={exercise} />
	}

	return <TableView exercise={exercise} />
}
