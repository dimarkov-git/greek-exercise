/**
 * Flashcard exercise renderer
 *
 * Main component for flashcard review sessions with flip animations and SRS.
 */

import {useMemo} from 'react'
import type {
	ExerciseRendererProps,
	FlashcardExercise
} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {DEFAULT_FLASHCARD_SETTINGS, useSettingsStore} from '@/shared/model'
import {
	ExerciseControls,
	exerciseSettingsTranslations,
	type SettingField
} from '@/shared/ui'
import {useFlashcardExercise} from '../model/useFlashcardExercise'
import {CompletionScreen} from './components/CompletionScreen'
import {FlashcardRating} from './components/FlashcardRating'
import {FlashcardView} from './components/FlashcardView'

/**
 * Flashcard exercise renderer component
 *
 * Implements the ExerciseRendererProps contract for flashcard exercises.
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Main renderer with multiple UI states
export function FlashcardRenderer({
	exercise,
	onComplete,
	onExit
}: ExerciseRendererProps<FlashcardExercise>) {
	const userLanguage = useSettingsStore(s => s.userLanguage)

	// Adapter to convert FlashcardExerciseResult to ExerciseResult
	const handleComplete = onComplete
		? (
				result: Omit<
					import('@/entities/exercise').FlashcardExerciseResult,
					'completedAt'
				>
			) => {
				const accuracy =
					result.reviewedCards > 0
						? Math.round((result.correctCards / result.reviewedCards) * 100)
						: undefined

				// Convert flashcard result to base exercise result format
				onComplete({
					exerciseId: result.exerciseId,
					totalCases: result.reviewedCards,
					correctAnswers: result.correctCards,
					incorrectAnswers: result.reviewedCards - result.correctCards,
					timeSpentMs: result.totalTimeSpentMs,
					...(accuracy !== undefined ? {accuracy} : {})
				})
			}
		: undefined

	const {state, handleFlip, handleRate, handleRestart, handleSettingsChange} =
		useFlashcardExercise(exercise, handleComplete)

	// Settings configuration (hooks must be at top level before any returns)
	const {t: tSettings} = loadTranslations(exerciseSettingsTranslations)

	const settingsFields: SettingField[] = useMemo(
		() => [
			{
				key: 'autoAdvance',
				type: 'boolean',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.autoAdvance']
				),
				description: tSettings(
					exerciseSettingsTranslations['exerciseSettings.autoAdvanceDesc']
				),
				requiresReload: false
			},
			{
				key: 'autoAdvanceDelayMs',
				type: 'number',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.autoAdvanceDelayMs']
				),
				description: tSettings(
					exerciseSettingsTranslations[
						'exerciseSettings.autoAdvanceDelayMsDesc'
					]
				),
				min: 0,
				max: 5000,
				step: 100,
				requiresReload: false
			},
			{
				key: 'shuffleCards',
				type: 'boolean',
				label: tSettings(
					exerciseSettingsTranslations['exerciseSettings.shuffleCards']
				),
				description: tSettings(
					exerciseSettingsTranslations['exerciseSettings.shuffleCardsDesc']
				),
				requiresReload: true
			}
		],
		[tSettings]
	)

	const currentSettings = useMemo(
		() => ({...DEFAULT_FLASHCARD_SETTINGS, ...exercise.settings}),
		[exercise.settings]
	)

	// Show loading state
	if (state.isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
				<div className='text-center'>
					<div className='mb-4 size-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
					<p className='text-gray-600 dark:text-gray-400'>Loading cards...</p>
				</div>
			</div>
		)
	}

	// Show completion screen
	if (state.status === 'COMPLETED') {
		return (
			<CompletionScreen
				averageQuality={
					state.stats.correct + state.stats.incorrect > 0
						? (state.stats.correct /
								(state.stats.correct + state.stats.incorrect)) *
							5
						: 0
				}
				correctCards={state.stats.correct}
				exerciseTitle={exercise.titleI18n?.[userLanguage] || exercise.title}
				onExit={onExit}
				onRestart={handleRestart}
				reviewedCards={state.progress.reviewedToday}
				totalCards={state.progress.total}
			/>
		)
	}

	// Show "no cards due" message
	if (!state.currentCard) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
				<div className='w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800'>
					<div className='mb-4 text-6xl'>✓</div>
					<h3 className='mb-4 font-semibold text-gray-900 text-xl dark:text-white'>
						No cards due
					</h3>
					<p className='mb-6 text-gray-600 dark:text-gray-400'>
						All cards have been reviewed. Come back later for the next session.
					</p>
					{onExit && (
						<button
							className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
							onClick={onExit}
							type='button'
						>
							Back to Library
						</button>
					)}
				</div>
			</div>
		)
	}

	// Show flashcard review interface
	return (
		<div className='flex min-h-screen flex-col bg-gray-50 p-4 dark:bg-gray-900'>
			<div className='flex flex-1 flex-col items-center'>
				{/* Top controls */}
				<div className='mb-4 w-full max-w-4xl'>
					<ExerciseControls
						autoAdvanceEnabled={currentSettings.autoAdvance}
						onToggleAutoAdvance={() =>
							handleSettingsChange({
								autoAdvance: !currentSettings.autoAdvance
							})
						}
						settingsProps={{
							currentSettings: {...currentSettings} as Record<string, unknown>,
							fields: settingsFields,
							onApply: handleSettingsChange as (
								newSettings: Record<string, unknown>
							) => void,
							onReset: () =>
								({...DEFAULT_FLASHCARD_SETTINGS}) as Record<string, unknown>
						}}
						showAutoAdvanceToggle={true}
						showBackButton={true}
						showSettings={true}
					/>
				</div>
				{/* Header with progress */}
				<div className='mb-4 w-full max-w-2xl'>
					<div className='mb-2 flex justify-between text-gray-600 text-sm dark:text-gray-400'>
						<span>
							Progress: {state.progress.current} / {state.progress.total}
						</span>
						<span>Due today: {state.stats.dueToday}</span>
					</div>
					<div className='h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
						<div
							className='h-full bg-blue-600 transition-all duration-300'
							style={{
								width: `${(state.progress.current / state.progress.total) * 100}%`
							}}
						/>
					</div>
				</div>

				{/* Flashcard */}
				<FlashcardView
					card={state.currentCard}
					isFlipped={state.isFlipped}
					onFlip={handleFlip}
					{...(state.isFlipped && {onRate: handleRate})}
				/>

				{/* Rating buttons (desktop only, only show when flipped) */}
				{state.isFlipped && <FlashcardRating onRate={handleRate} />}
			</div>
		</div>
	)
}
