import {expect, type Locator, type Page} from '@playwright/test'
import {TestHelpers} from '../fixtures/helpers'
import {DATA_ATTRIBUTES, ROUTES, SELECTORS} from '../fixtures/selectors'

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

	// Helper methods
	isMobile(): boolean {
		const viewport = this.page.viewportSize()
		return viewport ? viewport.width < 768 : false
	}

	async openMobileMenu() {
		const menuButton = this.page.getByRole('button', {name: /menu/i}).first()
		await menuButton.click()
		await this.expectMobileMenuVisible()
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
		const mobile = await this.isMobile()
		if (mobile) {
			await this.openMobileMenu()
			// In mobile menu, use visible theme toggle
			const mobileThemeToggle = this.page
				.locator('[data-testid="mobile-menu"]')
				.locator(SELECTORS.themeToggle)
			await mobileThemeToggle.click()
			// Close mobile menu after interaction
			await this.page.keyboard.press('Escape')
		} else {
			await this.themeToggle.click()
		}
	}

	async openLanguageDropdown() {
		const mobile = await this.isMobile()
		if (mobile) {
			await this.openMobileMenu()
			// In mobile menu, use visible language dropdown
			const mobileLanguageDropdown = this.page
				.locator('[data-testid="mobile-menu"]')
				.locator(SELECTORS.uiLanguageDropdown)
			await mobileLanguageDropdown.click()
		} else {
			await this.uiLanguageDropdown.click()
		}
	}

	async selectUILanguage(language: string) {
		await this.openLanguageDropdown()
		const option = this.page.locator(SELECTORS.uiLanguageOption(language))
		await option.click()
		const mobile = await this.isMobile()
		if (mobile) {
			// Close mobile menu after selection
			await this.page.keyboard.press('Escape')
			// Wait for menu animation to complete
			await this.page.waitForTimeout(300)
		}
	}

	// Assertions
	async expectNavigationCardsVisible() {
		await expect(this.exercisesCard).toBeVisible()
		await expect(this.builderCard).toBeVisible()
	}

	async expectTheme(expectedTheme: string) {
		await expect(this.page.locator('html')).toHaveAttribute(
			DATA_ATTRIBUTES.theme,
			expectedTheme
		)
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

	// Enhanced state validation methods
	async expectLanguageDropdownClosed() {
		const dropdown = this.uiLanguageDropdown
		const isOpenAttribute = await dropdown.getAttribute('data-is-open')
		expect(isOpenAttribute).toBe('false')

		// Ensure dropdown menu is not visible
		const dropdownMenu = this.page.locator(SELECTORS.uiLanguageDropdownMenu)
		await expect(dropdownMenu).not.toBeVisible()
	}

	async expectLanguageDropdownOpen() {
		const dropdown = this.uiLanguageDropdown
		const isOpenAttribute = await dropdown.getAttribute('data-is-open')
		expect(isOpenAttribute).toBe('true')

		// Ensure dropdown menu is visible
		const dropdownMenu = this.page.locator(SELECTORS.uiLanguageDropdownMenu)
		await expect(dropdownMenu).toBeVisible()
	}

	async expectMobileMenuVisible() {
		const mobileMenu = this.page.locator(SELECTORS.mobileMenu)
		await expect(mobileMenu).toBeVisible()
	}

	async expectMobileMenuHidden() {
		const mobileMenu = this.page.locator(SELECTORS.mobileMenu)
		await expect(mobileMenu).not.toBeVisible()
	}

	async expectLanguageOptionAvailable(language: string) {
		const option = this.page.locator(SELECTORS.uiLanguageOption(language))
		await expect(option).toBeVisible()
		await expect(option).toBeEnabled()
	}
}
