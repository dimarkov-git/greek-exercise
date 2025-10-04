import {expect, type Locator, type Page} from '@playwright/test'
import {ROUTES, SELECTORS} from '../fixtures/selectors'

export class ExerciseLibrary {
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	// Locators
	get userLanguageSelector(): Locator {
		return this.page.locator(SELECTORS.userLanguageSelector)
	}

	get firstExerciseCard(): Locator {
		return this.page.getByTestId('exercise-card').first()
	}

	get secondExerciseCard(): Locator {
		return this.page.getByTestId('exercise-card').nth(1)
	}

	get exerciseCards(): Locator {
		return this.page.getByTestId('exercise-card')
	}

	// Actions
	async goto() {
		await this.page.goto(ROUTES.exercises)
		await this.exerciseCards
			.first()
			.waitFor({state: 'visible', timeout: 10_000})
	}

	async expandSettings() {
		// Click the Settings button to expand the collapsed settings panel
		const settingsButton = this.page.getByRole('button', {name: /settings/i})
		await settingsButton.click()
		// Wait for the user language selector to be visible
		await this.userLanguageSelector.waitFor({state: 'visible'})
	}

	async selectUserLanguage(language: string) {
		// Expand settings first if collapsed
		const isVisible = await this.userLanguageSelector.isVisible()
		if (!isVisible) {
			await this.expandSettings()
		}
		const option = this.page.locator(SELECTORS.userLanguageOption(language))
		await option.click()
	}

	async startFirstExercise() {
		const startButton = this.firstExerciseCard.locator(
			SELECTORS.startExerciseButton
		)
		await startButton.click()
	}

	async startSecondExercise() {
		const startButton = this.secondExerciseCard.locator(
			SELECTORS.startExerciseButton
		)
		await startButton.click()
	}

	async startExerciseByIndex(index: number) {
		const exerciseCard = this.exerciseCards.nth(index)
		const startButton = exerciseCard.locator(SELECTORS.startExerciseButton)
		await startButton.click()
	}

	async startExerciseById(exerciseId: string) {
		const exerciseCard = this.page.locator(
			`[data-testid="exercise-card"][data-exercise-id="${exerciseId}"]`
		)
		const startButton = exerciseCard.locator(SELECTORS.startExerciseButton)
		await startButton.click()
	}

	// Assertions
	async expectPageLoaded() {
		await expect(this.exerciseCards.first()).toBeVisible()
	}

	async expectUserLanguageSelected(language: string) {
		// Expand settings first if collapsed
		const isVisible = await this.userLanguageSelector.isVisible()
		if (!isVisible) {
			await this.expandSettings()
		}
		const option = this.page.locator(SELECTORS.userLanguageOption(language))
		const isSelected = await option.getAttribute('data-selected')
		expect(isSelected).toBe('true')
	}

	async expectExerciseCardsVisible() {
		await expect(this.exerciseCards.first()).toBeVisible()
		const cardCount = await this.exerciseCards.count()
		expect(cardCount).toBeGreaterThan(0)
	}
}
