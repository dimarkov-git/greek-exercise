import {expect, test} from '@playwright/test'
import {ROUTES} from './fixtures/selectors'

test.describe('App', () => {
	test('loads without errors', async ({page}) => {
		const consoleErrors: string[] = []
		page.on('console', msg => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text())
			}
		})

		await page.goto(ROUTES.home)

		// Basic render check
		await expect(page.locator('body')).toBeVisible()

		// App-specific smoke check
		await expect(page.getByRole('main')).toBeVisible()

		expect(consoleErrors).toEqual([])
	})
})
