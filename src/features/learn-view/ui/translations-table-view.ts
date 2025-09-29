import type {AutonomousTranslationDictionary} from '@/shared/lib/i18n'

export const translations = {
	exerciseStructure: 'exerciseStructure',
	block: 'block',
	prompt: 'prompt',
	answer: 'answer',
	hint: 'hint',
	hashSymbol: 'ui.hashSymbol',
	emptyHint: 'ui.emptyHint',
	difficulty: 'exercise.difficulty',
	minutes: 'exercise.minutes',
	blocks: 'exercise.blocks',
	cases: 'exercise.cases',
	clockIcon: 'ui.clockIcon',
	booksIcon: 'ui.booksIcon',
	notesIcon: 'ui.notesIcon',
	colon: 'ui.colon'
} as const satisfies AutonomousTranslationDictionary

export type TranslationKey = keyof typeof translations