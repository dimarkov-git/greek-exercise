/**
 * Multiple-choice question component
 *
 * Displays the question text with i18n support.
 */

import type {Language} from '@/shared/model'
import {useSettingsStore} from '@/shared/model'
import type {MultipleChoiceQuestion} from '../../model/types'

interface MultipleChoiceQuestionProps {
	question: MultipleChoiceQuestion
}

/**
 * Get localized question text
 */
function getQuestionText(
	question: MultipleChoiceQuestion,
	language: Language
): string {
	return question.textI18n?.[language] ?? question.text
}

export function MultipleChoiceQuestionComponent({
	question
}: MultipleChoiceQuestionProps) {
	const userLanguage = useSettingsStore(s => s.userLanguage)
	const questionText = getQuestionText(question, userLanguage)

	return (
		<div className='mb-8'>
			<h2 className='font-semibold text-gray-900 text-xl leading-relaxed dark:text-white'>
				{questionText}
			</h2>
		</div>
	)
}
