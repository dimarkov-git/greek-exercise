/**
 * Multiple-choice exercise renderer
 *
 * Main component for multiple-choice question exercises.
 */

import type {ExerciseRendererProps} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {useSettingsStore} from '@/shared/model'
import {ExerciseLayout} from '@/shared/ui/exercise-layout'
import type {MultipleChoiceExercise} from '../model/types'
import type {MultipleChoiceViewState} from '../model/useMultipleChoiceExercise'
import {useMultipleChoiceExercise} from '../model/useMultipleChoiceExercise'
import {CompletionScreen} from './components/CompletionScreen'
import {MultipleChoiceFeedback} from './components/MultipleChoiceFeedback'
import {MultipleChoiceOptions} from './components/MultipleChoiceOptions'
import {MultipleChoiceQuestionComponent} from './components/MultipleChoiceQuestion'
import {multipleChoiceTranslations} from './components/translations'

interface ExerciseHeaderProps {
	onExit: (() => void) | undefined
	progress: MultipleChoiceViewState['progress']
	stats: MultipleChoiceViewState['stats']
}

function ExerciseHeader({onExit, progress, stats}: ExerciseHeaderProps) {
	return (
		<div className='mb-4 flex items-center justify-between'>
			{onExit && (
				<button
					className='rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
					onClick={onExit}
					type='button'
				>
					← Back
				</button>
			)}
			<div className='ml-auto text-gray-600 text-sm dark:text-gray-400'>
				Question {progress.current} of {progress.total} | ✓ {stats.correct} / ✗{' '}
				{stats.incorrect}
			</div>
		</div>
	)
}

interface ActionButtonsProps {
	isAnswered: boolean
	canSubmit: boolean
	canSkip: boolean
	autoAdvanceEnabled: boolean
	onCheckAnswer: () => void
	onSkip: () => void
	onAdvance: () => void
	checkAnswerText: string
	skipText: string
	nextText: string
}

function ActionButtons({
	isAnswered,
	canSubmit,
	canSkip,
	autoAdvanceEnabled,
	onCheckAnswer,
	onSkip,
	onAdvance,
	checkAnswerText,
	skipText,
	nextText
}: ActionButtonsProps) {
	if (isAnswered && !autoAdvanceEnabled) {
		return (
			<div className='flex gap-3'>
				<button
					className='flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
					onClick={onAdvance}
					type='button'
				>
					{nextText}
				</button>
			</div>
		)
	}

	if (!isAnswered) {
		return (
			<div className='flex gap-3'>
				<button
					className='flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
					disabled={!canSubmit}
					onClick={onCheckAnswer}
					type='button'
				>
					{checkAnswerText}
				</button>
				{canSkip && (
					<button
						className='rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
						onClick={onSkip}
						type='button'
					>
						{skipText}
					</button>
				)}
			</div>
		)
	}

	return null
}

interface HintSectionProps {
	hint: string
	hintI18n: Partial<Record<string, string>> | undefined
	showHint: boolean
	userLanguage: string
	showHintText: string
	hideHintText: string
}

function HintSection({
	hint,
	hintI18n,
	showHint,
	userLanguage,
	showHintText,
	hideHintText
}: HintSectionProps) {
	const hintText = showHint ? (hintI18n?.[userLanguage] ?? hint) : null

	return (
		<>
			<div className='flex justify-end'>
				<button
					className='text-blue-600 text-sm hover:text-blue-700 dark:text-blue-400'
					onClick={() => {
						/* handleToggleHint() */
					}}
					type='button'
				>
					{showHint ? hideHintText : showHintText}
				</button>
			</div>
			{hintText && (
				<div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
					<p className='text-blue-800 text-sm dark:text-blue-300'>
						💡 {hintText}
					</p>
				</div>
			)}
		</>
	)
}

interface ExerciseContentProps {
	currentQuestion: NonNullable<
		ReturnType<typeof useMultipleChoiceExercise>['state']['currentQuestion']
	>
	isAnswered: boolean
	state: ReturnType<typeof useMultipleChoiceExercise>['state']
	userLanguage: string
	hideHintText: string
	showHintText: string
	checkAnswerText: string
	nextText: string
	skipText: string
	handleSelectOption: (id: string) => void
	handleCheckAnswer: () => void
	handleAdvance: () => void
	handleSkip: () => void
}

function ExerciseContent({
	currentQuestion,
	isAnswered,
	state,
	userLanguage,
	hideHintText,
	showHintText,
	checkAnswerText,
	nextText,
	skipText,
	handleSelectOption,
	handleCheckAnswer,
	handleAdvance,
	handleSkip
}: ExerciseContentProps) {
	return (
		<div className='mx-auto w-full max-w-3xl space-y-6'>
			<MultipleChoiceQuestionComponent question={currentQuestion} />

			{currentQuestion.hint && (
				<HintSection
					hideHintText={hideHintText}
					hint={currentQuestion.hint}
					hintI18n={currentQuestion.hintI18n}
					showHint={state.showHint}
					showHintText={showHintText}
					userLanguage={userLanguage}
				/>
			)}

			<MultipleChoiceOptions
				disabled={isAnswered}
				isCorrect={state.isCorrect}
				onSelectOption={handleSelectOption}
				question={currentQuestion}
				selectedOptionId={state.selectedOptionId}
			/>

			{isAnswered && state.isCorrect !== null && (
				<MultipleChoiceFeedback isCorrect={state.isCorrect} />
			)}

			<ActionButtons
				autoAdvanceEnabled={state.autoAdvanceEnabled}
				canSkip={state.canSkip}
				canSubmit={state.canSubmit}
				checkAnswerText={checkAnswerText}
				isAnswered={isAnswered}
				nextText={nextText}
				onAdvance={handleAdvance}
				onCheckAnswer={handleCheckAnswer}
				onSkip={handleSkip}
				skipText={skipText}
			/>
		</div>
	)
}

/**
 * Multiple-choice exercise renderer component
 *
 * Implements the ExerciseRendererProps contract for multiple-choice exercises.
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Main renderer with early returns and component composition
export function MultipleChoiceRenderer({
	exercise,
	onComplete,
	onExit
}: ExerciseRendererProps<MultipleChoiceExercise>) {
	const userLanguage = useSettingsStore(s => s.userLanguage)
	const {t} = loadTranslations(multipleChoiceTranslations)

	const {
		state,
		handleSelectOption,
		handleCheckAnswer,
		handleAdvance,
		handleSkip,
		handleRestart
	} = useMultipleChoiceExercise(exercise, onComplete)

	// Show completion screen
	if (state.status === 'COMPLETED') {
		return (
			<CompletionScreen
				correctAnswers={state.stats.correct}
				exerciseTitle={exercise.titleI18n?.[userLanguage] ?? exercise.title}
				incorrectAnswers={state.stats.incorrect}
				onRestart={handleRestart}
				skippedQuestions={state.stats.skipped}
				totalQuestions={state.progress.total}
				{...(onExit ? {onExit} : {})}
			/>
		)
	}

	// Show exercise content
	const currentQuestion = state.currentQuestion
	if (!currentQuestion) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p>No questions available</p>
			</div>
		)
	}

	const isAnswered = state.isCorrect !== null
	const exerciseTitle = exercise.titleI18n?.[userLanguage] ?? exercise.title
	const hideHintText = t(multipleChoiceTranslations['multipleChoice.hideHint'])
	const showHintText = t(multipleChoiceTranslations['multipleChoice.showHint'])
	const checkAnswerText = t(
		multipleChoiceTranslations['multipleChoice.checkAnswer']
	)
	const nextText = t(multipleChoiceTranslations['multipleChoice.next'])
	const skipText = t(multipleChoiceTranslations['multipleChoice.skip'])

	return (
		<ExerciseLayout title={exerciseTitle}>
			<ExerciseHeader
				onExit={onExit}
				progress={state.progress}
				stats={state.stats}
			/>
			<ExerciseContent
				checkAnswerText={checkAnswerText}
				currentQuestion={currentQuestion}
				handleAdvance={handleAdvance}
				handleCheckAnswer={handleCheckAnswer}
				handleSelectOption={handleSelectOption}
				handleSkip={handleSkip}
				hideHintText={hideHintText}
				isAnswered={isAnswered}
				nextText={nextText}
				showHintText={showHintText}
				skipText={skipText}
				state={state}
				userLanguage={userLanguage}
			/>
		</ExerciseLayout>
	)
}
