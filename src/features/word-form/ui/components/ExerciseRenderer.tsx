import type {ExerciseEvent} from '@/entities/exercise'
import {CompletionScreen} from '@/features/word-form'
import {loadTranslations} from '@/shared/lib/i18n'
import type {Language} from '@/shared/model'
import {useSettingsStore} from '@/shared/model'
import {ExerciseLayout} from '@/shared/ui/exercise-layout'
import type {WordFormViewState} from '../../model/hooks/useWordFormExercise'
import {ExerciseContent} from './ExerciseContent'
import {exerciseRendererTranslations} from './translations'

interface ExerciseRendererProps {
	state: WordFormViewState
	pulseState: import('@/shared/ui/hint-system').PulseState
	clearPulse: () => void
	handleEvent: (event: ExerciseEvent) => void
	handleSubmit: (answer: string) => void
	handleAutoAdvanceToggle: () => void
	handleAnswerChange: (value: string) => void
	handleSettingsChange: (
		newSettings: Partial<import('@/shared/model').WordFormSettings>
	) => void
	onExit?: () => void
}

interface CompletedViewProps {
	state: WordFormViewState
	exerciseTitle: string
	onExit?: () => void
	onRestart: () => void
}

function CompletedView({
	state,
	exerciseTitle,
	onExit,
	onRestart
}: CompletedViewProps) {
	const handleExit =
		onExit ??
		(() => {
			/* no-op exit handler */
		})

	return (
		<CompletionScreen
			correctCount={state.stats.correct}
			exerciseTitle={exerciseTitle}
			incorrectCount={state.stats.incorrect}
			onExit={handleExit}
			onRestart={onRestart}
			timeSpentMs={Date.now() - state.startedAt}
			totalCases={state.progress.total}
		/>
	)
}

interface MissingCaseViewProps {
	title: string
	message: string
}

function MissingCaseView({title, message}: MissingCaseViewProps) {
	return (
		<ExerciseLayout title={title}>
			<div className='text-center text-red-600'>{message}</div>
		</ExerciseLayout>
	)
}

interface RendererContentProps {
	state: WordFormViewState
	pulseState: import('@/shared/ui/hint-system').PulseState
	clearPulse: () => void
	exerciseTitle: string
	userLanguage: Language
	onSkip: () => void
	onSubmit: (answer: string) => void
	onToggleAutoAdvance: () => void
	onAnswerChange: (value: string) => void
	onSettingsChange: (
		newSettings: Partial<import('@/shared/model').WordFormSettings>
	) => void
	errorTitle: string
	errorMessage: string
}

function RendererContent({
	state,
	pulseState,
	clearPulse,
	exerciseTitle,
	userLanguage,
	onSkip,
	onSubmit,
	onToggleAutoAdvance,
	onAnswerChange,
	onSettingsChange,
	errorTitle,
	errorMessage
}: RendererContentProps) {
	const {currentCase, currentBlock} = state

	if (!(currentCase && currentBlock)) {
		return <MissingCaseView message={errorMessage} title={errorTitle} />
	}

	return (
		<ExerciseLayout title={exerciseTitle}>
			<ExerciseContent
				autoAdvanceEnabled={state.autoAdvanceEnabled}
				currentBlock={currentBlock}
				currentCase={currentCase}
				exercise={state.exercise}
				isCorrect={state.answer.isCorrect}
				onAnswerChange={onAnswerChange}
				onPulseComplete={clearPulse}
				onSettingsChange={onSettingsChange}
				onSkip={onSkip}
				onSubmit={onSubmit}
				onToggleAutoAdvance={onToggleAutoAdvance}
				originalUserAnswer={state.answer.originalValue}
				progress={state.progress}
				pulseState={pulseState}
				showAnswer={state.answer.showAnswer}
				status={state.status}
				userAnswer={state.answer.value}
				userLanguage={userLanguage}
			/>
		</ExerciseLayout>
	)
}

export function ExerciseRenderer({
	state,
	pulseState,
	clearPulse,
	handleEvent,
	handleSubmit,
	handleAutoAdvanceToggle,
	handleAnswerChange,
	handleSettingsChange,
	onExit
}: ExerciseRendererProps) {
	const {userLanguage} = useSettingsStore()
	const {t} = loadTranslations(exerciseRendererTranslations)

	const exerciseTitle =
		state.exercise.titleI18n?.[userLanguage as Language] || state.exercise.title

	if (state.status === 'COMPLETED') {
		return (
			<CompletedView
				exerciseTitle={exerciseTitle}
				onRestart={() => handleEvent({type: 'RESTART'})}
				state={state}
				{...(onExit ? {onExit} : {})}
			/>
		)
	}

	return (
		<RendererContent
			clearPulse={clearPulse}
			errorMessage={t(
				exerciseRendererTranslations['error.couldNotLoadExercise']
			)}
			errorTitle={t(exerciseRendererTranslations['error.title'])}
			exerciseTitle={exerciseTitle}
			onAnswerChange={handleAnswerChange}
			onSettingsChange={handleSettingsChange}
			onSkip={() => handleEvent({type: 'SKIP'})}
			onSubmit={handleSubmit}
			onToggleAutoAdvance={handleAutoAdvanceToggle}
			pulseState={pulseState}
			state={state}
			userLanguage={userLanguage}
		/>
	)
}
