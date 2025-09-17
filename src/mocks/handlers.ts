import {delay, HttpResponse, http} from 'msw'
import commonTexts from './data/texts/common.json' with {type: 'json'}
import elTranslations from './data/translations/el.json' with {type: 'json'}
import enTranslations from './data/translations/en.json' with {type: 'json'}
import ruTranslations from './data/translations/ru.json' with {type: 'json'}

const translations = {
	en: enTranslations,
	ru: ruTranslations,
	el: elTranslations
}

export const handlers = [
	http.get('/api/texts/common', async () => {
		await delay('real')
		return HttpResponse.json(commonTexts)
	}),

	http.get('/api/translations/:lang', async ({params}) => {
		await delay('real')
		const {lang} = params
		const translation = translations[lang as keyof typeof translations]

		if (!translation) {
			return HttpResponse.json(
				{error: `Translation for language '${lang}' not found`},
				{status: 404}
			)
		}

		return HttpResponse.json(translation)
	})
]
