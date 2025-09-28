import type {ExerciseEvent} from '@/entities/exercise'
import {CompletionScreen} from '@/features/word-form-exercise'
import {useTranslations} from '@/hooks/useTranslations'
import {exerciseUiTranslations} from '@/shared/lib/i18n/dictionaries'
import {useSettingsStore} from '@/shared/model'
import type {Language} from '@/shared/model/settings'
import {ExerciseLayout} from '../shared/ExerciseLayout'
import {ExerciseContent} from './ExerciseContent'
import type {WordFormViewState} from './hooks/useWordFormExercise'

interface ExerciseRendererProps {
	state: WordFormViewState
	pulseState: import('../shared/PulseEffect').PulseState
	clearPulse: () => void
	handleEvent: (event: ExerciseEvent) => void
	handleSubmit: (answer: string) => void
	handleAutoAdvanceToggle: () => void
	handleAnswerChange: (value: string) => void
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
	pulseState: import('../shared/PulseEffect').PulseState
	clearPulse: () => void
	exerciseTitle: string
	userLanguage: Language
	onSkip: () => void
	onSubmit: (answer: string) => void
	onToggleAutoAdvance: () => void
	onAnswerChange: (value: string) => void
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
	onExit
}: ExerciseRendererProps) {
	const {userLanguage} = useSettingsStore()
	const {t} = useTranslations(exerciseUiTranslations)

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
			errorMessage={t('error.couldNotLoadExercise')}
			errorTitle={t('error.title')}
			exerciseTitle={exerciseTitle}
			onAnswerChange={handleAnswerChange}
			onSkip={() => handleEvent({type: 'SKIP'})}
			onSubmit={handleSubmit}
			onToggleAutoAdvance={handleAutoAdvanceToggle}
			pulseState={pulseState}
			state={state}
			userLanguage={userLanguage}
		/>
	)
}
