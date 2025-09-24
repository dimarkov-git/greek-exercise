import {expect, type Locator, type Page} from '@playwright/test'
import {type ProgressSnapshot, TestHelpers} from '../fixtures/helpers'
import {SELECTORS} from '../fixtures/selectors'
import {EXERCISE_STATUS, TIMEOUTS} from '../fixtures/test-data'

type ExerciseStatusValue =
	(typeof EXERCISE_STATUS)[keyof typeof EXERCISE_STATUS]

// Regex constants for performance
const CONTINUE_BUTTON_REGEX = /continue|συνέχεια|продолжить/i
const COMPLETION_MESSAGE_REGEX =
	/completed|ολοκληρώθηκε|ολοκληρώσατε|συγχαρητήρια|завершено/i

export class ExercisePage {
	private readonly page: Page
	private readonly helpers: TestHelpers
	private progressBaseline: ProgressSnapshot | null = null

	constructor(page: Page) {
		this.page = page
		this.helpers = new TestHelpers(page)
	}

	// Locators
	get input(): Locator {
		return this.page.locator(SELECTORS.exerciseInput)
	}

	get submitButton(): Locator {
		return this.page.locator(SELECTORS.exerciseSubmitButton)
	}

	get autoAdvanceToggle(): Locator {
		return this.page.locator(SELECTORS.autoAdvanceToggle)
	}

	get progressText(): Locator {
		return this.page.locator(SELECTORS.progressText)
	}

	get backButton(): Locator {
		return this.page.locator(SELECTORS.exerciseBackButton)
	}

	get exerciseProgress(): Locator {
		return this.page.locator(SELECTORS.exerciseProgress)
	}

	get continueButton(): Locator {
		return this.page.getByRole('button', {
			name: CONTINUE_BUTTON_REGEX
		})
	}

	get completionMessage(): Locator {
		return this.page.getByText(COMPLETION_MESSAGE_REGEX)
	}

	// Actions
	async fillInput(text: string) {
		await this.input.fill(text)
	}

	async submitAnswer(answer: string) {
		await this.fillInput(answer)
		this.progressBaseline = await this.helpers.getProgressSnapshot()
		await this.input.press('Enter')
	}

	async clickSubmitButton() {
		this.progressBaseline = await this.helpers.getProgressSnapshot()
		await this.submitButton.click()
	}

	async toggleAutoAdvance() {
		await this.autoAdvanceToggle.click()
	}

	async clickBackButton() {
		await this.backButton.click()
	}

	async clickContinueButton() {
		await this.continueButton.click()
	}

	async waitForAutoAdvance() {
		await this.helpers.waitForAutoAdvance(this.progressBaseline)
		this.progressBaseline = null
	}

	async waitForAnswerProcessing(statuses?: readonly ExerciseStatusValue[]) {
		await this.helpers.waitForAnswerProcessing({statuses})
	}

	async answerSequence(answers: string[]) {
		// Sequential answer submission is intentional for testing user flow
		for (const answer of answers) {
			await this.submitAnswer(answer)
			await this.waitForAutoAdvance()
		}
	}

	async answerUntilCompletion(answers: string[]) {
		// Sequential answer submission is intentional for testing user flow
		const autoAdvanceInitiallyEnabled =
			await this.helpers.isAutoAdvanceEnabled()

		if (autoAdvanceInitiallyEnabled) {
			await this.toggleAutoAdvance()
		}

		try {
			for (const answer of answers) {
				await this.input.waitFor({
					state: 'visible',
					timeout: TIMEOUTS.normal
				})

				await this.submitAnswer(answer)
				await this.waitForAnswerProcessing()

				const shouldContinue = await this.handleAnswerStatus()
				if (!shouldContinue) {
					break
				}
			}
		} finally {
			await this.restoreAutoAdvanceIfNeeded(autoAdvanceInitiallyEnabled)
		}
	}

	private async restoreAutoAdvanceIfNeeded(wasEnabled: boolean) {
		if (!wasEnabled) {
			return
		}

		try {
			await this.toggleAutoAdvance()
		} catch {
			// Ignore if toggle is no longer available (exercise completed)
		}
	}

	private async handleAnswerStatus(): Promise<boolean> {
		let status = await this.helpers.getInputStatus()

		if (status === null) {
			return false
		}

		if (status === EXERCISE_STATUS.correctAnswer) {
			await this.waitForAnswerProcessing([
				EXERCISE_STATUS.requireContinue,
				EXERCISE_STATUS.waitingInput,
				EXERCISE_STATUS.completed
			])
			status = await this.helpers.getInputStatus()
		}

		if (status === null || status === EXERCISE_STATUS.completed) {
			return false
		}

		if (status === EXERCISE_STATUS.requireContinue) {
			await expect(this.continueButton).toBeEnabled({
				timeout: TIMEOUTS.normal
			})
			await this.clickContinueButton()
			await this.waitForAnswerProcessing([
				EXERCISE_STATUS.waitingInput,
				EXERCISE_STATUS.completed
			])
			const nextStatus = await this.helpers.getInputStatus()
			return !(nextStatus === null || nextStatus === EXERCISE_STATUS.completed)
		}

		return true
	}

	// Assertions
	async expectInputVisible() {
		await expect(this.input).toBeVisible()
	}

	async expectInputFocused() {
		await expect(this.input).toBeFocused()
	}

	async expectInputStatus(expectedStatus: string) {
		const currentStatus = await this.helpers.getInputStatus()
		expect(currentStatus).toBe(expectedStatus)
	}

	async expectAutoAdvanceEnabled(enabled: boolean) {
		const isEnabled = await this.helpers.isAutoAdvanceEnabled()
		expect(isEnabled).toBe(enabled)
	}

	async expectProgressText(expectedText: string | RegExp) {
		await expect(this.progressText).toHaveText(expectedText)
	}

	async expectCorrectFeedback() {
		await this.waitForAnswerProcessing([
			EXERCISE_STATUS.correctAnswer,
			EXERCISE_STATUS.requireContinue,
			EXERCISE_STATUS.waitingInput
		])
		const status = await this.helpers.getInputStatus()
		expect([
			EXERCISE_STATUS.correctAnswer,
			EXERCISE_STATUS.requireContinue,
			EXERCISE_STATUS.waitingInput
		]).toContain(status)
	}

	async expectIncorrectFeedback() {
		// Check for incorrect answer indicators (red styling, etc.)
		const status = await this.input.getAttribute('data-status')
		expect([
			EXERCISE_STATUS.wrongAnswer,
			EXERCISE_STATUS.requireCorrection
		]).toContain(status)
	}

	async expectExerciseCompleted() {
		await expect(this.completionMessage).toBeVisible({
			timeout: TIMEOUTS.completion
		})
	}

	async expectPageLoaded() {
		await this.expectInputVisible()
		await this.expectInputFocused()
		await expect(this.exerciseProgress).toBeVisible()
	}
}
