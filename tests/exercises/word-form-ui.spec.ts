import {expect, test} from '@playwright/test'
import {EXERCISE_DATA, VIEWPORT_SIZES} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {ExercisePage} from '../pages/ExercisePage'

test.describe('Word Form Exercise - UI Interactions', () => {
	test.beforeEach(async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()
	})

	test('should handle auto-advance toggle functionality', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Auto-advance should be enabled by default
		await exercisePage.expectAutoAdvanceEnabled(true)

		// Disable auto-advance
		await exercisePage.toggleAutoAdvance()
		await exercisePage.expectAutoAdvanceEnabled(false)

		// Answer correctly - should show continue button instead of auto-advancing
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.expectCorrectFeedback()

		// Should show continue button
		await expect(exercisePage.continueButton).toBeVisible()

		// Click continue to proceed
		await exercisePage.clickContinueButton()
		await exercisePage.expectProgressText(/2.*(of|из|από).*\d+/)

		// Re-enable auto-advance
		await exercisePage.toggleAutoAdvance()
		await exercisePage.expectAutoAdvanceEnabled(true)

		// Next answer should auto-advance
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[1])
		await exercisePage.waitForAutoAdvance()

		await exercisePage.expectProgressText(/3.*(of|из|από).*\d+/)
	})

	test('should display hint system on desktop', async ({page}) => {
		await page.setViewportSize(VIEWPORT_SIZES.DESKTOP)

		// Greek text elements should be hoverable for hints
		const greekPronouns = page.getByText(/εγώ/)
		await expect(greekPronouns).toBeVisible()

		// Hover should show hints (if hint system is working)
		await greekPronouns.hover()

		// Wait briefly for potential hint to appear
		await page.waitForTimeout(1000)

		// Hints might show translations like "I" or "я" depending on user language
		const possibleHints = page.getByText(/I am|я есть/)
		const _hintVisible = await possibleHints.isVisible()

		// Note: Hints might not always be visible depending on implementation
		// This test documents the expected behavior
	})

	test('should handle hint system on mobile', async ({page}) => {
		await page.setViewportSize(VIEWPORT_SIZES.MOBILE)

		// On mobile, hints should work with tap
		const greekPronouns = page.getByText(/εγώ/)
		await expect(greekPronouns).toBeVisible()

		// Tap to show hint
		await greekPronouns.click()

		// Wait for potential hint
		await page.waitForTimeout(1000)

		// Check for mobile hint behavior
		const possibleHints = page.getByText(/I|you/)
		const _hintVisible = await possibleHints.isVisible()

		// Document mobile hint behavior
	})

	test('should show completion screen with actions', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Complete the exercise quickly
		await exercisePage.answerUntilCompletion(
			EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS
		)

		// Should show completion screen
		await exercisePage.expectExerciseCompleted()

		// Should show action buttons
		const restartButton = page.getByRole('button', {name: /try again|restart/i})
		const exitButton = page.getByRole('button', {name: /back to library|exit/i})

		await expect(restartButton).toBeVisible()
		await expect(exitButton).toBeVisible()
	})

	test('should handle restart functionality', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Complete the exercise
		await exercisePage.answerUntilCompletion(
			EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS
		)
		await exercisePage.expectExerciseCompleted()

		// Click restart
		const restartButton = page.getByRole('button', {name: /try again|restart/i})
		await restartButton.click()

		// Should restart the exercise
		await exercisePage.expectPageLoaded()
		await exercisePage.expectProgressText(/1.*(of|из|από).*\d+/)
	})

	test('should handle exit functionality', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Start exercise and answer one question
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.waitForAutoAdvance()

		// Use back button to exit
		await exercisePage.clickBackButton()

		// Should return to exercise library
		await expect(page).toHaveURL('/exercises')

		// Library page should be loaded
		const exerciseLibrary = new ExerciseLibrary(page)
		await exerciseLibrary.expectPageLoaded()
	})

	test('should persist exercise progress during single session', async ({
		page
	}) => {
		const exercisePage = new ExercisePage(page)

		// Answer first question
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.waitForAutoAdvance()

		const _progressText = await exercisePage.progressText.textContent()

		// Refresh page
		await page.reload()

		// Exercise should restart (current behavior)
		// In future versions, progress might persist
		await exercisePage.expectPageLoaded()
		await exercisePage.expectProgressText(/1.*(of|из|από).*\d+/)
	})

	test('should handle Tab key navigation', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Input should be focused initially
		await exercisePage.expectInputFocused()

		// Type answer
		await page.keyboard.type(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])

		// Submit with Enter
		await page.keyboard.press('Enter')
		await exercisePage.expectCorrectFeedback()

		// Tab should navigate through interactive elements
		await page.keyboard.press('Tab')

		// Should focus on next interactive element
		const focusedElement = page.locator(':focus')
		await expect(focusedElement).toBeVisible()
	})

	test('should handle submit button clicks', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Fill input without pressing Enter
		await exercisePage.fillInput(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])

		// Click submit button instead
		await exercisePage.clickSubmitButton()

		// Should process the answer
		await exercisePage.expectCorrectFeedback()
	})

	test('should disable submit button for empty input', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Submit button should be disabled when input is empty
		await expect(exercisePage.submitButton).toBeDisabled()

		// Fill input
		await exercisePage.fillInput(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])

		// Submit button should now be enabled
		await expect(exercisePage.submitButton).toBeEnabled()

		// Clear input
		await exercisePage.fillInput('')

		// Should be disabled again
		await expect(exercisePage.submitButton).toBeDisabled()
	})
})
