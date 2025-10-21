/**
 * Flashcard exercise types and interfaces
 *
 * This module defines the data structures for flashcard exercises with
 * Spaced Repetition System (SRS) using the SM-2 algorithm.
 */

import type {
	Difficulty,
	Language,
	PartialExerciseSettings
} from '@/shared/model'

type I18nText = Partial<Record<Language, string>>

/**
 * Individual flashcard
 *
 * A flashcard has a front (question) in Greek and a back (translation) in multiple languages.
 * The back translation is displayed directly without tooltip hints.
 */
export interface FlashCard {
	/** Unique card identifier */
	id: string
	/** Front of card (question) in Greek */
	front: string
	/** Back translation in multiple languages */
	backHintI18n: I18nText
}

/**
 * Spaced Repetition System settings
 *
 * Controls how many cards to review per session and graduation intervals.
 * Based on Anki's default settings.
 */
export interface SRSSettings {
	/** Maximum new cards per session (default: 20) */
	newCardsPerDay: number
	/** Maximum reviews per session (default: 100) */
	reviewsPerDay: number
	/** Days until card graduates from learning (default: 1) */
	graduatingInterval: number
	/** Days for easy button on new cards (default: 4) */
	easyInterval: number
}

/**
 * Default SRS settings
 */
export const DEFAULT_SRS_SETTINGS: Required<SRSSettings> = {
	newCardsPerDay: 20,
	reviewsPerDay: 100,
	graduatingInterval: 1,
	easyInterval: 4
} as const

/**
 * Complete flashcard exercise
 *
 * Contains all flashcards and SRS settings for the exercise.
 */
export interface FlashcardExercise {
	/** Whether exercise is enabled */
	enabled: boolean
	/** Unique exercise identifier */
	id: string
	/** Exercise type discriminator */
	type: 'flashcard'
	/** Primary language of the exercise */
	language: Language
	/** Title in Greek */
	title: string
	/** Title translations */
	titleI18n?: I18nText
	/** Description in Greek */
	description: string
	/** Description translations */
	descriptionI18n?: I18nText
	/** Tags for filtering */
	tags?: string[]
	/** Difficulty level */
	difficulty: Difficulty
	/** Exercise settings (auto-advance, etc.) */
	settings?: PartialExerciseSettings
	/** All flashcards in the exercise */
	cards: FlashCard[]
	/** SRS-specific settings */
	srsSettings?: Partial<SRSSettings>
}

/**
 * Card state in SRS system
 *
 * Tracks a card's learning progress through different stages.
 */
export type CardState = 'new' | 'learning' | 'review' | 'relearning'

/**
 * SRS data for a single card
 *
 * This data is persisted in IndexedDB and tracks the card's review history
 * according to the SM-2 algorithm.
 */
export interface SRSData {
	/** Card identifier */
	cardId: string
	/** Exercise identifier */
	exerciseId: string
	/** Ease factor (1.3 - 2.5+, default 2.5) - affects interval growth */
	easeFactor: number
	/** Current interval in days until next review */
	interval: number
	/** Number of successful reviews in a row */
	repetitions: number
	/** Last review timestamp */
	lastReview: Date | null
	/** Next review timestamp (card is due when current time >= this) */
	nextReview: Date | null
	/** Current learning state */
	state: CardState
}

/**
 * User quality rating (SM-2 scale)
 *
 * Used to rate how well the user remembered the card:
 * - 0: Complete blackout (not used in simplified version)
 * - 1: Again - Incorrect, show again soon
 * - 2: Hard - Correct but difficult, shorter interval
 * - 3: Good - Correct with effort, normal interval
 * - 4: Easy - Correct easily, longer interval
 * - 5: Perfect - Not used in simplified version (combined with Easy)
 */
export type QualityRating = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Quality rating labels for UI
 */
export const QUALITY_LABELS = {
	0: 'blackout',
	1: 'again',
	2: 'hard',
	3: 'good',
	4: 'easy',
	5: 'perfect'
} as const

/**
 * Flashcard state during session
 *
 * Tracks the current card being reviewed and session progress.
 */
export interface FlashcardState {
	/** Index of current card in due cards array */
	currentCardIndex: number
	/** Whether card is flipped to show answer */
	isFlipped: boolean
	/** Number of cards reviewed in this session */
	reviewedToday: number
	/** Number of correct answers in this session */
	correctToday: number
	/** Total number of cards in exercise */
	totalCards: number
	/** Number of cards due for review today */
	dueCards: number
	/** Current status of the flashcard session */
	status: FlashcardStatus
}

/**
 * Flashcard session status
 *
 * Represents the current state of the review session.
 */
export type FlashcardStatus =
	| 'SHOWING_FRONT' // Showing card front, waiting for flip
	| 'SHOWING_BACK' // Card flipped, showing back, waiting for rating
	| 'RATING' // User is rating the answer
	| 'COMPLETED' // All due cards reviewed

/**
 * Single card review result
 *
 * Records the outcome of reviewing one card.
 */
export interface FlashcardReviewResult {
	/** Card identifier */
	cardId: string
	/** User's quality rating */
	quality: QualityRating
	/** Whether answer was correct (quality >= 3) */
	wasCorrect: boolean
	/** Time spent on this card in milliseconds */
	timeSpentMs: number
	/** Next review date calculated by SM-2 */
	nextReview: Date
}

/**
 * Exercise session completion result
 *
 * Summary of the entire review session.
 */
export interface FlashcardExerciseResult {
	/** Exercise identifier */
	exerciseId: string
	/** Number of cards reviewed in session */
	reviewedCards: number
	/** Number of correct answers (quality >= 3) */
	correctCards: number
	/** Average quality rating across all cards */
	averageQuality: number
	/** Total time spent in session */
	totalTimeSpentMs: number
	/** Session completion timestamp */
	completedAt: Date
}

/**
 * Statistics for an exercise
 *
 * Overview of progress across all cards in the exercise.
 */
export interface FlashcardExerciseStats {
	/** Total number of cards */
	total: number
	/** Number of new (never reviewed) cards */
	new: number
	/** Number of cards in learning state */
	learning: number
	/** Number of cards in review state */
	review: number
	/** Number of cards due today */
	dueToday: number
}

/**
 * JSON serialization type for flashcard exercises
 */
export interface FlashcardExerciseJSON {
	enabled: boolean
	id: string
	type: 'flashcard'
	language: Language
	title: string
	titleI18n?: I18nText
	description: string
	descriptionI18n?: I18nText
	tags: string[]
	difficulty: Difficulty
	settings: import('@/shared/model').ExerciseSettings
	cards: FlashCard[]
	srsSettings: Required<SRSSettings>
}

/**
 * Get SRS settings with defaults applied
 */
export function getSRSSettings(
	exercise: FlashcardExercise
): Required<SRSSettings> {
	const settings = exercise.srsSettings
	return {
		newCardsPerDay:
			settings?.newCardsPerDay ?? DEFAULT_SRS_SETTINGS.newCardsPerDay,
		reviewsPerDay:
			settings?.reviewsPerDay ?? DEFAULT_SRS_SETTINGS.reviewsPerDay,
		graduatingInterval:
			settings?.graduatingInterval ?? DEFAULT_SRS_SETTINGS.graduatingInterval,
		easyInterval: settings?.easyInterval ?? DEFAULT_SRS_SETTINGS.easyInterval
	}
}

/**
 * Convert flashcard exercise to serializable JSON
 */
export function flashcardExerciseToJSON(
	exercise: FlashcardExercise
): FlashcardExerciseJSON {
	const result: FlashcardExerciseJSON = {
		enabled: exercise.enabled,
		id: exercise.id,
		type: exercise.type,
		language: exercise.language,
		title: exercise.title,
		description: exercise.description,
		tags: exercise.tags || [],
		difficulty: exercise.difficulty,
		settings: {
			autoAdvance: exercise.settings?.autoAdvance ?? true,
			autoAdvanceDelayMs: exercise.settings?.autoAdvanceDelayMs ?? 1500,
			allowSkip: exercise.settings?.allowSkip ?? false,
			shuffleCases: exercise.settings?.shuffleCases ?? false
		},
		cards: exercise.cards,
		srsSettings: getSRSSettings(exercise)
	}

	if (exercise.titleI18n) {
		result.titleI18n = exercise.titleI18n
	}

	if (exercise.descriptionI18n) {
		result.descriptionI18n = exercise.descriptionI18n
	}

	return result
}
