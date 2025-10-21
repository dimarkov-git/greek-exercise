import {expect, test} from '@playwright/test'
import {SELECTORS} from '../fixtures/selectors'
import {EXERCISE_DATA, UI_TEXT, VIEWPORT_SIZES} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {ExercisePage} from '../pages/ExercisePage'
import {HomePage} from '../pages/HomePage'

test.describe('Mobile responsive layout', () => {
	test.use({viewport: VIEWPORT_SIZES.mobile})

	test('renders navigation controls in the mobile menu', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectPageLoaded()

		const menuButton = page.getByRole('button', {
			name: UI_TEXT.menuLabels.menuButton
		})
		await expect(menuButton).toBeVisible()

		await menuButton.click()

		await homePage.expectMobileMenuVisible()
		await expect(page.locator(SELECTORS.mobileMenuThemeToggle)).toBeVisible()
		await expect(
			page.locator(SELECTORS.mobileMenuLanguageDropdown)
		).toBeVisible()
	})

	test('supports answering exercises on small viewports', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startExerciseById('word-form-verbs-be-1')
		await exercisePage.expectInputFocused()

		await exercisePage.submitAnswer(EXERCISE_DATA.verbsBe.correctAnswers[0])
		await exercisePage.waitForAutoAdvance()
		await exercisePage.expectProgressText(UI_TEXT.progress.createPattern(2))
	})
})

test.describe('Desktop responsive layout', () => {
	test.use({viewport: VIEWPORT_SIZES.desktop})

	test('keeps header controls visible without the mobile menu', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectPageLoaded()
		await homePage.expectMobileMenuHidden()

		await expect(page.locator(SELECTORS.themeToggle).first()).toBeVisible()
		await expect(
			page.locator(SELECTORS.uiLanguageDropdown).first()
		).toBeVisible()
	})
})
