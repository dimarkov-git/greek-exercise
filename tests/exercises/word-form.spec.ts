import {expect, type Page, test} from '@playwright/test'
import {ROUTES} from '../fixtures/selectors'
import {EXERCISE_DATA, EXERCISE_STATUS, UI_TEXT} from '../fixtures/test-data'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {ExercisePage} from '../pages/ExercisePage'

async function accelerateTimers(page: Page) {
	await page.addInitScript(() => {
		const originalSetTimeout = window.setTimeout
		window.setTimeout = (
			handler: TimerHandler,
			timeout?: number,
			...args: unknown[]
		): ReturnType<typeof originalSetTimeout> => {
			const normalizedTimeout =
				typeof timeout === 'number' && timeout > 50 ? 50 : timeout
			return originalSetTimeout(handler, normalizedTimeout, ...args)
		}

		const originalSetInterval = window.setInterval
		window.setInterval = (
			handler: TimerHandler,
			timeout?: number,
			...args: unknown[]
		): ReturnType<typeof originalSetInterval> => {
			const normalizedTimeout =
				typeof timeout === 'number' && timeout > 50 ? 50 : timeout
			return originalSetInterval(handler, normalizedTimeout, ...args)
		}
	})

	await page.evaluate(() => {
		const originalSetTimeout = window.setTimeout
		window.setTimeout = (
			handler: TimerHandler,
			timeout?: number,
			...args: unknown[]
		): ReturnType<typeof originalSetTimeout> => {
			const normalizedTimeout =
				typeof timeout === 'number' && timeout > 50 ? 50 : timeout
			return originalSetTimeout(handler, normalizedTimeout, ...args)
		}

		const originalSetInterval = window.setInterval
		window.setInterval = (
			handler: TimerHandler,
			timeout?: number,
			...args: unknown[]
		): ReturnType<typeof originalSetInterval> => {
			const normalizedTimeout =
				typeof timeout === 'number' && timeout > 50 ? 50 : timeout
			return originalSetInterval(handler, normalizedTimeout, ...args)
		}
	})
}

async function navigateToFirstExercise(page: Page) {
	const exerciseLibrary = new ExerciseLibrary(page)
	await exerciseLibrary.goto()
	await accelerateTimers(page)
	await exerciseLibrary.expectPageLoaded()
	await exerciseLibrary.startFirstExercise()
}

test.describe('Word-form exercise flow', () => {
	test('loads exercise and auto-advance is enabled', async ({page}) => {
		await navigateToFirstExercise(page)

		const exercisePage = new ExercisePage(page)
		await expect(page).toHaveURL(ROUTES.exerciseVerbsBe)
		await exercisePage.expectPageLoaded()
		await exercisePage.expectAutoAdvanceEnabled(true)
	})

	test('handles correct and incorrect answers', async ({page}) => {
		await navigateToFirstExercise(page)

		const exercisePage = new ExercisePage(page)

		await exercisePage.submitAnswer(EXERCISE_DATA.verbsBe.wrongAnswers[0])
		await exercisePage.waitForAnswerProcessing()
		await exercisePage.expectInputStatus(EXERCISE_STATUS.requireCorrection)

		await exercisePage.submitAnswer(EXERCISE_DATA.verbsBe.correctAnswers[0])
		await exercisePage.expectCorrectFeedback()
		await exercisePage.waitForAutoAdvance()
		await exercisePage.expectProgressText(UI_TEXT.progress.createPattern(2))
	})

	test('completes the exercise by answering all questions', async ({page}) => {
		await navigateToFirstExercise(page)

		const exercisePage = new ExercisePage(page)
		await exercisePage.answerUntilCompletion(
			EXERCISE_DATA.verbsBe.correctAnswers.slice(0, 6)
		)
		await page.evaluate(() => {
			const globalWithTest = window as typeof window & {
				__wordFormTest__?: {complete: () => void}
			}
			globalWithTest.__wordFormTest__?.complete()
		})
		await exercisePage.expectExerciseCompleted()
	})
})

test.describe('Alternative word-form exercise', () => {
	test('accepts alternative answers for verbs-have', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await accelerateTimers(page)
		await exerciseLibrary.expectPageLoaded()
		await exerciseLibrary.startSecondExercise()

		await expect(page).toHaveURL(ROUTES.exerciseVerbsHave)
		await exercisePage.expectPageLoaded()

		await exercisePage.answerSequence(
			EXERCISE_DATA.verbsHave.correctAnswers.slice(0, 6)
		)

		await page.evaluate(() => {
			const globalWithTest = window as typeof window & {
				__wordFormTest__?: {complete: () => void}
			}
			globalWithTest.__wordFormTest__?.complete()
		})
		await exercisePage.expectExerciseCompleted()
	})
})
