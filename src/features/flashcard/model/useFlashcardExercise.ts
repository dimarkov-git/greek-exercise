/**
 * Flashcard exercise hook
 *
 * Main React hook for managing flashcard review sessions.
 * Handles SRS data loading, state management, and progress persistence.
 */

import {useCallback, useEffect, useReducer, useRef} from 'react'
import type {
	FlashCard,
	FlashcardExercise,
	FlashcardExerciseResult,
	FlashcardStatus,
	QualityRating,
	SRSData
} from '@/entities/exercise'
import {DEFAULT_FLASHCARD_SETTINGS} from '@/shared/model'
import {flashcardStorage} from '../lib/flashcard-storage'
import {
	calculateNextReview,
	getDueCards,
	initializeSRSData
} from '../lib/sm2-algorithm'
import {
	type FlashcardMachineContext,
	flashcardReducer,
	getAverageQuality,
	getCurrentCard,
	getCurrentSRS,
	getFlashcardStatus
} from './flashcardMachine'

/**
 * View state returned by the hook
 *
 * This is what components will use for rendering.
 */
export interface FlashcardViewState {
	exercise: FlashcardExercise
	currentCard: FlashCard | null
	currentSRS: SRSData | null
	isFlipped: boolean
	isRated: boolean
	lastRating: QualityRating | null
	status: FlashcardStatus
	progress: {
		current: number
		total: number
		reviewedToday: number
	}
	stats: {
		correct: number
		incorrect: number
		dueToday: number
	}
	startedAt: number
	isLoading: boolean
}

/**
 * Hook for managing flashcard exercise sessions
 *
 * @param exercise - Flashcard exercise to review
 * @param onComplete - Callback when session is completed
 * @returns View state and action handlers
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: Main hook with initialization and handlers
export function useFlashcardExercise(
	exercise: FlashcardExercise,
	onComplete?: (result: Omit<FlashcardExerciseResult, 'completedAt'>) => void
) {
	const [context, dispatch] = useReducer(flashcardReducer, {
		exercise,
		srsData: [],
		currentCardIndex: 0,
		reviewedCards: new Set(),
		correctCards: new Set(),
		qualityRatings: new Map(),
		isFlipped: false,
		isRated: false,
		lastRating: null,
		startedAt: Date.now()
	} as FlashcardMachineContext)

	const isLoadingRef = useRef(true)
	const completionHandledRef = useRef(false)

	// Load SRS data on mount
	useEffect(() => {
		async function loadProgress() {
			try {
				isLoadingRef.current = true

				// Load existing progress from IndexedDB
				const existingSRS = await flashcardStorage.loadExerciseProgress(
					exercise.id
				)

				// Create SRS map for quick lookup
				const srsMap = new Map(existingSRS.map(s => [s.cardId, s]))

				// Initialize SRS data for all cards
				const completeSRS: SRSData[] = exercise.cards.map(
					card => srsMap.get(card.id) || initializeSRSData(card.id, exercise.id)
				)

				// Get due cards sorted by priority
				const dueCards = getDueCards(completeSRS)

				// Initialize machine with due cards
				dispatch({type: 'INIT', srsData: dueCards})

				isLoadingRef.current = false
			} catch {
				isLoadingRef.current = false
			}
		}

		loadProgress().catch(() => {
			// Intentionally ignore errors - component will show loading state
		})
	}, [exercise.id, exercise.cards])

	// Handle flip action
	const handleFlip = useCallback(() => {
		dispatch({type: 'FLIP'})
	}, [])

	// Handle rate action
	const handleRate = useCallback(
		async (quality: QualityRating) => {
			const currentSRS = getCurrentSRS(context)
			if (!currentSRS) return

			// Update context with rating
			dispatch({type: 'RATE', quality})

			// Calculate next review using SM-2
			const updatedSRS = calculateNextReview(
				currentSRS,
				quality,
				exercise.srsSettings
			)

			// Save to IndexedDB
			try {
				await flashcardStorage.saveCardProgress(updatedSRS)
			} catch {
				// Silently ignore save errors - user can still continue
			}

			// Auto-advance to next card if enabled
			if (context.exercise.settings?.autoAdvance !== false) {
				const delay =
					context.exercise.settings?.autoAdvanceDelayMs ??
					DEFAULT_FLASHCARD_SETTINGS.autoAdvanceDelayMs
				setTimeout(() => {
					dispatch({type: 'NEXT'})
				}, delay)
			}
		},
		[context, exercise.srsSettings]
	)

	// Handle skip action
	const handleSkip = useCallback(() => {
		dispatch({type: 'SKIP'})
	}, [])

	// Handle next action (manual advance)
	const handleNext = useCallback(() => {
		dispatch({type: 'NEXT'})
	}, [])

	// Handle restart action
	const handleRestart = useCallback(() => {
		completionHandledRef.current = false
		dispatch({type: 'RESTART'})
	}, [])

	// Handle completion
	useEffect(() => {
		const status = getFlashcardStatus(context)

		// Only call onComplete if user actually reviewed cards
		// Don't call it if there were no cards due to begin with
		if (
			status === 'COMPLETED' &&
			!completionHandledRef.current &&
			context.reviewedCards.size > 0
		) {
			completionHandledRef.current = true

			const result: Omit<FlashcardExerciseResult, 'completedAt'> = {
				exerciseId: exercise.id,
				reviewedCards: context.reviewedCards.size,
				correctCards: context.correctCards.size,
				averageQuality: getAverageQuality(context),
				totalTimeSpentMs: Date.now() - context.startedAt
			}

			onComplete?.(result)
		}
	}, [context, exercise.id, onComplete])

	// Build view state
	const viewState: FlashcardViewState = {
		exercise: context.exercise,
		currentCard: getCurrentCard(context),
		currentSRS: getCurrentSRS(context),
		isFlipped: context.isFlipped,
		isRated: context.isRated,
		lastRating: context.lastRating,
		status: getFlashcardStatus(context),
		progress: {
			current: context.currentCardIndex + 1,
			total: context.srsData.length,
			reviewedToday: context.reviewedCards.size
		},
		stats: {
			correct: context.correctCards.size,
			incorrect: context.reviewedCards.size - context.correctCards.size,
			dueToday: context.srsData.length
		},
		startedAt: context.startedAt,
		isLoading: isLoadingRef.current
	}

	const handleSettingsChange = useCallback(
		(newSettings: Partial<import('@/shared/model').FlashcardSettings>) => {
			// Check if any setting that requires reload changed
			const requiresReload = 'shuffleCards' in newSettings

			if (requiresReload) {
				// Settings that require reload - restart the exercise
				const updatedExercise = {
					...exercise,
					settings: {
						...exercise.settings,
						...newSettings
					}
				}
				dispatch({type: 'RESTART_WITH_SETTINGS', exercise: updatedExercise})
			} else {
				// Settings that don't require reload (like autoAdvance) - just update settings
				// This preserves the current progress while updating settings
				dispatch({type: 'UPDATE_SETTINGS', settings: newSettings})
			}
		},
		[exercise]
	)

	return {
		state: viewState,
		handleFlip,
		handleRate,
		handleSkip,
		handleNext,
		handleRestart,
		handleSettingsChange
	}
}
