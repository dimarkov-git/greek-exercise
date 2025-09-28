import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const exerciseUiTranslations = createTranslationDictionary([
	'exercise.accuracy',
	'exercise.autoAdvance',
	'exercise.autoAdvanceDisabled',
	'exercise.autoAdvanceDisabledIcon',
	'exercise.autoAdvanceEnabled',
	'exercise.autoAdvanceEnabledIcon',
	'exercise.backArrow',
	'exercise.backToLibrary',
	'exercise.blocks',
	'exercise.cases',
	'exercise.celebrationEmoji',
	'exercise.checking',
	'exercise.congratulations',
	'exercise.continue',
	'exercise.correct',
	'exercise.correctAnswerIs',
	'exercise.correctAnswers',
	'exercise.correctIcon',
	'exercise.difficulty',
	'exercise.enterCorrectAnswer',
	'exercise.enterCorrectAnswerToContinue',
	'exercise.enterCorrectToContinue',
	'exercise.enterKey',
	'exercise.enterKeyName',
	'exercise.exclamationMark',
	'exercise.hintIcon',
	'exercise.incorrect',
	'exercise.incorrectAnswers',
	'exercise.incorrectIcon',
	'exercise.minutes',
	'exercise.notImplemented',
	'exercise.percentSymbol',
	'exercise.pressEnterToContinue',
	'exercise.progress',
	'exercise.progressOf',
	'exercise.restartExercise',
	'exercise.returnToLibrary',
	'exercise.secondsSymbol',
	'exercise.skip',
	'exercise.submit',
	'exercise.time',
	'exercise.unsupportedType',
	'exercise.yourAnswerIs',
	'error.couldNotLoadExercise',
	'error.title'
] as const)

export type ExerciseUiTranslationKey = DictionaryKeys<
	typeof exerciseUiTranslations
>
