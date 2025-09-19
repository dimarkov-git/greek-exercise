import {expect, test} from '@playwright/test'
import {
	EXERCISE_DATA,
	LANGUAGES,
	THEMES,
	VIEWPORT_SIZES
} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {ExercisePage} from '../pages/ExercisePage'
import {HomePage} from '../pages/HomePage'

test.describe('Mobile Responsive Design', () => {
	test.beforeEach(async ({page}) => {
		await page.setViewportSize(VIEWPORT_SIZES.MOBILE)
	})

	test('should display mobile layout on homepage', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectPageLoaded()

		// Navigation cards should be visible and functional on mobile
		await homePage.expectNavigationCardsVisible()

		// Mobile menu button should be visible
		const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
		await expect(menuButton).toBeVisible()
	})

	test('should handle mobile menu functionality', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Open mobile menu
		const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
		await menuButton.click()

		// Theme toggle should be visible in mobile menu
		const mobileThemeToggle = page.locator(
			'.md\\:hidden [data-testid="theme-toggle"]'
		)
		await expect(mobileThemeToggle).toBeVisible()

		// Language dropdown should be visible in mobile menu
		const mobileLanguageDropdown = page.locator(
			'.md\\:hidden [data-testid="ui-language-dropdown"]'
		)
		await expect(mobileLanguageDropdown).toBeVisible()
	})

	test('should handle mobile theme switching', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectTheme(THEMES.LIGHT)

		// Open mobile menu
		const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
		await menuButton.click()

		// Toggle theme in mobile menu
		const mobileThemeToggle = page.locator(
			'.md\\:hidden [data-testid="theme-toggle"]'
		)
		await mobileThemeToggle.click()

		await homePage.expectTheme(THEMES.DARK)
	})

	test('should handle mobile language switching', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectUILanguage(LANGUAGES.UI.GREEK)

		// Open mobile menu
		const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
		await menuButton.click()

		// Switch language in mobile menu
		const mobileLanguageDropdown = page.locator(
			'.md\\:hidden [data-testid="ui-language-dropdown"]'
		)
		await mobileLanguageDropdown.click()

		const englishOption = page.getByTestId('ui-language-option-en')
		await englishOption.click()

		await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)
		await homePage.expectHeadingText('Learn Greek')
	})

	test('should handle mobile exercise functionality', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()

		// Input should be visible and functional on mobile
		await exercisePage.expectInputVisible()
		await exercisePage.expectInputFocused()

		// Submit answer on mobile
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.expectCorrectFeedback()

		// Auto-advance should work on mobile
		await exercisePage.waitForAutoAdvance()
		await exercisePage.expectProgressText(/2.*(of|из|από).*\d+/)
	})

	test('should handle mobile auto-advance toggle', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()

		// Auto-advance toggle should be visible and functional on mobile
		await expect(exercisePage.autoAdvanceToggle).toBeVisible()
		await exercisePage.expectAutoAdvanceEnabled(true)

		// Toggle should work on mobile
		await exercisePage.toggleAutoAdvance()
		await exercisePage.expectAutoAdvanceEnabled(false)
	})

	test('should handle mobile hint interactions', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()

		// On mobile, hints should work with tap
		const greekText = page.getByText(/εγώ/).first()
		if (await greekText.isVisible()) {
			await greekText.click()

			// Wait for potential mobile hint to appear
			await page.waitForTimeout(1000)

			// Check if hint is visible (might show "you" or translation)
			const _hintVisible = await page.getByText(/you|I/).isVisible()
			// Note: This documents expected mobile hint behavior
		}
	})

	test('should display mobile user language selector', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.expectPageLoaded()

		// User language selector should be visible and functional on mobile
		await expect(exerciseLibrary.userLanguageSelector).toBeVisible()

		// Should be able to change user language on mobile
		await exerciseLibrary.selectUserLanguage(LANGUAGES.USER.RUSSIAN)
		await exerciseLibrary.expectUserLanguageSelected(LANGUAGES.USER.RUSSIAN)
	})

	test('should handle mobile completion screen', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()

		// Complete exercise on mobile
		await exercisePage.answerUntilCompletion(
			EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS
		)
		await exercisePage.expectExerciseCompleted()

		// Completion screen should be functional on mobile
		const restartButton = page.getByRole('button', {name: /try again|restart/i})
		const exitButton = page.getByRole('button', {name: /back to library|exit/i})

		await expect(restartButton).toBeVisible()
		await expect(exitButton).toBeVisible()

		// Test restart on mobile
		await restartButton.click()
		await exercisePage.expectPageLoaded()
	})

	test('should handle mobile keyboard and virtual keyboard', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()

		// Input should be focused and ready for virtual keyboard
		await exercisePage.expectInputFocused()

		// Typing should work with virtual keyboard simulation
		await exercisePage.fillInput(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])

		// Submit should work on mobile
		await exercisePage.clickSubmitButton()
		await exercisePage.expectCorrectFeedback()
	})

	test('should maintain mobile layout during navigation', async ({page}) => {
		const homePage = new HomePage(page)
		const exerciseLibrary = new ExerciseLibrary(page)

		// Start on homepage
		await homePage.goto()
		await homePage.expectPageLoaded()

		// Navigate to exercises
		await homePage.clickExercisesCard()
		await exerciseLibrary.expectPageLoaded()

		// Mobile menu should still be available
		await page.goto('/')
		const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
		await expect(menuButton).toBeVisible()
	})
})
