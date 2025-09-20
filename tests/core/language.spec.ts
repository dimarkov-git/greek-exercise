import {expect, test} from '@playwright/test'
import {SELECTORS} from '../fixtures/selectors'
import {LANGUAGES, UI_TEXT, VIEWPORT_SIZES} from '../fixtures/test-data'
import {HomePage} from '../pages/HomePage'

test.beforeEach(async ({context}) => {
	const page = await context.newPage()
	await page.addInitScript(() => localStorage.clear())
	await page.close()
})

test.describe('UI Language - Default behavior', () => {
	test('should start with default Greek UI language', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectUILanguage(LANGUAGES.ui.greek)
		await homePage.expectHeadingText(UI_TEXT.headings.greek)
	})
})

test.describe('UI Language - Desktop switching', () => {
	test('should switch between all UI languages on desktop', async ({page}) => {
		const homePage = new HomePage(page)

		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()

		// Start by switching to English (since Greek is default)
		await homePage.selectUILanguage(LANGUAGES.ui.english)
		await homePage.expectUILanguage(LANGUAGES.ui.english)
		await homePage.expectHeadingText(UI_TEXT.headings.english)

		await homePage.selectUILanguage(LANGUAGES.ui.russian)
		await homePage.expectUILanguage(LANGUAGES.ui.russian)
		await homePage.expectHeadingText(UI_TEXT.headings.russian)

		// Switch back to Greek
		await homePage.selectUILanguage(LANGUAGES.ui.greek)
		await homePage.expectUILanguage(LANGUAGES.ui.greek)
		await homePage.expectHeadingText(UI_TEXT.headings.greek)
	})
})

test.describe('UI Language - Mobile switching', () => {
	test('should switch UI language through mobile menu', async ({page}) => {
		const homePage = new HomePage(page)

		await page.setViewportSize(VIEWPORT_SIZES.mobile)
		await homePage.goto()

		// Open mobile menu
		const menuButton = page.getByRole('button', {
			name: UI_TEXT.menuLabels.menuButton
		})
		await menuButton.click()

		// Verify mobile menu is open
		await homePage.expectMobileMenuVisible()

		// Find language dropdown specifically in mobile menu (not the desktop one)
		const mobileLanguageDropdown = page.locator(
			SELECTORS.mobileMenuLanguageDropdown
		)
		await expect(mobileLanguageDropdown).toBeVisible()

		// Open language dropdown
		await mobileLanguageDropdown.click()

		// Select English option
		const englishOption = page.locator(
			SELECTORS.uiLanguageOption(LANGUAGES.ui.english)
		)
		await englishOption.click()

		// Verify language change
		await homePage.expectUILanguage(LANGUAGES.ui.english)
		await homePage.expectHeadingText(UI_TEXT.headings.english)
	})
})

test.describe('UI Language - Persistence', () => {
	test('should persist selected UI language after page reload', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		// Use desktop viewport for persistence test
		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()
		await homePage.selectUILanguage(LANGUAGES.ui.english)
		await homePage.expectUILanguage(LANGUAGES.ui.english)

		await page.reload()
		await homePage.expectPageLoaded()

		await homePage.expectUILanguage(LANGUAGES.ui.english)
		await homePage.expectHeadingText(UI_TEXT.headings.english)
	})
})
