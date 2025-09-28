import {motion} from 'framer-motion'
import {Link} from 'react-router'
import {
	type ExerciseUiTranslationKey,
	exerciseUiTranslations,
	type Translator,
	useTranslations
} from '@/shared/lib/i18n'

interface ExerciseHeaderProps {
	title: string
	blockName?: string
	progress?: {
		current: number
		total: number
	}
	onToggleAutoAdvance?: () => void
	autoAdvanceEnabled?: boolean
	showBackButton?: boolean
}

type ExerciseTranslator = Translator<ExerciseUiTranslationKey>

function BackButton({t}: {t: ExerciseTranslator}) {
	return (
		<Link
			className='flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
			data-testid='exercise-back-button'
			to='/exercises'
		>
			<svg
				className='h-5 w-5'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<title>{t('exercise.backArrow')}</title>
				<path
					d='M15 19l-7-7 7-7'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
				/>
			</svg>
			{t('exercise.backToLibrary')}
		</Link>
	)
}

function AutoAdvanceToggle({
	t,
	onToggleAutoAdvance,
	autoAdvanceEnabled
}: {
	t: ExerciseTranslator
	onToggleAutoAdvance: () => void
	autoAdvanceEnabled: boolean
}) {
	return (
		<button
			className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
				autoAdvanceEnabled
					? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
					: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
			}`}
			data-enabled={autoAdvanceEnabled}
			data-testid='auto-advance-toggle'
			onClick={onToggleAutoAdvance}
			title={
				autoAdvanceEnabled
					? t('exercise.autoAdvanceEnabled')
					: t('exercise.autoAdvanceDisabled')
			}
			type='button'
		>
			{autoAdvanceEnabled ? (
				<svg
					className='h-4 w-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<title>{t('exercise.autoAdvanceEnabledIcon')}</title>
					<path
						d='M14.828 14.828a4 4 0 01-5.656 0M9 10h6m-3-3v6m3.586-5.414L16 7.172V20a2 2 0 01-2 2H10a2 2 0 01-2-2V7.172l.414-.414A2 2 0 009.828 6h4.344a2 2 0 011.414.586z'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
					/>
				</svg>
			) : (
				<svg
					className='h-4 w-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<title>{t('exercise.autoAdvanceDisabledIcon')}</title>
					<path
						d='M10 9v6m4-6v6'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
					/>
				</svg>
			)}
			{t('exercise.autoAdvance')}
		</button>
	)
}

function ProgressBar({
	progress,
	t
}: {
	progress: {current: number; total: number}
	t: ExerciseTranslator
}) {
	return (
		<div className='w-full' data-testid='exercise-progress'>
			<div className='mb-2 flex items-center justify-between'>
				<span className='text-gray-600 text-sm dark:text-gray-400'>
					{t('exercise.progress')}
				</span>
				<span
					className='font-medium text-gray-900 text-sm dark:text-white'
					data-progress-current={progress.current}
					data-progress-total={progress.total}
					data-testid='progress-text'
				>
					{progress.current} {t('exercise.progressOf')} {progress.total}
				</span>
			</div>

			<div className='h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
				<motion.div
					animate={{
						width: `${(progress.current / progress.total) * 100}%`
					}}
					className='h-2 rounded-full bg-blue-600'
					initial={{width: 0}}
					transition={{duration: 0.5, ease: 'easeOut'}}
				/>
			</div>
		</div>
	)
}

/**
 * Заголовок упражнения с прогрессом и элементами управления
 */
export function ExerciseHeader({
	title,
	blockName,
	progress,
	onToggleAutoAdvance,
	autoAdvanceEnabled = true,
	showBackButton = true
}: ExerciseHeaderProps) {
	const {t} = useTranslations(exerciseUiTranslations)

	return (
		<motion.div
			animate={{opacity: 1, y: 0}}
			className='mb-8'
			initial={{opacity: 0, y: -20}}
		>
			{/* Верхняя строка с кнопкой назад и заголовком */}
			<div className='mb-4 flex items-center justify-between'>
				{showBackButton && <BackButton t={t} />}

				{onToggleAutoAdvance && (
					<AutoAdvanceToggle
						autoAdvanceEnabled={autoAdvanceEnabled}
						onToggleAutoAdvance={onToggleAutoAdvance}
						t={t}
					/>
				)}
			</div>

			{/* Заголовок упражнения */}
			<div className='mb-4 text-center'>
				<h1 className='mb-2 font-bold text-3xl text-gray-900 dark:text-white'>
					{title}
				</h1>

				{blockName && (
					<h2 className='text-gray-600 text-xl dark:text-gray-400'>
						{blockName}
					</h2>
				)}
			</div>

			{progress && <ProgressBar progress={progress} t={t} />}
		</motion.div>
	)
}
