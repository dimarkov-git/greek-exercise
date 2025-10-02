/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Implementation of the SuperMemo 2 (SM-2) algorithm for flashcard scheduling.
 * Original algorithm by Piotr Wozniak (1987).
 *
 * @see https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

import type {QualityRating, SRSData, SRSSettings} from '@/entities/exercise'

/**
 * Default SRS settings matching Anki defaults
 */
const DEFAULT_SETTINGS: Required<SRSSettings> = {
	newCardsPerDay: 20,
	reviewsPerDay: 100,
	graduatingInterval: 1,
	easyInterval: 4
}

/**
 * Initialize SRS data for a new card
 *
 * @param cardId - Unique card identifier
 * @param exerciseId - Exercise identifier
 * @returns Initial SRS data with default values
 */
export function initializeSRSData(cardId: string, exerciseId: string): SRSData {
	return {
		cardId,
		exerciseId,
		easeFactor: 2.5, // Default ease factor (SM-2 standard)
		interval: 0,
		repetitions: 0,
		lastReview: null,
		nextReview: new Date(), // Due immediately for new cards
		state: 'new'
	}
}

/**
 * Calculate next review date based on SM-2 algorithm
 *
 * The SM-2 algorithm calculates the next review interval based on:
 * - Quality rating (0-5): How well the user remembered
 * - Ease factor (1.3-2.5+): Card-specific difficulty multiplier
 * - Repetitions: Number of successful reviews in a row
 *
 * @param srsData - Current SRS data for the card
 * @param quality - User's quality rating (0-5)
 * @param settings - Optional SRS settings (uses defaults if not provided)
 * @returns Updated SRS data with new interval and next review date
 */
export function calculateNextReview(
	srsData: SRSData,
	quality: QualityRating,
	settings: Partial<SRSSettings> = {}
): SRSData {
	const now = new Date()
	const mergedSettings = {...DEFAULT_SETTINGS, ...settings}

	// Clone current data to avoid mutation
	const updated: SRSData = {
		...srsData,
		lastReview: now
	}

	// Update ease factor using SM-2 formula
	// EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
	// This makes cards easier/harder based on performance
	const easeDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
	const newEaseFactor = Math.max(1.3, updated.easeFactor + easeDelta)
	updated.easeFactor = newEaseFactor

	// Calculate interval based on quality
	if (quality < 3) {
		// Incorrect or hard - restart learning
		updated.repetitions = 0
		updated.interval = 0
		updated.state = updated.state === 'new' ? 'learning' : 'relearning'
		updated.nextReview = now // Show again immediately (or soon)
	} else {
		// Correct response - increase interval
		updated.repetitions += 1

		if (updated.repetitions === 1) {
			// First successful review
			updated.interval = mergedSettings.graduatingInterval
			updated.state = 'learning'
		} else if (updated.repetitions === 2) {
			// Second successful review - graduate to review
			updated.interval = mergedSettings.easyInterval
			updated.state = 'review'
		} else {
			// Subsequent reviews - use ease factor
			updated.interval = Math.round(updated.interval * updated.easeFactor)
			updated.state = 'review'
		}

		// Easy bonus: quality 4-5 get longer intervals
		if (quality >= 4 && updated.repetitions >= 2) {
			updated.interval = Math.round(updated.interval * 1.3)
		}

		// Calculate next review date
		const nextReview = new Date(now)
		nextReview.setDate(nextReview.getDate() + updated.interval)
		updated.nextReview = nextReview
	}

	return updated
}

/**
 * Check if a card is due for review
 *
 * @param srsData - SRS data for the card
 * @param now - Current timestamp (defaults to now)
 * @returns True if card should be reviewed
 */
export function isCardDue(srsData: SRSData, now: Date = new Date()): boolean {
	if (!srsData.nextReview) return true // New cards are always due
	return srsData.nextReview <= now
}

/**
 * Get cards due for review, sorted by priority
 *
 * Priority order:
 * 1. Overdue cards (most overdue first)
 * 2. New cards
 * 3. Learning cards
 * 4. Review cards
 *
 * @param allSRSData - Array of all SRS data
 * @param now - Current timestamp (defaults to now)
 * @returns Filtered and sorted array of due cards
 */
export function getDueCards(
	allSRSData: SRSData[],
	now: Date = new Date()
): SRSData[] {
	return allSRSData
		.filter(data => isCardDue(data, now))
		.sort((a, b) => {
			// Priority: higher number = higher priority
			const priorityA = getCardPriority(a, now)
			const priorityB = getCardPriority(b, now)
			return priorityB - priorityA
		})
}

/**
 * Calculate card priority for sorting
 *
 * @param srsData - SRS data for the card
 * @param now - Current timestamp
 * @returns Priority score (higher = more urgent)
 */
function getCardPriority(srsData: SRSData, now: Date): number {
	if (!srsData.nextReview) return 100 // New cards have high priority

	// Calculate how many days overdue
	const daysOverdue = Math.floor(
		(now.getTime() - srsData.nextReview.getTime()) / (1000 * 60 * 60 * 24)
	)

	// Overdue cards have highest priority
	if (daysOverdue > 0) return 1000 + daysOverdue

	// State-based priority for due (but not overdue) cards
	if (srsData.state === 'new') return 100
	if (srsData.state === 'learning' || srsData.state === 'relearning') return 50

	return 10 // Review cards have lowest priority
}

/**
 * Get statistics about card states
 *
 * @param allSRSData - Array of all SRS data
 * @param now - Current timestamp (defaults to now)
 * @returns Statistics object with counts by state
 */
export function getSRSStatistics(
	allSRSData: SRSData[],
	now: Date = new Date()
): {
	total: number
	new: number
	learning: number
	review: number
	dueToday: number
	averageEaseFactor: number
} {
	const dueToday = allSRSData.filter(data => isCardDue(data, now)).length

	const totalEase = allSRSData.reduce((sum, data) => sum + data.easeFactor, 0)
	const averageEaseFactor =
		allSRSData.length > 0 ? totalEase / allSRSData.length : 2.5

	return {
		total: allSRSData.length,
		new: allSRSData.filter(d => d.state === 'new').length,
		learning: allSRSData.filter(
			d => d.state === 'learning' || d.state === 'relearning'
		).length,
		review: allSRSData.filter(d => d.state === 'review').length,
		dueToday,
		averageEaseFactor: Number.parseFloat(averageEaseFactor.toFixed(2))
	}
}
