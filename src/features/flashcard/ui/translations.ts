/**
 * Flashcard exercise translations
 */

import type {TranslationDictionary} from '@/shared/lib/i18n'

export const flashcardRatingTranslations = {
	'flashcard.again': 'flashcard.again',
	'flashcard.hard': 'flashcard.hard',
	'flashcard.good': 'flashcard.good',
	'flashcard.easy': 'flashcard.easy',
	'flashcard.rateQuality': 'flashcard.rateQuality'
} as const satisfies TranslationDictionary

export const flashcardCompletionTranslations = {
	'flashcard.reviewComplete': 'flashcard.reviewComplete',
	'flashcard.reviewedCards': 'flashcard.reviewedCards',
	'flashcard.accuracy': 'flashcard.accuracy',
	'flashcard.averageQuality': 'flashcard.averageQuality',
	'flashcard.reviewAgain': 'flashcard.reviewAgain',
	'common.backToLibrary': 'common.backToLibrary'
} as const satisfies TranslationDictionary

export const flashcardLearnViewTranslations = {
	'flashcard.cards': 'flashcard.cards',
	'flashcard.front': 'flashcard.front',
	'flashcard.back': 'flashcard.back',
	'flashcard.hint': 'flashcard.hint',
	'flashcard.srsStatistics': 'flashcard.srsStatistics',
	'flashcard.total': 'flashcard.total',
	'flashcard.new': 'flashcard.new',
	'flashcard.learning': 'flashcard.learning',
	'flashcard.review': 'flashcard.review',
	'flashcard.dueToday': 'flashcard.dueToday'
} as const satisfies TranslationDictionary
