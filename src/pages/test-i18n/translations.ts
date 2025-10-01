/**
 * Autonomous translation dictionary for test-i18n page
 *
 * Demonstrates simplified API:
 * - String format: 'key' → service key (requests translation, key as fallback)
 * - Object format: { key, translations?, fallback?, defaultLanguage? }
 */
export const translations = {
	// Simple format - just service keys
	pageTitle: 'testI18n.pageTitle',
	pageDescription: 'testI18n.pageDescription',

	// With inline translations for offline use
	currentLanguage: {
		key: 'testI18n.currentLanguage',
		translations: {
			en: 'Current Language',
			el: 'Τρέχουσα Γλώσσα',
			ru: 'Текущий язык'
		}
	},

	translationStatus: {
		key: 'testI18n.translationStatus',
		translations: {
			en: 'Translation Status',
			el: 'Κατάσταση Μετάφρασης',
			ru: 'Статус перевода'
		}
	},

	systemBenefits: {
		key: 'testI18n.systemBenefits',
		translations: {
			en: 'Autonomous Translation System',
			el: 'Αυτόνομο Σύστημα Μετάφρασης',
			ru: 'Автономная система переводов'
		}
	},

	benefitsSubtext: {
		key: 'testI18n.benefitsSubtext',
		translations: {
			en: 'Simple API • Works offline • Type-safe',
			el: 'Απλό API • Λειτουργεί χωρίς σύνδεση • Ασφαλές τύπων',
			ru: 'Простой API • Работает офлайн • Типобезопасный'
		}
	},

	// Scenario titles
	basicTitle: {
		key: 'testI18n.basicTitle',
		translations: {
			en: 'Basic Translation',
			el: 'Βασική Μετάφραση',
			ru: 'Базовый перевод'
		}
	},

	statusTitle: {
		key: 'testI18n.statusTitle',
		translations: {
			en: 'Status',
			el: 'Κατάσταση',
			ru: 'Статус'
		}
	},

	// Content
	basicGreeting: {
		key: 'testI18n.basicGreeting',
		translations: {
			en: 'Hello and welcome!',
			el: 'Γεια σας και καλώς ήρθατε!',
			ru: 'Здравствуйте и добро пожаловать!'
		}
	},

	basicWelcome: {
		key: 'testI18n.basicWelcome',
		translations: {
			en: 'This is a demonstration of the simplified autonomous i18n system.',
			el: 'Αυτή είναι μια επίδειξη του απλοποιημένου αυτόνομου συστήματος i18n.',
			ru: 'Это демонстрация упрощенной автономной системы i18n.'
		}
	},

	// Status values
	statusLabel: {
		key: 'testI18n.statusLabel',
		translations: {
			en: 'Status',
			el: 'Κατάσταση',
			ru: 'Статус'
		}
	},

	loadingLabel: {
		key: 'testI18n.loadingLabel',
		translations: {
			en: 'Loading',
			el: 'Φόρτωση',
			ru: 'Загрузка'
		}
	},

	languageLabel: {
		key: 'testI18n.languageLabel',
		translations: {
			en: 'Language',
			el: 'Γλώσσα',
			ru: 'Язык'
		}
	},

	missingKeysLabel: {
		key: 'testI18n.missingKeysLabel',
		translations: {
			en: 'Missing Keys',
			el: 'Ελλείποντα Κλειδιά',
			ru: 'Отсутствующие ключи'
		}
	},

	loading: {
		key: 'testI18n.loading',
		translations: {
			en: 'Loading',
			el: 'Φόρτωση',
			ru: 'Загрузка'
		}
	},

	complete: {
		key: 'testI18n.complete',
		translations: {
			en: 'Complete',
			el: 'Ολοκληρώθηκε',
			ru: 'Завершено'
		}
	},

	partial: {
		key: 'testI18n.partial',
		translations: {
			en: 'Partial',
			el: 'Μερικό',
			ru: 'Частично'
		}
	},

	error: {
		key: 'testI18n.error',
		translations: {
			en: 'Error',
			el: 'Σφάλμα',
			ru: 'Ошибка'
		}
	},

	yes: {
		key: 'testI18n.yes',
		translations: {
			en: 'Yes',
			el: 'Ναι',
			ru: 'Да'
		}
	},

	no: {
		key: 'testI18n.no',
		translations: {
			en: 'No',
			el: 'Όχι',
			ru: 'Нет'
		}
	},

	// Additional content keys
	basicInstructions: {
		key: 'testI18n.basicInstructions',
		translations: {
			en: 'Switch languages using the controls above.',
			el: 'Αλλάξτε γλώσσες χρησιμοποιώντας τα στοιχεία ελέγχου παραπάνω.',
			ru: 'Переключайте языки с помощью элементов управления выше.'
		}
	},

	fallbackChainTitle: {
		key: 'testI18n.fallbackChainTitle',
		translations: {
			en: 'Fallback Chain',
			el: 'Αλυσίδα Εναλλακτικών',
			ru: 'Цепочка резервных вариантов'
		}
	},

	fallbackStep1: {
		key: 'testI18n.fallbackStep1',
		translations: {
			en: '1. Service translation (app language)',
			el: '1. Μετάφραση υπηρεσίας (γλώσσα εφαρμογής)',
			ru: '1. Перевод сервиса (язык приложения)'
		}
	},

	fallbackStep2: {
		key: 'testI18n.fallbackStep2',
		translations: {
			en: '2. Inline translation (app language)',
			el: '2. Ενσωματωμένη μετάφραση (γλώσσα εφαρμογής)',
			ru: '2. Встроенный перевод (язык приложения)'
		}
	},

	fallbackStep3: {
		key: 'testI18n.fallbackStep3',
		translations: {
			en: '3. Inline translation (default language)',
			el: '3. Ενσωματωμένη μετάφραση (προεπιλεγμένη γλώσσα)',
			ru: '3. Встроенный перевод (язык по умолчанию)'
		}
	},

	fallbackStep4: {
		key: 'testI18n.fallbackStep4',
		translations: {
			en: '4. Fallback value',
			el: '4. Εναλλακτική τιμή',
			ru: '4. Резервное значение'
		}
	},

	currentStatusTitle: {
		key: 'testI18n.currentStatusTitle',
		translations: {
			en: 'Current Status',
			el: 'Τρέχουσα Κατάσταση',
			ru: 'Текущий статус'
		}
	},

	fixedLanguageDescription: {
		key: 'testI18n.fixedLanguageDescription',
		translations: {
			en: 'These examples always show in their designated language.',
			el: 'Αυτά τα παραδείγματα εμφανίζονται πάντα στην καθορισμένη γλώσσα.',
			ru: 'Эти примеры всегда отображаются на своем языке.'
		}
	},

	alwaysGreekLabel: {
		key: 'testI18n.alwaysGreekLabel',
		translations: {
			en: "Always Greek (defaultLanguage: 'el')",
			el: "Πάντα Ελληνικά (defaultLanguage: 'el')",
			ru: "Всегда греческий (defaultLanguage: 'el')"
		}
	},

	greekSample: {
		key: 'testI18n.greekSample',
		translations: {
			el: 'Γεια σας! Καλώς ήρθατε στην Ελλάδα 🇬🇷'
		},
		defaultLanguage: 'el'
	},

	alwaysRussianLabel: {
		key: 'testI18n.alwaysRussianLabel',
		translations: {
			en: "Always Russian (defaultLanguage: 'ru')",
			el: "Πάντα Ρωσικά (defaultLanguage: 'ru')",
			ru: "Всегда русский (defaultLanguage: 'ru')"
		}
	},

	russianSample: {
		key: 'testI18n.russianSample',
		translations: {
			ru: 'Привет! Добро пожаловать в Россию 🇷🇺'
		},
		defaultLanguage: 'ru'
	},

	greekLabel: {
		key: 'testI18n.greekLabel',
		translations: {
			en: 'Greek',
			el: 'Ελληνικά',
			ru: 'Греческий'
		}
	},

	russianLabel: {
		key: 'testI18n.russianLabel',
		translations: {
			en: 'Russian',
			el: 'Ρωσικά',
			ru: 'Русский'
		}
	},

	mixedLabel: {
		key: 'testI18n.mixedLabel',
		translations: {
			en: 'Mixed',
			el: 'Μικτό',
			ru: 'Смешанный'
		}
	},

	mixedSample: {
		key: 'testI18n.mixedSample',
		translations: {
			en: 'Mixed: αβγδ + АБВГ + 123 + 🎉',
			el: 'Μικτό: αβγδ + АБВГ + 123 + 🎉',
			ru: 'Смешанный: αβγδ + АБВГ + 123 + 🎉'
		}
	},

	unicodeDescription: {
		key: 'testI18n.unicodeDescription',
		translations: {
			en: 'The i18n system properly handles Unicode characters.',
			el: 'Το σύστημα i18n χειρίζεται σωστά τους χαρακτήρες Unicode.',
			ru: 'Система i18n правильно обрабатывает символы Unicode.'
		}
	},

	// Icons (simple strings - will use service key as fallback)
	checkIcon: '✅',
	errorIcon: '❌',
	loadingIcon: '⏳',
	infoIcon: 'ℹ️'
} as const

export type TranslationKey = keyof typeof translations
