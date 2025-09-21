import {useTranslations} from '@/hooks/useTranslations'
import {useSettingsStore} from '@/stores/settings'
import type {
	ExerciseEvent,
	ExerciseState,
	ExerciseStatus,
	WordFormBlock,
	WordFormCase,
	WordFormExercise
} from '@/types/exercises'
import type {Language} from '@/types/settings'
import {ExerciseLayout} from '../shared/ExerciseLayout'
import {CompletionScreen} from './CompletionScreen'
import {ExerciseContent} from './ExerciseContent'

interface ExerciseRendererProps {
	exercise: WordFormExercise
	state: ExerciseState
	setState: React.Dispatch<React.SetStateAction<ExerciseState>>
	status: ExerciseStatus
	startTime: number
	correctCount: number
	incorrectCount: number
	currentCase: WordFormCase | undefined
	currentBlock: WordFormBlock | undefined
	pulseState: boolean | null
	clearPulse: () => void
	handleEvent: (event: ExerciseEvent) => void
	handleSubmit: (answer: string) => void
	handleAutoAdvanceToggle: () => void
	onExit?: (() => void) | undefined
}

export function ExerciseRenderer({
	exercise,
	state,
	setState,
	status,
	startTime,
	correctCount,
	incorrectCount,
	currentCase,
	currentBlock,
	pulseState,
	clearPulse,
	handleEvent,
	handleSubmit,
	handleAutoAdvanceToggle,
	onExit
}: ExerciseRendererProps) {
	const {userLanguage} = useSettingsStore()
	const {t} = useTranslations([
		{key: 'error.title', fallback: 'Error'},
		{
			key: 'error.couldNotLoadExercise',
			fallback: 'Error: Could not load exercise case'
		}
	])

	if (status === 'COMPLETED') {
		return (
			<CompletionScreen
				correctCount={correctCount}
				exerciseTitle={
					exercise.titleI18n?.[userLanguage as Language] || exercise.title
				}
				incorrectCount={incorrectCount}
				onExit={
					onExit ||
					(() => {
						// No-op function when onExit is not provided
					})
				}
				onRestart={() => handleEvent({type: 'RESTART'})}
				timeSpentMs={Date.now() - startTime}
				totalCases={state.totalCases}
			/>
		)
	}

	if (!(currentCase && currentBlock)) {
		return (
			<ExerciseLayout title={t('error.title')}>
				<div className='text-center text-red-600'>
					{t('error.couldNotLoadExercise')}
				</div>
			</ExerciseLayout>
		)
	}

	return (
		<ExerciseLayout
			title={exercise.titleI18n?.[userLanguage as Language] || exercise.title}
		>
			<ExerciseContent
				currentBlock={currentBlock}
				currentCase={currentCase}
				exercise={exercise}
				onAnswerChange={value =>
					setState(prev => ({...prev, userAnswer: value}))
				}
				onPulseComplete={clearPulse}
				onSubmit={handleSubmit}
				onToggleAutoAdvance={handleAutoAdvanceToggle}
				pulseState={pulseState}
				state={state}
				status={status}
				userLanguage={userLanguage}
			/>
		</ExerciseLayout>
	)
}
