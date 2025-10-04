/**
 * Multiple-choice options component
 *
 * Displays answer options as radio buttons with keyboard support.
 */

import {useEffect} from 'react'
import type {Language} from '@/shared/model'
import {useSettingsStore} from '@/shared/model'
import type {
	MultipleChoiceOption,
	MultipleChoiceQuestion
} from '../../model/types'

interface MultipleChoiceOptionsProps {
	question: MultipleChoiceQuestion
	selectedOptionId: string | null
	onSelectOption: (optionId: string) => void
	isCorrect: boolean | null
	disabled: boolean
}

/**
 * Get localized option text
 */
function getOptionText(
	option: MultipleChoiceOption,
	language: Language
): string {
	return option.textI18n?.[language] ?? option.text
}

/**
 * Get option styling based on state
 */
function getOptionClassName(
	isSelected: boolean,
	isCorrectOption: boolean,
	isAnswered: boolean,
	isCorrect: boolean | null
): string {
	const baseClasses =
		'flex items-center gap-4 rounded-lg border-2 p-4 transition-all cursor-pointer hover:shadow-md'

	if (isAnswered && isSelected) {
		if (isCorrect) {
			return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/20`
		}
		return `${baseClasses} border-red-500 bg-red-50 dark:bg-red-900/20`
	}

	if (isAnswered && isCorrectOption) {
		return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/20`
	}

	if (isSelected) {
		return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-900/20`
	}

	return `${baseClasses} border-gray-200 bg-white hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600`
}

function OptionIndicator({
	isAnswered,
	isCorrectOption,
	isSelected,
	isCorrect
}: {
	isAnswered: boolean
	isCorrectOption: boolean
	isSelected: boolean
	isCorrect: boolean | null
}) {
	if (isAnswered && isCorrectOption) {
		return (
			<span
				aria-hidden='true'
				className='text-green-600 text-xl dark:text-green-400'
			>
				✓
			</span>
		)
	}

	if (isAnswered && isSelected && !isCorrect) {
		return (
			<span
				aria-hidden='true'
				className='text-red-600 text-xl dark:text-red-400'
			>
				✗
			</span>
		)
	}

	return null
}

function useKeyboardShortcuts(
	disabled: boolean,
	options: MultipleChoiceOptionsProps['question']['options'],
	onSelectOption: (id: string) => void
) {
	useEffect(() => {
		if (disabled) return

		const handleKeyDown = (event: KeyboardEvent) => {
			const key = event.key
			const num = Number.parseInt(key, 10)

			if (num >= 1 && num <= options.length) {
				const option = options[num - 1]
				if (option) {
					onSelectOption(option.id)
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [disabled, options, onSelectOption])
}

export function MultipleChoiceOptions({
	question,
	selectedOptionId,
	onSelectOption,
	isCorrect,
	disabled
}: MultipleChoiceOptionsProps) {
	const userLanguage = useSettingsStore(s => s.userLanguage)
	const isAnswered = isCorrect !== null

	useKeyboardShortcuts(disabled, question.options, onSelectOption)

	return (
		<div aria-label='Answer options' className='space-y-3' role='radiogroup'>
			{question.options.map((option, index) => {
				const isSelected = selectedOptionId === option.id
				const isCorrectOption = option.id === question.correctOptionId
				const optionText = getOptionText(option, userLanguage)
				const className = getOptionClassName(
					isSelected,
					isCorrectOption,
					isAnswered,
					isCorrect
				)

				return (
					<label
						className={className}
						data-testid={`option-${option.id}`}
						key={option.id}
					>
						<input
							aria-label={`Option ${index + 1}: ${optionText}`}
							checked={isSelected}
							className='size-5 cursor-pointer text-blue-600'
							disabled={disabled}
							name='answer-option'
							onChange={() => {
								onSelectOption(option.id)
							}}
							type='radio'
							value={option.id}
						/>
						<span className='flex-1 text-gray-900 dark:text-white'>
							<span className='mr-2 font-medium text-gray-500 dark:text-gray-400'>
								{index + 1}.
							</span>
							{optionText}
						</span>
						<OptionIndicator
							isAnswered={isAnswered}
							isCorrect={isCorrect}
							isCorrectOption={isCorrectOption}
							isSelected={isSelected}
						/>
					</label>
				)
			})}
		</div>
	)
}
