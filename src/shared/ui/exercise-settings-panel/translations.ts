/**
 * Translations for Exercise Settings Panel
 */

import type {TranslationDictionary} from '@/shared/lib/i18n'

export const exerciseSettingsTranslations = {
	'exerciseSettings.title': {
		translations: {en: 'Settings', ru: 'Настройки', el: 'Ρυθμίσεις'}
	},
	'exerciseSettings.description': {
		translations: {
			en: 'Modify settings and restart the exercise with new configuration.',
			ru: 'Измените настройки и перезапустите упражнение с новой конфигурацией.',
			el: 'Τροποποιήστε τις ρυθμίσεις και επανεκκινήστε την άσκηση με νέα διαμόρφωση.'
		}
	},
	'exerciseSettings.apply': {
		translations: {
			en: 'Apply & Restart',
			ru: 'Применить и перезапустить',
			el: 'Εφαρμογή & Επανεκκίνηση'
		}
	},
	'exerciseSettings.reset': {
		translations: {
			en: 'Reset to Defaults',
			ru: 'Сбросить к умолчаниям',
			el: 'Επαναφορά προεπιλογών'
		}
	},
	'exerciseSettings.cancel': {
		translations: {en: 'Cancel', ru: 'Отменить', el: 'Ακύρωση'}
	},
	'exerciseSettings.close': {
		translations: {en: 'Close', ru: 'Закрыть', el: 'Κλείσιμο'}
	},
	'exerciseSettings.autoAdvance': {
		translations: {
			en: 'Auto-advance',
			ru: 'Автоматический переход',
			el: 'Αυτόματη προώθηση'
		}
	},
	'exerciseSettings.autoAdvanceDesc': {
		translations: {
			en: 'Automatically move to next question after correct answer',
			ru: 'Автоматически переходить к следующему вопросу после правильного ответа',
			el: 'Αυτόματη μετάβαση στην επόμενη ερώτηση μετά από σωστή απάντηση'
		}
	},
	'exerciseSettings.autoAdvanceDelayMs': {
		translations: {
			en: 'Auto-advance delay (ms)',
			ru: 'Задержка автоперехода (мс)',
			el: 'Καθυστέρηση αυτόματης προώθησης (ms)'
		}
	},
	'exerciseSettings.autoAdvanceDelayMsDesc': {
		translations: {
			en: 'Delay before automatically moving to next question',
			ru: 'Задержка перед автоматическим переходом к следующему вопросу',
			el: 'Καθυστέρηση πριν την αυτόματη μετάβαση στην επόμενη ερώτηση'
		}
	},
	'exerciseSettings.allowSkip': {
		translations: {
			en: 'Allow skip',
			ru: 'Разрешить пропуск',
			el: 'Επιτρέπεται η παράλειψη'
		}
	},
	'exerciseSettings.allowSkipDesc': {
		translations: {
			en: 'Allow skipping questions during exercise',
			ru: 'Разрешить пропуск вопросов во время упражнения',
			el: 'Επιτρέπεται η παράλειψη ερωτήσεων κατά την άσκηση'
		}
	},
	'exerciseSettings.shuffleCases': {
		translations: {
			en: 'Shuffle questions',
			ru: 'Перемешать вопросы',
			el: 'Ανακάτεμα ερωτήσεων'
		}
	},
	'exerciseSettings.shuffleCasesDesc': {
		translations: {
			en: 'Randomize the order of questions',
			ru: 'Случайный порядок вопросов',
			el: 'Τυχαία σειρά ερωτήσεων'
		}
	},
	'exerciseSettings.shuffleBlocks': {
		translations: {
			en: 'Shuffle blocks',
			ru: 'Перемешать блоки',
			el: 'Ανακάτεμα μπλοκ'
		}
	},
	'exerciseSettings.shuffleBlocksDesc': {
		translations: {
			en: 'Randomize the order of exercise blocks',
			ru: 'Случайный порядок блоков упражнения',
			el: 'Τυχαία σειρά μπλοκ άσκησης'
		}
	},
	'exerciseSettings.allowSkipTone': {
		translations: {
			en: 'Accept without tone marks',
			ru: 'Принимать без ударений',
			el: 'Αποδοχή χωρίς τόνους'
		}
	},
	'exerciseSettings.allowSkipToneDesc': {
		translations: {
			en: 'Accept answers without tone marks (incorrect tone is still wrong)',
			ru: 'Принимать ответы без ударений (неправильное ударение все равно считается ошибкой)',
			el: 'Αποδοχή απαντήσεων χωρίς τόνους (ο λάθος τόνος εξακολουθεί να είναι λάθος)'
		}
	},
	'exerciseSettings.shuffleCards': {
		translations: {
			en: 'Shuffle cards',
			ru: 'Перемешать карточки',
			el: 'Ανακάτεμα καρτών'
		}
	},
	'exerciseSettings.shuffleCardsDesc': {
		translations: {
			en: 'Randomize the order of flashcards',
			ru: 'Случайный порядок карточек',
			el: 'Τυχαία σειρά καρτών'
		}
	},
	'exerciseSettings.shuffleQuestions': {
		translations: {
			en: 'Shuffle questions',
			ru: 'Перемешать вопросы',
			el: 'Ανακάτεμα ερωτήσεων'
		}
	},
	'exerciseSettings.shuffleQuestionsDesc': {
		translations: {
			en: 'Randomize the order of questions',
			ru: 'Случайный порядок вопросов',
			el: 'Τυχαία σειρά ερωτήσεων'
		}
	},
	'exerciseSettings.shuffleAnswers': {
		translations: {
			en: 'Shuffle answers',
			ru: 'Перемешать варианты ответа',
			el: 'Ανακάτεμα απαντήσεων'
		}
	},
	'exerciseSettings.shuffleAnswersDesc': {
		translations: {
			en: 'Randomize the order of answer options',
			ru: 'Случайный порядок вариантов ответа',
			el: 'Τυχαία σειρά επιλογών απάντησης'
		}
	}
} satisfies TranslationDictionary
