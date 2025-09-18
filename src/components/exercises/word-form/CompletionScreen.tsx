import {motion} from 'framer-motion'
import {ExerciseLayout} from '@/components/exercises/shared/ExerciseLayout'

interface CompletionScreenProps {
	correctCount: number
	incorrectCount: number
	totalCases: number
	timeSpentMs: number
	exerciseTitle: string
	onRestart: () => void
	onExit: () => void
}

export function CompletionScreen({
	correctCount,
	incorrectCount,
	totalCases,
	timeSpentMs,
	exerciseTitle,
	onRestart,
	onExit
}: CompletionScreenProps) {
	const accuracy = Math.round((correctCount / totalCases) * 100)

	return (
		<ExerciseLayout title={exerciseTitle}>
			<motion.div
				animate={{opacity: 1, scale: 1}}
				className='space-y-6 p-8 text-center'
				initial={{opacity: 0, scale: 0.9}}
			>
				<div className='mb-4 text-6xl'>🎉</div>
				<h2 className='font-bold text-2xl text-green-600 dark:text-green-400'>
					Συγχαρητήρια! Ολοκληρώσατε την άσκηση
				</h2>
				<div className='space-y-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
					<div className='grid grid-cols-2 gap-4 text-sm'>
						<div>
							<div className='text-gray-600 dark:text-gray-400'>
								Σωστές απαντήσεις
							</div>
							<div className='font-bold text-2xl text-green-600'>
								{correctCount}
							</div>
						</div>
						<div>
							<div className='text-gray-600 dark:text-gray-400'>
								Λάθος απαντήσεις
							</div>
							<div className='font-bold text-2xl text-red-600'>
								{incorrectCount}
							</div>
						</div>
						<div>
							<div className='text-gray-600 dark:text-gray-400'>Ακρίβεια</div>
							<div className='font-bold text-2xl text-blue-600'>
								{accuracy}%
							</div>
						</div>
						<div>
							<div className='text-gray-600 dark:text-gray-400'>Χρόνος</div>
							<div className='font-bold text-2xl text-purple-600'>
								{Math.round(timeSpentMs / 1000)}s
							</div>
						</div>
					</div>
				</div>
				<div className='flex justify-center gap-4'>
					<button
						className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
						onClick={onRestart}
						type='button'
					>
						Ξεκινήστε ξανά
					</button>
					<button
						className='rounded-lg bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700'
						onClick={onExit}
						type='button'
					>
						Επιστροφή στη βιβλιοθήκη
					</button>
				</div>
			</motion.div>
		</ExerciseLayout>
	)
}
