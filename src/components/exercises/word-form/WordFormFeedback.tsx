import {motion} from 'framer-motion'
import type {ExerciseStatus} from '@/types/exercises'

interface WordFormFeedbackProps {
	isCorrect: boolean | null
	correctAnswers: string[]
	userAnswer: string
	status: ExerciseStatus
}

interface SuccessFeedbackProps {
	userAnswer: string
}

interface ErrorFeedbackProps {
	userAnswer: string
	correctAnswers: string[]
	status: ExerciseStatus
}

function SuccessFeedback({userAnswer}: SuccessFeedbackProps) {
	return (
		<div className='rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
			<div className='flex items-center justify-center space-x-2 text-green-700 dark:text-green-300'>
				<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 20 20'>
					<title>Correct answer</title>
					<path
						clipRule='evenodd'
						d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
						fillRule='evenodd'
					/>
				</svg>
				<span className='font-semibold text-lg'>Σωστό!</span>
			</div>
			<p className='mt-2 text-green-600 dark:text-green-400'>
				Η απάντησή σας "{userAnswer}" είναι σωστή.
			</p>
		</div>
	)
}

function CorrectAnswersList({correctAnswers}: {correctAnswers: string[]}) {
	return (
		<div className='mt-3'>
			<p className='mb-2 text-gray-600 text-sm dark:text-gray-400'>
				{correctAnswers.length === 1 ? 'Σωστή απάντηση:' : 'Σωστές απαντήσεις:'}
			</p>
			<div className='flex flex-wrap justify-center gap-2'>
				{correctAnswers.map((answer, index) => (
					<motion.span
						animate={{opacity: 1, scale: 1}}
						className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm dark:bg-green-800 dark:text-green-200'
						initial={{opacity: 0, scale: 0.8}}
						key={answer}
						transition={{delay: index * 0.1}}
					>
						{answer}
					</motion.span>
				))}
			</div>
		</div>
	)
}

function ErrorFeedback({
	userAnswer,
	correctAnswers,
	status
}: ErrorFeedbackProps) {
	return (
		<div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
			<div className='flex items-center justify-center space-x-2 text-red-700 dark:text-red-300'>
				<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 20 20'>
					<title>Incorrect answer</title>
					<path
						clipRule='evenodd'
						d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
						fillRule='evenodd'
					/>
				</svg>
				<span className='font-semibold text-lg'>Λάθος</span>
			</div>

			{userAnswer && (
				<p className='mt-2 text-red-600 dark:text-red-400'>
					Η απάντησή σας: "{userAnswer}"
				</p>
			)}

			<CorrectAnswersList correctAnswers={correctAnswers} />

			{status === 'WRONG_ANSWER' && (
				<motion.p
					animate={{opacity: 1}}
					className='mt-3 text-gray-500 text-xs dark:text-gray-400'
					initial={{opacity: 0}}
					transition={{delay: 0.5}}
				>
					Εισάγετε μία από τις σωστές απαντήσεις για να συνεχίσετε
				</motion.p>
			)}
		</div>
	)
}

/**
 * Feedback component for word form exercises
 * Shows correct/incorrect status and correct answers when needed
 */
export function WordFormFeedback({
	isCorrect,
	correctAnswers,
	userAnswer,
	status
}: WordFormFeedbackProps) {
	// Don't render if no feedback needed
	if (
		isCorrect === null ||
		status === 'WAITING_INPUT' ||
		status === 'CHECKING'
	) {
		return null
	}

	return (
		<motion.div
			animate={{opacity: 1, y: 0, scale: 1}}
			className='space-y-3 text-center'
			exit={{opacity: 0, y: -20, scale: 0.95}}
			initial={{opacity: 0, y: 20, scale: 0.95}}
			transition={{duration: 0.3, ease: 'easeOut'}}
		>
			{isCorrect && <SuccessFeedback userAnswer={userAnswer} />}

			{!isCorrect && (
				<ErrorFeedback
					correctAnswers={correctAnswers}
					status={status}
					userAnswer={userAnswer}
				/>
			)}

			{/* Progress indicator for auto-advance */}
			{isCorrect && status === 'CORRECT_ANSWER' && (
				<motion.div
					animate={{width: '100%'}}
					className='h-1 rounded-full bg-green-400'
					initial={{width: '0%'}}
					transition={{duration: 1, ease: 'linear'}}
				/>
			)}
		</motion.div>
	)
}
