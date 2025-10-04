/**
 * Multiple-choice completion screen
 *
 * Shows final results and statistics after completing the exercise.
 */

import {motion} from 'framer-motion'
import {loadTranslations} from '@/shared/lib/i18n'
import {multipleChoiceCompletionTranslations} from './translations'

interface CompletionScreenProps {
	exerciseTitle: string
	totalQuestions: number
	correctAnswers: number
	incorrectAnswers: number
	skippedQuestions: number
	onRestart: () => void
	onExit?: () => void
}

interface StatCardProps {
	label: string
	value: string | number
	variant: 'default' | 'success' | 'error' | 'info'
}

function StatCard({label, value, variant}: StatCardProps) {
	const variantClasses = {
		default: 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
		success:
			'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
		error: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
		info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
	}

	const valueClasses = {
		default: 'text-gray-900 dark:text-white',
		success: 'text-green-900 dark:text-green-100',
		error: 'text-red-900 dark:text-red-100',
		info: 'text-blue-900 dark:text-blue-100'
	}

	return (
		<div
			className={`flex items-center justify-between rounded-lg p-4 ${variantClasses[variant]}`}
		>
			<span>{label}</span>
			<span className={`font-bold text-xl ${valueClasses[variant]}`}>
				{value}
			</span>
		</div>
	)
}

interface CompletionStatsProps {
	totalQuestions: number
	correctAnswers: number
	incorrectAnswers: number
	skippedQuestions: number
	accuracy: number
	answeredQuestions: number
	// biome-ignore lint/suspicious/noExplicitAny: Translation function from loadTranslations
	t: (key: any) => string
}

function CompletionStats({
	totalQuestions,
	correctAnswers,
	incorrectAnswers,
	skippedQuestions,
	accuracy,
	answeredQuestions,
	t
}: CompletionStatsProps) {
	return (
		<div className='mb-8 space-y-4'>
			<StatCard
				label={t(
					multipleChoiceCompletionTranslations['multipleChoice.yourScore']
				)}
				value={`${correctAnswers} / ${totalQuestions}`}
				variant='default'
			/>
			<StatCard
				label={t(
					multipleChoiceCompletionTranslations['multipleChoice.correctAnswers']
				)}
				value={correctAnswers}
				variant='success'
			/>
			{incorrectAnswers > 0 && (
				<StatCard
					label={t(
						multipleChoiceCompletionTranslations[
							'multipleChoice.incorrectAnswers'
						]
					)}
					value={incorrectAnswers}
					variant='error'
				/>
			)}
			{skippedQuestions > 0 && (
				<StatCard
					label={t(
						multipleChoiceCompletionTranslations[
							'multipleChoice.skippedQuestions'
						]
					)}
					value={skippedQuestions}
					variant='default'
				/>
			)}
			{answeredQuestions > 0 && (
				<StatCard
					label={t(
						multipleChoiceCompletionTranslations['multipleChoice.accuracy']
					)}
					value={`${accuracy}%`}
					variant='info'
				/>
			)}
		</div>
	)
}

export function CompletionScreen({
	exerciseTitle,
	totalQuestions,
	correctAnswers,
	incorrectAnswers,
	skippedQuestions,
	onRestart,
	onExit
}: CompletionScreenProps) {
	const {t} = loadTranslations(multipleChoiceCompletionTranslations)

	const answeredQuestions = correctAnswers + incorrectAnswers
	const accuracy =
		answeredQuestions > 0
			? Math.round((correctAnswers / answeredQuestions) * 100)
			: 0

	const getPerformanceEmoji = () => {
		if (accuracy >= 90) return '🎉'
		if (accuracy >= 70) return '👍'
		if (accuracy >= 50) return '💪'
		return '📚'
	}

	const performanceEmoji = getPerformanceEmoji()

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
			<motion.div
				animate={{opacity: 1, y: 0}}
				className='w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'
				initial={{opacity: 0, y: 20}}
			>
				<div className='mb-6 text-center'>
					<div className='mb-4 text-6xl'>{performanceEmoji}</div>
					<h2 className='mb-2 font-bold text-2xl text-gray-900 dark:text-white'>
						{t(
							multipleChoiceCompletionTranslations['multipleChoice.completed']
						)}
					</h2>
					<p className='text-gray-600 dark:text-gray-400'>{exerciseTitle}</p>
				</div>

				<CompletionStats
					accuracy={accuracy}
					answeredQuestions={answeredQuestions}
					correctAnswers={correctAnswers}
					incorrectAnswers={incorrectAnswers}
					skippedQuestions={skippedQuestions}
					t={t}
					totalQuestions={totalQuestions}
				/>

				<div className='flex gap-3'>
					<button
						className='flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
						onClick={onRestart}
						type='button'
					>
						{t(multipleChoiceCompletionTranslations['multipleChoice.tryAgain'])}
					</button>
					{onExit && (
						<button
							className='flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
							onClick={onExit}
							type='button'
						>
							{t(multipleChoiceCompletionTranslations['common.backToLibrary'])}
						</button>
					)}
				</div>
			</motion.div>
		</div>
	)
}
