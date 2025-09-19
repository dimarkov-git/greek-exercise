export type SupportedLanguage = 'en' | 'ru' | 'el'

export interface TranslationRequest {
	key: string
	fallback?: string
	language?: SupportedLanguage
}

export interface TranslationOptions {
	fictionalLanguage?: boolean
}

export interface TranslationResult {
	[key: string]: string
}

export interface TranslationsDatabase {
	en: Record<string, string>
	ru: Record<string, string>
	el: Record<string, string>
}

// Fictional language texts for missing translations
export const FICTIONAL_TEXTS = [
	// Quenya
	'Aiya! Nánë lanta na banána.',
	'Lómi canta!',

	// Sindarin
	'Hebo estel, mellon nîn, sui gell banana.',
	'Im ú-chenog i phith.',

	// Khuzdul
	'Baruk Khazâd! …baruk salad.',
	'Zigil-nargûn!',

	// Klingon
	'Qapla’! jIyajbe’.',
	'HIq vItlhutlhpu’ ‘ej jIghung.',

	// Dovahzul
	'Fus ro dah banana!',
	'Zu’u dovah, ahrk zu’u friik.',

	// Parseltongue
	'Ssshhhraka bananasss.',
	'Hhssss… snackss or friendsss?',

	// Dothraki
	'Anhaan vosecchi!',
	'Rhaeshisar athdrivar!',

	// High Valyrian
	'Vezof jin azantys.',
	'Ñuhyz zaldrīzes istan vūghagon.',

	// Na'vi
	'Kaltxì! Oe lu tìpawng.',
	'Oel ngati kameie… sì oel ngati mllte banana.',

	// Al Bhed
	'Yht E tuh’d ymm drec.',
	'Pnehk oui yht uhmo bnana!',

	// Simlish
	'Sul sul! Wibna dag dag!',
	'Shoo flee banana?',

	// Hylian
	'Yato! Rupee na bananu.',
	'Linko babo!',

	// Minionese
	'Bello! Me want bananaaaa!',
	'Tulaliloo ti amo gelato!',

	// Newspeak
	'Bellyfun banana.',
	'Doubleplusungood joke.',

	// Lojban
	'mi gleki .i mi citka bananu.',
	'do cmila mi .i xu do djuno fi le nu simlish?'
]

export function getRandomFictionalText(): string {
	const index = Math.floor(Math.random() * FICTIONAL_TEXTS.length)
	return FICTIONAL_TEXTS[index] ?? 'Unknown text'
}
