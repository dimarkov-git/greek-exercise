/**
 * Multiple-choice exercise translations
 */

import type {TranslationDictionary} from '@/shared/lib/i18n'

export const multipleChoiceTranslations = {
	'multipleChoice.selectAnswer': 'multipleChoice.selectAnswer',
	'multipleChoice.checkAnswer': 'multipleChoice.checkAnswer',
	'multipleChoice.next': 'multipleChoice.next',
	'multipleChoice.skip': 'multipleChoice.skip',
	'multipleChoice.correct': 'multipleChoice.correct',
	'multipleChoice.incorrect': 'multipleChoice.incorrect',
	'multipleChoice.hint': 'multipleChoice.hint',
	'multipleChoice.showHint': 'multipleChoice.showHint',
	'multipleChoice.hideHint': 'multipleChoice.hideHint'
} as const satisfies TranslationDictionary

export const multipleChoiceCompletionTranslations = {
	'multipleChoice.completed': 'multipleChoice.completed',
	'multipleChoice.yourScore': 'multipleChoice.yourScore',
	'multipleChoice.correctAnswers': 'multipleChoice.correctAnswers',
	'multipleChoice.incorrectAnswers': 'multipleChoice.incorrectAnswers',
	'multipleChoice.skippedQuestions': 'multipleChoice.skippedQuestions',
	'multipleChoice.accuracy': 'multipleChoice.accuracy',
	'multipleChoice.tryAgain': 'multipleChoice.tryAgain',
	'common.backToLibrary': 'common.backToLibrary'
} as const satisfies TranslationDictionary
