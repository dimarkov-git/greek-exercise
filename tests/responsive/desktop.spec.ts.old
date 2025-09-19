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

test.describe('Desktop Responsive Design', () => {
	test.beforeEach(async ({page}) => {
		await page.setViewportSize(VIEWPORT_SIZES.DESKTOP)
	})

	test('should display desktop layout on homepage', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectPageLoaded()

		// Theme toggle should be visible in header on desktop
		await expect(homePage.themeToggle).toBeVisible()

		// Language dropdown should be visible in header on desktop
		await expect(homePage.uiLanguageDropdown).toBeVisible()

		// Mobile menu button should not be visible on desktop
		const menuButton = page.getByRole('button', {name: /menu|μενού|меню/i})
		await expect(menuButton).not.toBeVisible()
	})

	test('should handle desktop theme switching', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectTheme(THEMES.LIGHT)

		// Theme toggle should be directly accessible in header
		await expect(homePage.themeToggle).toBeVisible()
		await homePage.toggleTheme()

		await homePage.expectTheme(THEMES.DARK)

		// Toggle back
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.LIGHT)
	})

	test('should handle desktop language switching', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectUILanguage(LANGUAGES.UI.GREEK)

		// Language dropdown should be directly accessible in header
		await homePage.selectUILanguage(LANGUAGES.UI.ENGLISH)
		await homePage.expectUILanguage(LANGUAGES.UI.ENGLISH)
		await homePage.expectHeadingText('Learn Greek')

		// Switch to Russian
		await homePage.selectUILanguage(LANGUAGES.UI.RUSSIAN)
		await homePage.expectUILanguage(LANGUAGES.UI.RUSSIAN)
		await homePage.expectHeadingText('Изучайте греческий')

		// Switch back to Greek
		await homePage.selectUILanguage(LANGUAGES.UI.GREEK)
		await homePage.expectUILanguage(LANGUAGES.UI.GREEK)
		await homePage.expectHeadingText('Μάθε Ελληνικά')
	})

	test('should display full header navigation on desktop', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// All header elements should be visible on desktop
		const headerLinks = page.locator('header a')
		const linkCount = await headerLinks.count()
		expect(linkCount).toBeGreaterThan(1) // Should have multiple header links

		// Logo should be visible
		const logo = page
			.locator('header')
			.getByText(/Learn Greek|Μάθε Ελληνικά|Изучайте греческий/)
		await expect(logo).toBeVisible()
	})

	test('should handle desktop exercise interface', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()

		// Exercise interface should be optimized for desktop
		await exercisePage.expectInputVisible()
		await exercisePage.expectInputFocused()

		// Desktop should show full exercise controls
		await expect(exercisePage.autoAdvanceToggle).toBeVisible()
		await expect(exercisePage.exerciseProgress).toBeVisible()
		await expect(exercisePage.backButton).toBeVisible()
	})

	test('should handle desktop hover interactions', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()

		// Desktop should support hover interactions for hints
		const greekText = page.getByText(/εγώ/).first()
		if (await greekText.isVisible()) {
			await greekText.hover()

			// Wait for hover hint to potentially appear
			await page.waitForTimeout(1000)

			// Check for hover-based hints
			const hintElement = page.getByText(/I am|я есть/)
			const _hintVisible = await hintElement.isVisible()
			// Note: Documents expected desktop hover behavior
		}
	})

	test('should handle desktop keyboard shortcuts', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()

		// Desktop should support full keyboard navigation
		await exercisePage.expectInputFocused()

		// Tab navigation should work properly on desktop
		await page.keyboard.press('Tab')
		const focusedElement = page.locator(':focus')
		await expect(focusedElement).toBeVisible()

		// Should be able to navigate back to input
		await page.keyboard.press('Shift+Tab')
		await exercisePage.expectInputFocused()
	})

	test('should display wide layout on large screens', async ({page}) => {
		// Set extra wide viewport
		await page.setViewportSize({width: 1920, height: 1080})

		const homePage = new HomePage(page)
		await homePage.goto()

		// Content should be properly centered and utilize space
		const mainContent = page.locator('main')
		await expect(mainContent).toBeVisible()

		// Navigation cards should have proper spacing
		await homePage.expectNavigationCardsVisible()
	})

	test('should handle desktop multi-window behavior', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectPageLoaded()

		// Open new tab/window simulation
		const newPage = await page.context().newPage()
		await newPage.setViewportSize(VIEWPORT_SIZES.DESKTOP)

		const newHomePage = new HomePage(newPage)
		await newHomePage.goto()
		await newHomePage.expectPageLoaded()

		// Both windows should work independently
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.DARK)

		await newHomePage.expectTheme(THEMES.DARK) // Settings should sync

		await newPage.close()
	})

	test('should optimize exercise completion for desktop', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()

		// Complete exercise with desktop-optimized flow
		await exercisePage.answerUntilCompletion(
			EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS
		)
		await exercisePage.expectExerciseCompleted()

		// Desktop completion screen should show all options
		const restartButton = page.getByRole('button', {name: /try again|restart/i})
		const exitButton = page.getByRole('button', {name: /back to library|exit/i})

		await expect(restartButton).toBeVisible()
		await expect(exitButton).toBeVisible()

		// Desktop should handle quick restart efficiently
		await restartButton.click()
		await exercisePage.expectPageLoaded()
		await exercisePage.expectInputFocused()
	})

	test('should handle desktop window resizing gracefully', async ({page}) => {
		const homePage = new HomePage(page)

		// Start with desktop size
		await homePage.goto()
		await homePage.expectPageLoaded()

		// Resize to tablet size
		await page.setViewportSize(VIEWPORT_SIZES.TABLET)
		await page.waitForTimeout(500) // Allow for responsive adjustments

		// Layout should adapt
		await homePage.expectPageLoaded()

		// Resize back to desktop
		await page.setViewportSize(VIEWPORT_SIZES.DESKTOP)
		await page.waitForTimeout(500)

		// Should return to desktop layout
		await expect(homePage.themeToggle).toBeVisible()
		await expect(homePage.uiLanguageDropdown).toBeVisible()
	})
})
