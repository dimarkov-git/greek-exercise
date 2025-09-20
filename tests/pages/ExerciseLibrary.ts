import {expect, type Locator, type Page} from '@playwright/test'
import {TestHelpers} from '../fixtures/helpers'
import {ROUTES, SELECTORS} from '../fixtures/selectors'

export class ExerciseLibrary {
	private readonly page: Page

	constructor(page: Page) {
		this.page = page
		this.helpers = new TestHelpers(page)
	}

	// Locators
	get userLanguageSelector(): Locator {
		return this.page.locator(SELECTORS.userLanguageSelector)
	}

	get firstExerciseCard(): Locator {
		return this.page
			.locator('.grid.gap-6 .bg-white.rounded-lg.shadow-sm')
			.first()
	}

	get secondExerciseCard(): Locator {
		return this.page
			.locator('.grid.gap-6 .bg-white.rounded-lg.shadow-sm')
			.nth(1)
	}

	get exerciseCards(): Locator {
		return this.page.locator('.grid.gap-6 .bg-white.rounded-lg.shadow-sm')
	}

	// Actions
	async goto() {
		await this.page.goto(ROUTES.exercises)
		await this.exerciseCards.first().waitFor()
	}

	async selectUserLanguage(language: string) {
		const option = this.page.locator(SELECTORS.userLanguageOption(language))
		await option.click()
	}

	async startFirstExercise() {
		const startButton = this.firstExerciseCard.locator(SELECTORS.startExerciseButton)
		await startButton.click()
	}

	async startSecondExercise() {
		const startButton = this.secondExerciseCard.locator(SELECTORS.startExerciseButton)
		await startButton.click()
	}

	async startExerciseByIndex(index: number) {
		const exerciseCard = this.exerciseCards.nth(index)
		const startButton = exerciseCard.locator(SELECTORS.startExerciseButton)
		await startButton.click()
	}

	// Assertions
	async expectPageLoaded() {
		await expect(this.exerciseCards.first()).toBeVisible()
		await expect(this.userLanguageSelector).toBeVisible()
	}

	async expectUserLanguageSelected(language: string) {
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
