/**
 * Multiple-choice feedback component
 *
 * Shows feedback after answering (correct/incorrect).
 */

import {loadTranslations} from '@/shared/lib/i18n'
import {multipleChoiceTranslations} from './translations'

interface MultipleChoiceFeedbackProps {
	isCorrect: boolean
}

export function MultipleChoiceFeedback({
	isCorrect
}: MultipleChoiceFeedbackProps) {
	const {t} = loadTranslations(multipleChoiceTranslations)

	if (isCorrect) {
		return (
			<output
				aria-live='polite'
				className='flex items-center gap-3 rounded-lg border-2 border-green-500 bg-green-50 p-4 dark:bg-green-900/20'
			>
				<span className='text-2xl text-green-600 dark:text-green-400'>✓</span>
				<span className='font-medium text-green-800 dark:text-green-300'>
					{t(multipleChoiceTranslations['multipleChoice.correct'])}
				</span>
			</output>
		)
	}

	return (
		<output
			aria-live='polite'
			className='flex items-center gap-3 rounded-lg border-2 border-red-500 bg-red-50 p-4 dark:bg-red-900/20'
		>
			<span className='text-2xl text-red-600 dark:text-red-400'>✗</span>
			<span className='font-medium text-red-800 dark:text-red-300'>
				{t(multipleChoiceTranslations['multipleChoice.incorrect'])}
			</span>
		</output>
	)
}
