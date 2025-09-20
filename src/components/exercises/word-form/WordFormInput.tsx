import {motion} from 'framer-motion'
import {useEffect, useRef, useState} from 'react'
import {useTranslations} from '@/hooks/useTranslations'
import type {ExerciseStatus} from '@/types/exercises'

// Get input styling based on status
function getInputStyles(status: ExerciseStatus, isFocused: boolean): string {
	const baseStyles = `
		w-full px-4 py-3 text-lg rounded-lg border-2 transition-all duration-200
		bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
		placeholder-gray-500 dark:placeholder-gray-400
		focus:outline-none focus:ring-2
	`

	switch (status) {
		case 'CHECKING':
			return `${baseStyles} border-yellow-300 focus:ring-yellow-200 animate-pulse`
		case 'CORRECT_ANSWER':
			return `${baseStyles} border-green-400 focus:ring-green-200 bg-green-50 dark:bg-green-900/20`
		case 'WRONG_ANSWER':
		case 'REQUIRE_CORRECTION':
			return `${baseStyles} border-red-400 focus:ring-red-200 bg-red-50 dark:bg-red-900/20`
		case 'COMPLETED':
			return `${baseStyles} border-gray-300 dark:border-gray-600 opacity-50`
		default:
			return `${baseStyles} border-gray-300 dark:border-gray-600 focus:ring-blue-200 focus:border-blue-400 ${
				isFocused ? 'border-blue-400' : ''
			}`
	}
}

// Get button styling based on status
function getButtonStyles(
	status: ExerciseStatus,
	disabled: boolean,
	value: string
): string {
	const baseStyles = `
		px-6 py-3 rounded-lg font-medium transition-all duration-200
		focus:outline-none focus:ring-2 focus:ring-offset-2
	`

	if (disabled || !value.trim()) {
		return `${baseStyles} bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed`
	}

	switch (status) {
		case 'CHECKING':
			return `${baseStyles} bg-yellow-500 text-white animate-pulse`
		case 'REQUIRE_CORRECTION':
			return `${baseStyles} bg-red-500 hover:bg-red-600 text-white focus:ring-red-300`
		default:
			return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300`
	}
}

// Get button text based on status
function getButtonText(
	status: ExerciseStatus,
	t: (key: string) => string
): string {
	switch (status) {
		case 'CHECKING':
			return t('exercise.checking')
		case 'REQUIRE_CORRECTION':
			return t('exercise.enterCorrectAnswer')
		default:
			return t('exercise.submit')
	}
}

function LoadingIndicator() {
	return (
		<div className='-translate-y-1/2 absolute top-1/2 right-3 transform'>
			<div className='h-5 w-5 animate-spin rounded-full border-yellow-600 border-b-2' />
		</div>
	)
}

function KeyboardHint() {
	const {t} = useTranslations([
		{key: 'exercise.enterKey', fallback: 'to submit'},
		{key: 'exercise.enterKeyName', fallback: 'Enter'}
	])

	return (
		<div className='flex items-center text-gray-500 text-sm dark:text-gray-400'>
			<kbd className='rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700'>
				{t('exercise.enterKeyName')}
			</kbd>
			<span className='ml-2'>{t('exercise.enterKey')}</span>
		</div>
	)
}

function CorrectionHelpText() {
	const {t} = useTranslations([
		{
			key: 'exercise.enterCorrectAnswerToContinue',
			fallback: 'Please enter the correct answer to continue.'
		}
	])

	return (
		<motion.div
			animate={{opacity: 1, height: 'auto'}}
			className='rounded-lg bg-red-50 p-3 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400'
			exit={{opacity: 0, height: 0}}
			initial={{opacity: 0, height: 0}}
		>
			{t('exercise.enterCorrectAnswerToContinue')}
		</motion.div>
	)
}

function InputField({
	inputRef,
	inputStyles,
	disabled,
	status,
	value,
	placeholder,
	onFocus,
	onBlur,
	onChange,
	onKeyPress
}: {
	inputRef: React.RefObject<HTMLInputElement | null>
	inputStyles: string
	disabled: boolean
	status: ExerciseStatus
	value: string
	placeholder: string
	onFocus: () => void
	onBlur: () => void
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyPress: (e: React.KeyboardEvent) => void
}) {
	return (
		<div className='relative'>
			<input
				autoComplete='off'
				className={inputStyles}
				data-status={status}
				data-testid='exercise-input'
				disabled={disabled && status !== 'REQUIRE_CORRECTION'}
				onBlur={onBlur}
				onChange={onChange}
				onFocus={onFocus}
				onKeyPress={onKeyPress}
				placeholder={placeholder}
				ref={inputRef}
				spellCheck='false'
				type='text'
				value={value}
			/>
			{status === 'CHECKING' && <LoadingIndicator />}
		</div>
	)
}

interface WordFormInputProps {
	value: string
	onChange: (value: string) => void
	onSubmit: (value: string) => void
	disabled?: boolean
	status: ExerciseStatus
	placeholder?: string
	autoFocus?: boolean
}

function useWordFormInput({
	value,
	onChange,
	onSubmit,
	disabled,
	status,
	autoFocus
}: {
	value: string
	onChange: (value: string) => void
	onSubmit: (value: string) => void
	disabled: boolean
	status: ExerciseStatus
	autoFocus: boolean
}) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		if (autoFocus && inputRef.current && status === 'WAITING_INPUT') {
			inputRef.current.focus()
		}
	}, [autoFocus, status])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (value.trim() && !disabled) {
			onSubmit(value)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && value.trim() && !disabled) {
			onSubmit(value)
		}
	}

	return {
		inputRef,
		isFocused,
		setIsFocused,
		handleSubmit,
		handleChange,
		handleKeyPress
	}
}

/**
 * Input field component for word form exercises
 * Handles user input, validation, and submission
 */
export function WordFormInput({
	value,
	onChange,
	onSubmit,
	disabled = false,
	status,
	placeholder = '',
	autoFocus = true
}: WordFormInputProps) {
	const {
		inputRef,
		isFocused,
		setIsFocused,
		handleSubmit,
		handleChange,
		handleKeyPress
	} = useWordFormInput({
		value,
		onChange,
		onSubmit,
		disabled,
		status,
		autoFocus
	})

	const {t} = useTranslations([
		{key: 'exercise.checking', fallback: 'Checking...'},
		{key: 'exercise.submit', fallback: 'Submit'},
		{key: 'exercise.enterCorrectAnswer', fallback: 'Enter correct answer'}
	])

	const inputStyles = getInputStyles(status, isFocused)
	const buttonStyles = getButtonStyles(status, disabled, value)
	const buttonText = getButtonText(status, t)

	return (
		<motion.form
			animate={{opacity: 1, y: 0}}
			className='space-y-4'
			initial={{opacity: 0, y: 20}}
			onSubmit={handleSubmit}
			transition={{duration: 0.3}}
		>
			<InputField
				disabled={disabled}
				inputRef={inputRef}
				inputStyles={inputStyles}
				onBlur={() => setIsFocused(false)}
				onChange={handleChange}
				onFocus={() => setIsFocused(true)}
				onKeyPress={handleKeyPress}
				placeholder={placeholder}
				status={status}
				value={value}
			/>

			<div className='flex gap-3'>
				<button
					className={buttonStyles}
					data-status={status}
					data-testid='exercise-submit-button'
					disabled={disabled || !value.trim()}
					type='submit'
				>
					{buttonText}
				</button>

				{status === 'WAITING_INPUT' && <KeyboardHint />}
			</div>

			{status === 'REQUIRE_CORRECTION' && <CorrectionHelpText />}
		</motion.form>
	)
}
