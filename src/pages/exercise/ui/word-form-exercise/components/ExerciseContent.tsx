import {AnimatePresence} from 'framer-motion'
import type {
	ExerciseStatus,
	WordFormBlock,
	WordFormCase,
	WordFormExercise
} from '@/entities/exercise'
import {getExerciseSettings} from '@/entities/exercise'
import {
	WordFormFeedback,
	WordFormInput
} from '@/pages/exercise/ui/word-form-exercise'
import type {Language} from '@/shared/model'
import {ExerciseHeader} from '../exercise-header'
import {HintSystem, PulseEffect, type PulseState} from '../hint-system/index'

function PromptWithHint({currentCase}: {currentCase: WordFormCase}) {
	return (
		<div className='text-center'>
			{currentCase.promptHintI18n ? (
				<HintSystem
					className='font-bold text-2xl text-blue-600 dark:text-blue-400'
					hints={currentCase.promptHintI18n}
					primaryText={currentCase.prompt}
				/>
			) : (
				<div className='font-bold text-2xl text-blue-600 dark:text-blue-400'>
					{currentCase.prompt}
				</div>
			)}
		</div>
	)
}

function AdditionalHint({currentCase}: {currentCase: WordFormCase}) {
	if (!currentCase.hint) return null

	return (
		<div className='text-center text-gray-600 text-sm dark:text-gray-400'>
			{currentCase.hintI18n ? (
				<HintSystem
					className='italic'
					hints={currentCase.hintI18n}
					primaryText={currentCase.hint}
				/>
			) : (
				<span className='italic'>{currentCase.hint}</span>
			)}
		</div>
	)
}

interface ExerciseContentProps {
	exercise: WordFormExercise
	currentBlock: WordFormBlock
	currentCase: WordFormCase
	status: ExerciseStatus
	progress: {
		current: number
		total: number
	}
	autoAdvanceEnabled: boolean
	userAnswer: string
	originalUserAnswer: string
	showAnswer: boolean
	isCorrect: boolean | null
	userLanguage: Language
	pulseState: PulseState
	onToggleAutoAdvance: () => void
	onSubmit: (answer: string) => void
	onAnswerChange: (value: string) => void
	onPulseComplete: () => void
	onSkip: () => void
}

export function ExerciseContent({
	exercise,
	currentBlock,
	currentCase,
	status,
	progress,
	autoAdvanceEnabled,
	userAnswer,
	originalUserAnswer,
	showAnswer,
	isCorrect,
	userLanguage,
	pulseState,
	onToggleAutoAdvance,
	onSubmit,
	onAnswerChange,
	onPulseComplete,
	onSkip
}: ExerciseContentProps) {
	return (
		<>
			<ExerciseHeader
				autoAdvanceEnabled={autoAdvanceEnabled}
				blockName={currentBlock.name}
				onToggleAutoAdvance={onToggleAutoAdvance}
				progress={{
					current: progress.current,
					total: progress.total
				}}
				title={exercise.titleI18n?.[userLanguage] || exercise.title}
			/>

			<div className='space-y-8'>
				{/* Block name with hint */}
				<div className='text-center'>
					{currentBlock.nameHintI18n ? (
						<HintSystem
							className='font-semibold text-gray-800 text-xl dark:text-gray-200'
							hints={currentBlock.nameHintI18n}
							primaryText={currentBlock.name}
						/>
					) : (
						<div className='font-semibold text-gray-800 text-xl dark:text-gray-200'>
							{currentBlock.name}
						</div>
					)}
				</div>

				{/* Current prompt with hint */}
				<PromptWithHint currentCase={currentCase} />

				{/* Additional hint (if exists) */}
				<AdditionalHint currentCase={currentCase} />

				{/* Input area with pulse effect */}
				<PulseEffect
					onAnimationComplete={onPulseComplete}
					pulseState={pulseState}
				>
					<WordFormInput
						allowSkip={getExerciseSettings(exercise).allowSkip}
						disabled={
							status !== 'WAITING_INPUT' &&
							status !== 'REQUIRE_CORRECTION' &&
							status !== 'REQUIRE_CONTINUE'
						}
						onChange={onAnswerChange}
						onSkip={onSkip}
						onSubmit={onSubmit}
						placeholder='Εισάγετε την απάντησή σας...'
						status={status}
						value={userAnswer}
					/>
				</PulseEffect>

				{/* Feedback area */}
				<AnimatePresence>
					{showAnswer && currentCase && (
						<WordFormFeedback
							correctAnswers={currentCase.correct}
							isCorrect={isCorrect}
							status={status}
							userAnswer={originalUserAnswer || userAnswer}
						/>
					)}
				</AnimatePresence>
			</div>
		</>
	)
}
