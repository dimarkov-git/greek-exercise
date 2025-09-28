import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const exerciseBuilderTranslations = createTranslationDictionary([
	'exerciseBuilder',
	'exerciseBuilderDesc',
	'ui.toolsEmoji',
	'comingSoon',
	'ui.backToHome',
	'builder.libraryInfo',
	'builder.openLibrary',
	'builder.typeSectionTitle',
	'builder.typeHelp',
	'builder.wordFormType',
	'builder.jsonEditorHelp',
	'builder.jsonEditorTitle',
	'builder.formatJson',
	'builder.resetTemplate',
	'builder.saveToLibrary',
	'builder.saveSuccess',
	'builder.saveError',
	'builder.validationTitle',
	'builder.validationError',
	'builder.validationSuccess',
	'builder.validationHint',
	'builder.validationUnknown',
	'builder.validationEmpty',
	'builder.parseError',
	'builder.previewTitle',
	'builder.previewUnavailable',
	'builder.previewUnavailableHint',
	'builder.savedExercisesTitle',
	'builder.noSavedExercises',
	'builder.loadButton',
	'builder.deleteButton',
	'builder.lastUpdated',
	'builder.customBadge',
	'ui.hashSymbol'
] as const)

export type ExerciseBuilderTranslationKey = DictionaryKeys<
	typeof exerciseBuilderTranslations
>
