import {expect, type Locator, type Page} from '@playwright/test'
import {TestHelpers} from '../fixtures/helpers'
import {SELECTORS} from '../fixtures/selectors'
import {EXERCISE_STATUS, TIMEOUTS} from '../fixtures/test-data'

// Regex constants for performance
const CONTINUE_BUTTON_REGEX = /continue|συνέχεια|продолжить/i
const COMPLETION_MESSAGE_REGEX = /completed|ολοκληρώθηκε|завершено/i

export class ExercisePage {
	private readonly page: Page
	private readonly helpers: TestHelpers

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
		await this.input.press('Enter')
	}

	async clickSubmitButton() {
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
		await this.helpers.waitForAutoAdvance()
	}

	async waitForAnswerProcessing() {
		await this.helpers.waitForAnswerProcessing()
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
		for (const answer of answers) {
			if (await this.input.isVisible()) {
				await this.submitAnswer(answer)
				await this.waitForAutoAdvance()
			} else {
				break // Exercise might be complete
			}
		}
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
		// Check for correct answer indicators (green styling, etc.)
		await expect(this.input).toHaveAttribute(
			'data-status',
			EXERCISE_STATUS.correctAnswer
		)
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
