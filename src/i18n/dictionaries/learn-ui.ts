import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const tableViewTranslations = createTranslationDictionary([
	'exerciseStructure',
	'block',
	'case',
	'prompt',
	'answer',
	'hint',
	'ui.hashSymbol',
	'ui.emptyHint',
	'exercise.difficulty',
	'exercise.minutes',
	'exercise.blocks',
	'exercise.cases',
	'ui.clockIcon',
	'ui.booksIcon',
	'ui.notesIcon',
	'ui.colon'
] as const)

export type TableViewTranslationKey = DictionaryKeys<
	typeof tableViewTranslations
>

export const jsonViewTranslations = createTranslationDictionary([
	'copyJson',
	'jsonCopied',
	'copyFailed',
	'success',
	'error',
	'copy'
] as const)

export type JsonViewTranslationKey = DictionaryKeys<typeof jsonViewTranslations>

export const viewToggleTranslations = createTranslationDictionary([
	'jsonView',
	'tableView'
] as const)

export type ViewToggleTranslationKey = DictionaryKeys<
	typeof viewToggleTranslations
>
