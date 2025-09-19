import {expect, type Locator, type Page} from '@playwright/test'
import {TestHelpers} from '../fixtures/helpers'
import {ROUTES, SELECTORS} from '../fixtures/selectors'

export class HomePage {
	private readonly page: Page
	private readonly helpers: TestHelpers

	constructor(page: Page) {
		this.page = page
		this.helpers = new TestHelpers(page)
	}

	// Locators
	get exercisesCard(): Locator {
		return this.page.locator(SELECTORS.navCardExercises)
	}

	get builderCard(): Locator {
		return this.page.locator(SELECTORS.navCardBuilder)
	}

	get themeToggle(): Locator {
		return this.page.locator(SELECTORS.themeToggle).first()
	}

	get uiLanguageDropdown(): Locator {
		return this.page.locator(SELECTORS.uiLanguageDropdown).first()
	}

	get mainHeading(): Locator {
		return this.page.locator(SELECTORS.mainHeading)
	}

	// Actions
	async goto() {
		await this.page.goto(ROUTES.home)
		await this.mainHeading.waitFor()
	}

	async clickExercisesCard() {
		await this.exercisesCard.click()
	}

	async clickBuilderCard() {
		await this.builderCard.click()
	}

	async toggleTheme() {
		await this.themeToggle.click()
	}

	async openLanguageDropdown() {
		await this.uiLanguageDropdown.click()
	}

	async selectUILanguage(language: string) {
		await this.openLanguageDropdown()
		const option = this.page.locator(SELECTORS.uiLanguageOption(language))
		await option.click()
	}

	// Assertions
	async expectNavigationCardsVisible() {
		await expect(this.exercisesCard).toBeVisible()
		await expect(this.builderCard).toBeVisible()
	}

	async expectTheme(expectedTheme: string) {
		const currentTheme = await this.helpers.getCurrentTheme()
		expect(currentTheme).toBe(expectedTheme)
	}

	async expectUILanguage(expectedLanguage: string) {
		const currentLanguage = await this.helpers.getCurrentUILanguage()
		expect(currentLanguage).toBe(expectedLanguage)
	}

	async expectHeadingText(expectedText: string) {
		await expect(this.mainHeading).toHaveText(expectedText)
	}

	async expectPageLoaded() {
		await expect(this.mainHeading).toBeVisible()
		await this.expectNavigationCardsVisible()
	}
}
