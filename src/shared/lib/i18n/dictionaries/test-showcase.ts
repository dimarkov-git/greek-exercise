import type {DictionaryKeys} from '../dictionary'
import {createTranslationDictionary} from '../dictionary'

export const testShowcaseTranslations = createTranslationDictionary(
	[
		'testI18n.pageTitle',
		'testI18n.pageDescription',
		'testI18n.languageControls',
		'testI18n.currentLanguage',
		'testI18n.scenarios.basic.title',
		'testI18n.scenarios.basic.description',
		'testI18n.scenarios.basic.sampleText',
		'testI18n.scenarios.basic.multilineText',
		'testI18n.scenarios.missing.title',
		'testI18n.scenarios.missing.description',
		'testI18n.scenarios.missing.fallbackPolicy',
		'testI18n.scenarios.missing.keyPolicy',
		'testI18n.scenarios.missing.missingKey',
		'testI18n.scenarios.status.title',
		'testI18n.scenarios.status.description',
		'testI18n.scenarios.status.loading',
		'testI18n.scenarios.status.complete',
		'testI18n.scenarios.status.partial',
		'testI18n.scenarios.status.missing',
		'testI18n.scenarios.status.error',
		'testI18n.scenarios.fixed.title',
		'testI18n.scenarios.fixed.description',
		'testI18n.scenarios.unicode.title',
		'testI18n.scenarios.unicode.description',
		'testI18n.scenarios.unicode.greekSample',
		'testI18n.scenarios.unicode.cyrillicSample',
		'testI18n.scenarios.unicode.mixedSample',
		'testI18n.tabs.basic',
		'testI18n.tabs.missing',
		'testI18n.tabs.status',
		'testI18n.tabs.fixed',
		'testI18n.tabs.unicode',
		'testI18n.demo.greeting',
		'testI18n.demo.welcome',
		'testI18n.demo.instructions',
		'testI18n.demo.switchLanguage',
		'testI18n.info.translationStatus',
		'testI18n.info.missingKeys',
		'testI18n.info.totalKeys',
		'testI18n.info.loadingState',
		'testI18n.info.errorState'
	] as const,
	{
		// Fixed language keys for demonstration
		fixedLanguageKeys: {
			'testI18n.scenarios.fixed.title': 'en',
			'testI18n.scenarios.unicode.greekSample': 'el',
			'testI18n.scenarios.unicode.cyrillicSample': 'ru'
		}
	}
)

export type TestShowcaseTranslationKey = DictionaryKeys<
	typeof testShowcaseTranslations
>
