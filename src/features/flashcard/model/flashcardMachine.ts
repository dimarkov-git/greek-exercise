/**
 * Flashcard state machine
 *
 * Manages the state transitions for flashcard review sessions.
 * Uses a reducer pattern similar to Redux/useReducer.
 */

import type {
	FlashCard,
	FlashcardExercise,
	FlashcardStatus,
	QualityRating,
	SRSData
} from '@/entities/exercise'

/**
 * Events that can occur during a flashcard session
 */
export type FlashcardEvent =
	| {type: 'INIT'; srsData: SRSData[]}
	| {type: 'FLIP'}
	| {type: 'RATE'; quality: QualityRating}
	| {type: 'NEXT'}
	| {type: 'SKIP'}
	| {type: 'RESTART'}

/**
 * Internal state machine context
 *
 * This is the complete state managed by the reducer.
 */
export interface FlashcardMachineContext {
	exercise: FlashcardExercise
	srsData: SRSData[]
	currentCardIndex: number
	reviewedCards: Set<string>
	correctCards: Set<string>
	qualityRatings: Map<string, QualityRating>
	isFlipped: boolean
	startedAt: number
}

/**
 * Flashcard state machine reducer
 *
 * @param context - Current machine context
 * @param event - Event to process
 * @returns Updated machine context
 */
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: State machine with many branches
export function flashcardReducer(
	context: FlashcardMachineContext,
	event: FlashcardEvent
): FlashcardMachineContext {
	switch (event.type) {
		case 'INIT':
			return {
				...context,
				srsData: event.srsData,
				currentCardIndex: 0,
				reviewedCards: new Set(),
				correctCards: new Set(),
				qualityRatings: new Map(),
				isFlipped: false,
				startedAt: Date.now()
			}

		case 'FLIP':
			return {
				...context,
				isFlipped: true
			}

		case 'RATE': {
			const currentSRS = context.srsData[context.currentCardIndex]
			if (!currentSRS) return context

			const wasCorrect = event.quality >= 3

			// Update reviewed and correct cards
			const reviewedCards = new Set(context.reviewedCards)
			reviewedCards.add(currentSRS.cardId)

			const correctCards = new Set(context.correctCards)
			if (wasCorrect) {
				correctCards.add(currentSRS.cardId)
			}

			// Store quality rating
			const qualityRatings = new Map(context.qualityRatings)
			qualityRatings.set(currentSRS.cardId, event.quality)

			return {
				...context,
				reviewedCards,
				correctCards,
				qualityRatings
			}
		}

		case 'NEXT': {
			const nextIndex = context.currentCardIndex + 1
			return {
				...context,
				currentCardIndex: nextIndex,
				isFlipped: false
			}
		}

		case 'SKIP': {
			const currentSRS = context.srsData[context.currentCardIndex]
			if (!currentSRS) return context

			// Mark as reviewed but not correct
			const reviewedCards = new Set(context.reviewedCards)
			reviewedCards.add(currentSRS.cardId)

			const nextIndex = context.currentCardIndex + 1
			return {
				...context,
				currentCardIndex: nextIndex,
				isFlipped: false,
				reviewedCards
			}
		}

		case 'RESTART':
			return {
				...context,
				currentCardIndex: 0,
				reviewedCards: new Set(),
				correctCards: new Set(),
				qualityRatings: new Map(),
				isFlipped: false,
				startedAt: Date.now()
			}

		default:
			return context
	}
}

/**
 * Get current status from context
 *
 * @param context - Machine context
 * @returns Current flashcard status
 */
export function getFlashcardStatus(
	context: FlashcardMachineContext
): FlashcardStatus {
	const dueCards = context.srsData.length

	// Check if all cards reviewed
	if (context.currentCardIndex >= dueCards) {
		return 'COMPLETED'
	}

	// Check if card is flipped
	if (context.isFlipped) {
		return 'SHOWING_BACK'
	}

	return 'SHOWING_FRONT'
}

/**
 * Get current card from context
 *
 * @param context - Machine context
 * @returns Current flashcard or null if completed
 */
export function getCurrentCard(
	context: FlashcardMachineContext
): FlashCard | null {
	const currentSRS = context.srsData[context.currentCardIndex]
	if (!currentSRS) return null

	return (
		context.exercise.cards.find(card => card.id === currentSRS.cardId) || null
	)
}

/**
 * Get current SRS data from context
 *
 * @param context - Machine context
 * @returns Current SRS data or null if completed
 */
export function getCurrentSRS(
	context: FlashcardMachineContext
): SRSData | null {
	return context.srsData[context.currentCardIndex] || null
}

/**
 * Calculate average quality rating
 *
 * @param context - Machine context
 * @returns Average quality (0-5) or 0 if no ratings
 */
export function getAverageQuality(context: FlashcardMachineContext): number {
	if (context.qualityRatings.size === 0) return 0

	const sum = Array.from(context.qualityRatings.values()).reduce(
		(acc: number, val) => acc + val,
		0 as number
	)

	return Number.parseFloat((sum / context.qualityRatings.size).toFixed(2))
}
