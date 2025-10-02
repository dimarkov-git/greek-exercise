/**
 * Flashcard exercise translations
 */

import {createTranslationRegistry} from '@/shared/lib/i18n'

export const flashcardTranslations = createTranslationRegistry({
	// Quality rating buttons
	'flashcard.again': {
		en: 'Again',
		ru: 'Снова'
	},
	'flashcard.hard': {
		en: 'Hard',
		ru: 'Сложно'
	},
	'flashcard.good': {
		en: 'Good',
		ru: 'Хорошо'
	},
	'flashcard.easy': {
		en: 'Easy',
		ru: 'Легко'
	},

	// Rating prompt
	'flashcard.rateQuality': {
		en: 'Rate your answer',
		ru: 'Оцените ваш ответ'
	},

	// Completion screen
	'flashcard.reviewComplete': {
		en: 'Review Complete!',
		ru: 'Повторение завершено!'
	},
	'flashcard.reviewedCards': {
		en: 'Reviewed cards',
		ru: 'Повторено карточек'
	},
	'flashcard.accuracy': {
		en: 'Accuracy',
		ru: 'Точность'
	},
	'flashcard.averageQuality': {
		en: 'Average quality',
		ru: 'Средняя оценка'
	},
	'flashcard.reviewAgain': {
		en: 'Review Again',
		ru: 'Повторить снова'
	},

	// Learn view
	'flashcard.cards': {
		en: 'cards',
		ru: 'карточек'
	},
	'flashcard.front': {
		en: 'Front',
		ru: 'Лицевая сторона'
	},
	'flashcard.back': {
		en: 'Back',
		ru: 'Обратная сторона'
	},
	'flashcard.hint': {
		en: 'Hint',
		ru: 'Подсказка'
	},
	'flashcard.srsStatistics': {
		en: 'SRS Statistics',
		ru: 'Статистика SRS'
	},

	// Common
	'common.backToLibrary': {
		en: 'Back to Library',
		ru: 'Вернуться к библиотеке'
	}
})
