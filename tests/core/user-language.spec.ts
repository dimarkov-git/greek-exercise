import {expect, test} from '@playwright/test'
import {SELECTORS} from '../fixtures/selectors'
import {LANGUAGES} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'

test.describe('User Language - Basic', () => {
	test('should start with English user language by default', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.user.english)
	})

	test('should switch user language', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)

		await exerciseLibrary.goto()

		// Verify starting state (English)
		await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.user.english)

		// Switch to Russian
		await exerciseLibrary.selectUserLanguage(LANGUAGES.user.russian)
		await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.user.russian)

		// Switch back to English
		await exerciseLibrary.selectUserLanguage(LANGUAGES.user.english)
		await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.user.english)
	})
})

test.describe('User Language - Persistence', () => {
	test('should persist user language after page reload', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.selectUserLanguage(LANGUAGES.user.russian)
		await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.user.russian)

		// Reload page
		await page.reload()
		await exerciseLibrary.expectPageLoaded()

		// User language should persist
		await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.user.russian)
	})
})

test.describe('User Language - Visual Indication', () => {
	test('should show visual indication of selected user language', async ({
		page
	}) => {
		const exerciseLibrary = new ExerciseLibrary(page)

		await exerciseLibrary.goto()

		// Expand settings to access user language selector
		await exerciseLibrary.expandSettings()

		// English should be selected by default (green background)
		const englishOption = page.locator(
			SELECTORS.userLanguageOption(LANGUAGES.user.english)
		)
		await expect(englishOption).toHaveAttribute('data-selected', 'true')
		await expect(englishOption).toHaveClass(/bg-green-500/)

		// Switch to Russian
		await exerciseLibrary.selectUserLanguage(LANGUAGES.user.russian)
		const russianOption = page.locator(
			SELECTORS.userLanguageOption(LANGUAGES.user.russian)
		)
		await expect(russianOption).toHaveAttribute('data-selected', 'true')
		await expect(russianOption).toHaveClass(/bg-green-500/)

		// English should no longer be selected
		await expect(englishOption).toHaveAttribute('data-selected', 'false')
	})
})
