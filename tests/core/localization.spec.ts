import {expect, test} from '@playwright/test'
import {SELECTORS} from '../fixtures/selectors'
import {LANGUAGES, VIEWPORT_SIZES} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {HomePage} from '../pages/HomePage'

test.describe('Localization', () => {
	test.describe('UI Language', () => {
		test('should start with Greek UI language by default', async ({page}) => {
			const homePage = new HomePage(page)

			await homePage.goto()
			await homePage.expectUILanguage(LANGUAGES.UI.GREEK)
			await homePage.expectHeadingText('Μάθε Ελληνικά')
		})

		test('should switch UI language on desktop', async ({page}) => {
			const homePage = new HomePage(page)

			await page.setViewportSize(VIEWPORT_SIZES.DESKTOP)
			await homePage.goto()

			// Verify starting state (Greek)
			await homePage.expectUILanguage(LANGUAGES.UI.GREEK)
			await homePage.expectHeadingText('Μάθε Ελληνικά')

			// Switch to English
			await homePage.selectUILanguage(LANGUAGES.UI.ENGLISH)
			await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)
			await homePage.expectHeadingText('Learn Greek')

			// Switch to Russian
			await homePage.selectUILanguage(LANGUAGES.UI.RUSSIAN)
			await homePage.expectUILanguage(LANGUAGES.UI.RUSSIAN)
			await homePage.expectHeadingText('Учим греческий')

			// Switch back to Greek
			await homePage.selectUILanguage(LANGUAGES.UI.GREEK)
			await homePage.expectUILanguage(LANGUAGES.UI.GREEK)
			await homePage.expectHeadingText('Μάθε Ελληνικά')
		})

		test('should switch UI language on mobile', async ({page}) => {
			const homePage = new HomePage(page)

			await page.setViewportSize(VIEWPORT_SIZES.MOBILE)
			await homePage.goto()

			// Open mobile menu first
			const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
			await menuButton.click()

			// Language dropdown should be visible in mobile menu
			const mobileLanguageDropdown = page.locator(
				'.md\\:hidden [data-testid="ui-language-dropdown"]'
			)
			await expect(mobileLanguageDropdown).toBeVisible()

			// Switch language in mobile menu
			await mobileLanguageDropdown.click()
			const englishOption = page.locator(
				SELECTORS.UI_LANGUAGE_OPTION(LANGUAGES.UI.ENGLISH)
			)
			await englishOption.click()

			await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)
			await homePage.expectHeadingText('Learn Greek')
		})

		test('should persist UI language after page reload', async ({page}) => {
			const homePage = new HomePage(page)

			await homePage.goto()
			await homePage.selectUILanguage(LANGUAGES.UI.ENGLISH)
			await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)

			// Reload page
			await page.reload()
			await homePage.expectPageLoaded()

			// Language should persist
			await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)
			await homePage.expectHeadingText('Learn Greek')
		})

		test('should show correct flag for current language', async ({page}) => {
			const homePage = new HomePage(page)

			await homePage.goto()

			// Greek should show Greek flag
			await homePage.expectUILanguage(LANGUAGES.UI.GREEK)
			await expect(homePage.uiLanguageDropdown).toContainText('🇬🇷')

			// English should show US flag
			await homePage.selectUILanguage(LANGUAGES.UI.ENGLISH)
			await expect(homePage.uiLanguageDropdown).toContainText('🇺🇸')

			// Russian should show Russian flag
			await homePage.selectUILanguage(LANGUAGES.UI.RUSSIAN)
			await expect(homePage.uiLanguageDropdown).toContainText('🇷🇺')
		})
	})

	test.describe('User Language', () => {
		test('should start with English user language by default', async ({
			page
		}) => {
			const exerciseLibrary = new ExerciseLibrary(page)

			await exerciseLibrary.goto()
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.ENGLISH)
		})

		test('should switch user language', async ({page}) => {
			const exerciseLibrary = new ExerciseLibrary(page)

			await exerciseLibrary.goto()

			// Verify starting state (English)
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.ENGLISH)

			// Switch to Russian
			await exerciseLibrary.selectUserLanguage(LANGUAGES.USER.RUSSIAN)
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.RUSSIAN)

			// Switch back to English
			await exerciseLibrary.selectUserLanguage(LANGUAGES.USER.ENGLISH)
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.ENGLISH)
		})

		test('should persist user language after page reload', async ({page}) => {
			const exerciseLibrary = new ExerciseLibrary(page)

			await exerciseLibrary.goto()
			await exerciseLibrary.selectUserLanguage(LANGUAGES.USER.RUSSIAN)
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.RUSSIAN)

			// Reload page
			await page.reload()
			await exerciseLibrary.expectPageLoaded()

			// User language should persist
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.RUSSIAN)
		})

		test('should show visual indication of selected user language', async ({
			page
		}) => {
			const exerciseLibrary = new ExerciseLibrary(page)

			await exerciseLibrary.goto()

			// English should be selected by default (green background)
			const englishOption = page.locator(
				SELECTORS.USER_LANGUAGE_OPTION(LANGUAGES.USER.ENGLISH)
			)
			await expect(englishOption).toHaveAttribute('data-selected', 'true')
			await expect(englishOption).toHaveClass(/bg-green-500/)

			// Switch to Russian
			await exerciseLibrary.selectUserLanguage(LANGUAGES.USER.RUSSIAN)
			const russianOption = page.locator(
				SELECTORS.USER_LANGUAGE_OPTION(LANGUAGES.USER.RUSSIAN)
			)
			await expect(russianOption).toHaveAttribute('data-selected', 'true')
			await expect(russianOption).toHaveClass(/bg-green-500/)

			// English should no longer be selected
			await expect(englishOption).toHaveAttribute('data-selected', 'false')
		})
	})

	test.describe('Combined Language Settings', () => {
		test('should maintain independent UI and user language settings', async ({
			page
		}) => {
			const homePage = new HomePage(page)
			const exerciseLibrary = new ExerciseLibrary(page)

			// Set UI language to English
			await homePage.goto()
			await homePage.selectUILanguage(LANGUAGES.UI.ENGLISH)

			// Navigate to exercises and set user language to Russian
			await homePage.clickExercisesCard()
			await exerciseLibrary.selectUserLanguage(LANGUAGES.USER.RUSSIAN)

			// Both settings should be maintained
			await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.RUSSIAN)

			// Navigate back to home - UI language should persist
			await page.goto('/')
			await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)

			// Navigate back to exercises - user language should persist
			await page.goto('/exercises')
			await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.RUSSIAN)
		})
	})
})
