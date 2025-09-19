import {test} from '@playwright/test'
import {EXERCISE_DATA, EXERCISE_STATUS} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {ExercisePage} from '../pages/ExercisePage'

test.describe('Word Form Exercise - Feedback and Error Handling', () => {
	test.beforeEach(async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startFirstExercise()
		await exercisePage.expectPageLoaded()
	})

	test('should show correct feedback for right answers', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])

		await exercisePage.expectCorrectFeedback()
		await exercisePage.expectInputStatus(EXERCISE_STATUS.CORRECT_ANSWER)
	})

	test('should show incorrect feedback for wrong answers', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.WRONG_ANSWERS[0])

		await exercisePage.expectIncorrectFeedback()
		await exercisePage.expectInputStatus(EXERCISE_STATUS.WRONG_ANSWER)
	})

	test('should require correction after wrong answer', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Answer incorrectly
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.WRONG_ANSWERS[0])
		await exercisePage.waitForAnswerProcessing()

		// Should transition to require correction state
		await exercisePage.expectInputStatus(EXERCISE_STATUS.REQUIRE_CORRECTION)

		// Try wrong answer again - should still require correction
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.WRONG_ANSWERS[1])
		await exercisePage.expectInputStatus(EXERCISE_STATUS.REQUIRE_CORRECTION)

		// Enter correct answer - should now accept
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.expectCorrectFeedback()
	})

	test('should handle error correction flow in verbs-have exercise', async ({
		page
	}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		// Switch to verbs-have exercise
		await page.goto('/exercises')
		await exerciseLibrary.startSecondExercise()

		// Answer incorrectly
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_HAVE.WRONG_ANSWERS[0])
		await exercisePage.waitForAnswerProcessing()

		// Should show error and require correction
		await exercisePage.expectIncorrectFeedback()

		// Wait for transition to correction state
		await page.waitForTimeout(2500)
		await exercisePage.expectInputStatus(EXERCISE_STATUS.REQUIRE_CORRECTION)

		// Enter correct answer
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_HAVE.CORRECT_ANSWERS[0])
		await exercisePage.waitForAnswerProcessing()

		// Should advance to next question
		await exercisePage.waitForAutoAdvance()
		await exercisePage.expectProgressText(/2.*(of|из|από).*\d+/)
		await exercisePage.expectInputFocused()
	})

	test('should handle special characters gracefully', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Enter text with special characters and emojis
		await exercisePage.submitAnswer('είμαι!@#$%^&*()😀')

		// Should handle gracefully (likely show as incorrect)
		await exercisePage.waitForAnswerProcessing()
		await exercisePage.expectInputStatus(EXERCISE_STATUS.WRONG_ANSWER)
	})

	test('should handle very long input', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Enter very long text
		const longText = 'α'.repeat(1000)
		await exercisePage.submitAnswer(longText)

		// Should handle without crashing
		await exercisePage.waitForAnswerProcessing()
		await exercisePage.expectInputStatus(EXERCISE_STATUS.WRONG_ANSWER)
	})

	test('should handle empty input gracefully', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Try to submit empty input
		await exercisePage.fillInput('')
		await exercisePage.clickSubmitButton()

		// Submit button should be disabled for empty input
		// or if enabled, should handle gracefully
		await page.waitForTimeout(500)
	})

	test('should show loading state during answer checking', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])

		// Briefly check for loading state (might be very fast)
		await exercisePage.expectInputStatus(EXERCISE_STATUS.CHECKING)
	})

	test('should handle rapid consecutive submissions', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Rapidly submit multiple answers
		for (let i = 0; i < 3; i++) {
			await exercisePage.fillInput(EXERCISE_DATA.VERBS_BE.WRONG_ANSWERS[0])
			await page.keyboard.press('Enter')
			await page.waitForTimeout(100) // Small delay
		}

		// Should handle gracefully without breaking
		await exercisePage.waitForAnswerProcessing()
		await exercisePage.expectIncorrectFeedback()
	})

	test('should maintain input focus during error states', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Answer incorrectly
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.WRONG_ANSWERS[0])
		await exercisePage.waitForAnswerProcessing()

		// Input should remain focused for correction
		await exercisePage.expectInputFocused()

		// After correction, should also maintain focus
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.waitForAutoAdvance()

		await exercisePage.expectInputFocused()
	})
})
