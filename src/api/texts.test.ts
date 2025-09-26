import {afterEach, describe, expect, it, vi} from 'vitest'

const requestJson = vi.fn()

vi.mock('./httpClient', () => ({
        requestJson
}))

describe('getTranslations', () => {
        afterEach(() => {
                requestJson.mockReset()
        })

        it('fetches translations with provided keys and language', async () => {
                requestJson.mockResolvedValue({
                        translations: {"app.title": 'Learn Greek'}
                })

                const {getTranslations} = await import('./texts')
                const result = await getTranslations('en', ['app.title'])

                expect(requestJson).toHaveBeenCalledWith('/api/translations', {
                        method: 'POST',
                        body: {language: 'en', keys: ['app.title']}
                })
                expect(result).toEqual({"app.title": 'Learn Greek'})
        })

        it('throws when server returns invalid translation payload', async () => {
                requestJson.mockResolvedValue({
                        translations: {"app.title": 123}
                })

                const {getTranslations} = await import('./texts')

                await expect(
                        getTranslations('en', ['app.title'])
                ).rejects.toThrowError(/Invalid/)
        })
})
