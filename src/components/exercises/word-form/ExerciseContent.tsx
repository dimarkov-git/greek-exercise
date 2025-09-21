import {AnimatePresence} from 'framer-motion'
import type {
	ExerciseState,
	ExerciseStatus,
	WordFormBlock,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import {getExerciseSettings} from '@/types/exercises'
import type {Language} from '@/types/settings'
import {ExerciseHeader} from '../shared/ExerciseHeader'
import {HintSystem} from '../shared/HintSystem'
import {PulseEffect} from '../shared/PulseEffect'
import {WordFormFeedback} from './WordFormFeedback'
import {WordFormInput} from './WordFormInput'

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
	state: ExerciseState
	status: ExerciseStatus
	userLanguage: Language
	pulseState: boolean | null
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
	state,
	status,
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
				autoAdvanceEnabled={state.autoAdvanceEnabled}
				blockName={currentBlock.name}
				onToggleAutoAdvance={onToggleAutoAdvance}
				progress={{
					current: state.completedCases + 1,
					total: state.totalCases
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
					isCorrect={pulseState}
					onAnimationComplete={onPulseComplete}
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
						value={state.userAnswer}
					/>
				</PulseEffect>

				{/* Feedback area */}
				<AnimatePresence>
					{state.showAnswer && currentCase && (
						<WordFormFeedback
							correctAnswers={currentCase.correct}
							isCorrect={state.isCorrect}
							status={status}
							userAnswer={state.userAnswer}
						/>
					)}
				</AnimatePresence>
			</div>
		</>
	)
}
