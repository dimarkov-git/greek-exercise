import {expect, test} from '@playwright/test'
import {SELECTORS} from '../fixtures/selectors'
import {LANGUAGES, VIEWPORT_SIZES} from '../fixtures/test-data'
import {HomePage} from '../pages/HomePage'

test.beforeEach(async ({ context }) => {
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.clear());
  await page.close();
});

test.describe('UI Language - Default state', () => {
	test('should start with Greek UI language', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectUILanguage(LANGUAGES.ui.greek)
		await homePage.expectHeadingText('Μάθε Ελληνικά')
	})
})

test.describe('UI Language - Visual', () => {
	test('should show correct flag for current language', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		await homePage.selectUILanguage(LANGUAGES.ui.greek)
		await expect(homePage.uiLanguageDropdown).toHaveAttribute('data-lang', 'el');

		await homePage.selectUILanguage(LANGUAGES.ui.english)
		await expect(homePage.uiLanguageDropdown).toHaveAttribute('data-lang', 'en');

		await homePage.selectUILanguage(LANGUAGES.ui.russian)
		await expect(homePage.uiLanguageDropdown).toHaveAttribute('data-lang', 'ru');
	})
})

test.describe('UI Language - Persistence', () => {
	test('should persist UI language after page reload', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.selectUILanguage(LANGUAGES.ui.english)
		await homePage.expectUILanguage(LANGUAGES.ui.english)

		await page.reload()
		await homePage.expectPageLoaded()

		await homePage.expectUILanguage(LANGUAGES.ui.english)
		await homePage.expectHeadingText('Learn Greek')
	})
})

test.describe('UI Language - Switch', () => {
	test('should switch UI language on desktop', async ({page}) => {
		const homePage = new HomePage(page)

		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()

		await homePage.selectUILanguage(LANGUAGES.ui.greek)
		await homePage.expectUILanguage(LANGUAGES.ui.greek)
		await homePage.expectHeadingText('Μάθε Ελληνικά')

		await homePage.selectUILanguage(LANGUAGES.ui.english)
		await homePage.expectUILanguage(LANGUAGES.ui.english)
		await homePage.expectHeadingText('Learn Greek')

		await homePage.selectUILanguage(LANGUAGES.ui.russian)
		await homePage.expectUILanguage(LANGUAGES.ui.russian)
		await homePage.expectHeadingText('Учим греческий')
	})

	test('should switch UI language on mobile', async ({page}) => {
		const homePage = new HomePage(page)

		await page.setViewportSize(VIEWPORT_SIZES.mobile)
		await homePage.goto()

		const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
		await menuButton.click()

		const mobileLanguageDropdown = page.locator(
			'.md\\:hidden [data-testid="ui-language-dropdown"]'
		)
		await expect(mobileLanguageDropdown).toBeVisible()

		await mobileLanguageDropdown.click()
		const englishOption = page.locator(
			SELECTORS.uiLanguageOption(LANGUAGES.ui.english)
		)
		await englishOption.click()

		await homePage.expectUILanguage(LANGUAGES.ui.english)
		await homePage.expectHeadingText('Learn Greek')
	})
})
