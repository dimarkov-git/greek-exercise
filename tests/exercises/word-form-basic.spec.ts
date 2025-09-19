import {expect, test} from '@playwright/test'
import {ROUTES} from '../fixtures/selectors'
import {EXERCISE_DATA, EXERCISE_STATUS} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {ExercisePage} from '../pages/ExercisePage'

test.describe('Word Form Exercise - Basic Functionality', () => {
	test.beforeEach(async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		await exerciseLibrary.goto()
	})

	test('should load exercise page correctly', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startFirstExercise()

		await expect(page).toHaveURL(ROUTES.EXERCISE_VERBS_BE)
		await exercisePage.expectPageLoaded()
		await exercisePage.expectAutoAdvanceEnabled(true)
	})

	test('should accept correct answers', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startFirstExercise()

		// Answer first question correctly
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.expectCorrectFeedback()
		await exercisePage.waitForAutoAdvance()

		// Should advance to next question automatically
		await exercisePage.expectProgressText(/2.*(of|из|από).*\d+/)
	})

	test('should handle incorrect answers', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startFirstExercise()

		// Answer incorrectly
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.WRONG_ANSWERS[0])
		await exercisePage.expectIncorrectFeedback()

		// Should require correction
		await exercisePage.expectInputStatus(EXERCISE_STATUS.REQUIRE_CORRECTION)
	})

	test('should handle tone-insensitive answers (currently requires tones)', async ({
		page
	}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startFirstExercise()

		// Answer without tones (currently not accepted - requires exact match)
		await exercisePage.submitAnswer(
			EXERCISE_DATA.VERBS_BE.ALTERNATIVE_ANSWERS.TONE_FREE[0]
		)
		await exercisePage.expectIncorrectFeedback()

		// Should require correction
		await exercisePage.expectInputStatus(EXERCISE_STATUS.REQUIRE_CORRECTION)

		// Enter correct answer with tones
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.expectCorrectFeedback()
		await exercisePage.waitForAutoAdvance()

		// Should advance to next question
		await exercisePage.expectProgressText(/2.*(of|из|από).*\d+/)
	})

	test('should complete full exercise sequence', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startFirstExercise()

		// Answer all questions correctly
		await exercisePage.answerUntilCompletion(
			EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS
		)

		// Should show completion screen
		await exercisePage.expectExerciseCompleted()
	})

	test('should handle keyboard navigation', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startFirstExercise()

		// Input should be auto-focused
		await exercisePage.expectInputFocused()

		// Should be able to type and submit with Enter
		await page.keyboard.type(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await page.keyboard.press('Enter')

		await exercisePage.expectCorrectFeedback()
	})

	test('should show progress indicator', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startFirstExercise()

		// Should start at question 1
		await exercisePage.expectProgressText(/1.*(of|из|από).*\d+/)

		// Answer and check progress updates
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_BE.CORRECT_ANSWERS[0])
		await exercisePage.waitForAutoAdvance()

		await exercisePage.expectProgressText(/2.*(of|из|από).*\d+/)
	})

	test('should handle alternative exercise (verbs-have)', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startSecondExercise()

		await expect(page).toHaveURL(ROUTES.EXERCISE_VERBS_HAVE)
		await exercisePage.expectPageLoaded()

		// Answer first question
		await exercisePage.submitAnswer(EXERCISE_DATA.VERBS_HAVE.CORRECT_ANSWERS[0])
		await exercisePage.expectCorrectFeedback()
		await exercisePage.waitForAutoAdvance()

		await exercisePage.expectProgressText(/2.*(of|из|από).*\d+/)
	})

	test('should handle alternative answers in verbs-have', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.startSecondExercise()

		// Answer all questions to reach the final one with alternatives
		const answers = EXERCISE_DATA.VERBS_HAVE.CORRECT_ANSWERS.slice(0, -1) // All except last
		await exercisePage.answerSequence(answers)

		// Should be at final question - test alternative answer
		await exercisePage.expectProgressText(/6.*(of|из|από).*6/)
		await exercisePage.submitAnswer(
			EXERCISE_DATA.VERBS_HAVE.ALTERNATIVE_ANSWERS.FINAL_QUESTION[1]
		)

		await exercisePage.expectCorrectFeedback()
		await exercisePage.expectExerciseCompleted()
	})
})
