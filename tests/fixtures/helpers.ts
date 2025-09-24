import type {Page} from '@playwright/test'
import {DATA_ATTRIBUTES, ROUTES, SELECTORS} from './selectors'
import {EXERCISE_STATUS, TIMEOUTS, VIEWPORT_SIZES} from './test-data'

type ExerciseStatusValue =
	(typeof EXERCISE_STATUS)[keyof typeof EXERCISE_STATUS]

// Regex constants for performance
const START_EXERCISE_REGEX = /start exercise/i

export interface ProgressSnapshot {
	readonly progressCurrent: string | null
	readonly progressText: string
	readonly inputStatus: string | null
}

interface AutoAdvanceWaitArgs {
	readonly selector: string
	readonly attributeName: string
	readonly baselineAttribute: string | null
	readonly baselineText: string
	readonly inputSelector: string
	readonly statusAttribute: string
	readonly baselineStatus: string | null
	readonly targetStatuses: readonly string[]
}

function autoAdvanceCompleted({
	selector,
	attributeName,
	baselineAttribute,
	baselineText,
	inputSelector,
	statusAttribute,
	baselineStatus,
	targetStatuses
}: AutoAdvanceWaitArgs): boolean {
	const progressElement = document.querySelector<HTMLElement>(selector)
	if (!progressElement) {
		return true
	}

	const attributeValue = progressElement.getAttribute(attributeName)
	const attributeChanged =
		attributeValue !== null &&
		(baselineAttribute === null || attributeValue !== baselineAttribute)

	if (attributeChanged) {
		return true
	}

	const currentText = progressElement.textContent?.trim() ?? ''
	if (currentText !== baselineText) {
		return true
	}

	const inputElement = document.querySelector<HTMLElement>(inputSelector)
	if (!inputElement) {
		return true
	}

	const currentStatus = inputElement.getAttribute(statusAttribute)
	if (currentStatus === null) {
		return false
	}

	if (baselineStatus === null) {
		return targetStatuses.includes(currentStatus)
	}

	return (
		currentStatus !== baselineStatus && targetStatuses.includes(currentStatus)
	)
}

/**
 * Common test helper functions for DRY test code
 */

export class TestHelpers {
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	/**
	 * Wait for a specific timeout with optional description
	 * @deprecated Use specific state-based waiting instead of arbitrary timeouts
	 */
	async wait(timeout: number, _description?: string) {
		// Description parameter is used for debugging purposes
		// TODO: Replace with state-based waiting
		await this.page.waitForTimeout(timeout)
	}

	/**
	 * Check if viewport is mobile sized
	 */
	isMobile(): boolean {
		const viewport = this.page.viewportSize()
		return viewport ? viewport.width < VIEWPORT_SIZES.tablet.width : false
	}

	/**
	 * Check if viewport is desktop sized
	 */
	isDesktop(): boolean {
		const viewport = this.page.viewportSize()
		return viewport ? viewport.width >= VIEWPORT_SIZES.tablet.width : false
	}

	/**
	 * Get current theme from HTML data attribute
	 */
	async getCurrentTheme(): Promise<string | null> {
		return await this.page.locator('html').getAttribute(DATA_ATTRIBUTES.theme)
	}

	/**
	 * Get current UI language from dropdown data attribute
	 */
	async getCurrentUILanguage(): Promise<string | null> {
		const dropdown = this.page.locator(SELECTORS.uiLanguageDropdown).first()
		return await dropdown.getAttribute(DATA_ATTRIBUTES.uiLanguage)
	}

	/**
	 * Get current user language from selector data attribute
	 */
	async getCurrentUserLanguage(): Promise<string | null> {
		const selector = this.page
			.locator(SELECTORS.userLanguageSelector)
			.locator('div')
			.nth(1)
		return await selector.getAttribute(DATA_ATTRIBUTES.userLanguage)
	}

	/**
	 * Get exercise input status
	 */
	async getInputStatus(): Promise<string | null> {
		const input = this.page.locator(SELECTORS.exerciseInput)
		if ((await input.count()) === 0) {
			return null
		}
		return await input.getAttribute(DATA_ATTRIBUTES.inputStatus)
	}

	/**
	 * Check if auto advance is enabled
	 */
	async isAutoAdvanceEnabled(): Promise<boolean> {
		const enabled = await this.page
			.locator(SELECTORS.autoAdvanceToggle)
			.getAttribute(DATA_ATTRIBUTES.autoAdvanceEnabled)
		return enabled === 'true'
	}

	/**
	 * Fill input and submit answer
	 */
	async submitAnswer(answer: string) {
		const input = this.page.locator(SELECTORS.exerciseInput)
		await input.fill(answer)
		await input.press('Enter')
	}

	/**
	 * Click submit button instead of using Enter
	 */
	async clickSubmitButton() {
		await this.page.locator(SELECTORS.exerciseSubmitButton).click()
	}

	/**
	 * Navigate to home page and wait for load
	 */
	async goHome() {
		await this.page.goto(ROUTES.home)
		await this.page.locator(SELECTORS.mainHeading).waitFor()
	}

	/**
	 * Navigate to exercises page and wait for load
	 */
	async goToExercises() {
		await this.page.goto(ROUTES.exercises)
		await this.page.locator(SELECTORS.navCardExercises).first().waitFor()
	}

	/**
	 * Start first exercise (verbs-be)
	 */
	async startFirstExercise() {
		const exerciseCard = this.page
			.locator('.grid.gap-6 .bg-white.rounded-lg.shadow-sm')
			.first()
		const startButton = exerciseCard.getByRole('link', {
			name: START_EXERCISE_REGEX
		})
		await startButton.click()
		await this.page.locator(SELECTORS.exerciseInput).waitFor()
	}

	/**
	 * Start second exercise (verbs-have)
	 */
	async startSecondExercise() {
		const exerciseCard = this.page
			.locator('.grid.gap-6 .bg-white.rounded-lg.shadow-sm')
			.nth(1)
		const startButton = exerciseCard.getByRole('link', {
			name: START_EXERCISE_REGEX
		})
		await startButton.click()
		await this.page.locator(SELECTORS.exerciseInput).waitFor()
	}

	async getProgressSnapshot(): Promise<ProgressSnapshot | null> {
		const progressLocator = this.page.locator(SELECTORS.progressText)

		if ((await progressLocator.count()) === 0) {
			return null
		}

		const [progressCurrent, progressTextContent] = await Promise.all([
			progressLocator.getAttribute(DATA_ATTRIBUTES.progressCurrent),
			progressLocator.textContent()
		])

		const inputLocator = this.page.locator(SELECTORS.exerciseInput)
		const inputStatus = (await inputLocator.count())
			? await inputLocator.getAttribute(DATA_ATTRIBUTES.inputStatus)
			: null

		return {
			progressCurrent,
			progressText: progressTextContent?.trim() ?? '',
			inputStatus
		}
	}

	/**
	 * Wait for auto advance to complete
	 */
	async waitForAutoAdvance(baseline?: ProgressSnapshot | null) {
		const progressLocator = this.page.locator(SELECTORS.progressText)

		if ((await progressLocator.count()) === 0) {
			return
		}

		const snapshot = baseline ?? (await this.getProgressSnapshot())
		if (!snapshot) {
			return
		}

		await this.page.waitForFunction(
			autoAdvanceCompleted,
			{
				selector: SELECTORS.progressText,
				attributeName: DATA_ATTRIBUTES.progressCurrent,
				baselineAttribute: snapshot.progressCurrent,
				baselineText: snapshot.progressText,
				inputSelector: SELECTORS.exerciseInput,
				statusAttribute: DATA_ATTRIBUTES.inputStatus,
				baselineStatus: snapshot.inputStatus,
				targetStatuses: [
					EXERCISE_STATUS.waitingInput,
					EXERCISE_STATUS.completed,
					EXERCISE_STATUS.requireContinue
				]
			},
			{timeout: TIMEOUTS.autoAdvance}
		)
	}

	/**
	 * Wait for answer processing
	 */
	async waitForAnswerProcessing({
		statuses
	}: {
		statuses?: readonly ExerciseStatusValue[]
	} = {}) {
		const defaultStatuses: ExerciseStatusValue[] = [
			EXERCISE_STATUS.correctAnswer,
			EXERCISE_STATUS.requireCorrection,
			EXERCISE_STATUS.requireContinue,
			EXERCISE_STATUS.waitingInput,
			EXERCISE_STATUS.completed
		]

		const targetStatuses = [...(statuses ?? defaultStatuses)]

		await this.page.waitForFunction(
			({selector, statuses: expected}) => {
				const element = document.querySelector<HTMLElement>(selector)
				if (!element) {
					return true
				}

				const status = element.getAttribute('data-status') ?? ''
				return expected.includes(status)
			},
			{selector: SELECTORS.exerciseInput, statuses: targetStatuses},
			{timeout: TIMEOUTS.slow}
		)
	}

	/**
	 * Get progress text content
	 */
	async getProgressText(): Promise<string | null> {
		return await this.page.locator(SELECTORS.progressText).textContent()
	}
}
