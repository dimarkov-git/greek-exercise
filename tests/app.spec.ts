import {expect, test} from '@playwright/test'
import {ROUTES} from './fixtures/selectors'

const IGNORED_CONSOLE_ERRORS = ['net::ERR_CERT_AUTHORITY_INVALID']

test.describe('App', () => {
	test('loads without errors', async ({page}) => {
		const consoleErrors: string[] = []
		page.on('console', msg => {
			if (msg.type() !== 'error') {
				return
			}

			const text = msg.text()
			if (IGNORED_CONSOLE_ERRORS.some(ignored => text.includes(ignored))) {
				return
			}

			consoleErrors.push(text)
		})

		await page.goto(ROUTES.home)

		// Basic render check
		await expect(page.locator('body')).toBeVisible()

		// App-specific smoke check
		await expect(page.getByRole('main')).toBeVisible()

		expect(consoleErrors).toEqual([])
	})
})
