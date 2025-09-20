import {expect, test} from '@playwright/test'
import {SELECTORS} from '../fixtures/selectors'
import {THEMES, UI_TEXT, VIEWPORT_SIZES} from '../fixtures/test-data'
import {HomePage} from '../pages/HomePage'

test.describe('Theme - Basic', () => {
	test('should start with light theme by default', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectTheme(THEMES.light)
	})

	test('should toggle theme on desktop', async ({page}) => {
		const homePage = new HomePage(page)

		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()

		// Verify starting state
		await homePage.expectTheme(THEMES.light)
		await expect(homePage.themeToggle).toBeVisible()

		// Toggle to dark theme
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.dark)

		// Toggle back to light theme
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.light)
	})
})

test.describe('Theme - Mobile', () => {
	test('should toggle theme on mobile', async ({page}) => {
		const homePage = new HomePage(page)

		await page.setViewportSize(VIEWPORT_SIZES.mobile)
		await homePage.goto()

		// Verify starting state
		await homePage.expectTheme(THEMES.light)

		// On mobile, theme toggle is in the mobile menu
		// Open mobile menu first
		const menuButton = page.getByRole('button', {
			name: UI_TEXT.menuLabels.menuButton
		})
		await menuButton.click()

		// Verify mobile menu is visible
		await homePage.expectMobileMenuVisible()

		// Theme toggle should now be visible in mobile menu
		const mobileThemeToggle = page.locator(SELECTORS.mobileMenuThemeToggle)
		await expect(mobileThemeToggle).toBeVisible()

		// Toggle to dark theme
		await mobileThemeToggle.click()
		await homePage.expectTheme(THEMES.dark)
	})
})

test.describe('Theme - Persistence', () => {
	test('should persist theme setting after page reload', async ({page}) => {
		const homePage = new HomePage(page)

		// Use desktop viewport for persistence test
		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.dark)

		// Reload page
		await page.reload()
		await homePage.expectPageLoaded()

		// Theme should persist
		await homePage.expectTheme(THEMES.dark)
	})

	test('should persist theme setting across navigation', async ({page}) => {
		const homePage = new HomePage(page)

		// Use desktop viewport for navigation test
		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.dark)

		// Navigate to exercises page
		await homePage.clickExercisesCard()
		await expect(page).toHaveURL('/exercises')

		// Theme should persist
		await expect(page.locator('html')).toHaveAttribute(
			'data-theme',
			THEMES.dark
		)

		// Navigate back to home
		await page.goto('/')
		await homePage.expectTheme(THEMES.dark)
	})
})

test.describe('Theme - Toggle Button', () => {
	test('should update theme toggle button appearance', async ({page}) => {
		const homePage = new HomePage(page)

		// Use desktop viewport for theme toggle button test
		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()

		// Light theme shows moon icon (for switching to dark)
		await homePage.expectTheme(THEMES.light)
		await expect(homePage.themeToggle).toHaveAttribute(
			'data-current-theme',
			THEMES.light
		)

		// Toggle to dark theme
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.dark)
		await expect(homePage.themeToggle).toHaveAttribute(
			'data-current-theme',
			THEMES.dark
		)
	})
})

test.describe('Theme - Page Elements', () => {
	test('should apply theme to all page elements', async ({page}) => {
		const homePage = new HomePage(page)

		// Use desktop viewport for theme application test
		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()

		// Test light theme styling
		await homePage.expectTheme(THEMES.light)
		await expect(page.locator('html')).toHaveAttribute(
			'data-theme',
			THEMES.light
		)

		// Toggle to dark theme
		await homePage.toggleTheme()
		await homePage.expectTheme(THEMES.dark)
		await expect(page.locator('html')).toHaveAttribute(
			'data-theme',
			THEMES.dark
		)
	})
})

test.describe('Theme - Rapid Toggling', () => {
	test('should handle rapid theme toggling', async ({page}) => {
		const homePage = new HomePage(page)

		// Use desktop viewport for rapid theme toggling test
		await page.setViewportSize(VIEWPORT_SIZES.desktop)
		await homePage.goto()

		// Rapidly toggle theme multiple times
		for (let i = 0; i < 5; i++) {
			await homePage.toggleTheme()
			// Wait for theme to apply using state-based assertion
			await expect(page.locator('html')).toHaveAttribute(
				'data-theme',
				/^(light|dark)$/
			)
		}

		// Should end up on dark theme (odd number of toggles)
		await homePage.expectTheme(THEMES.dark)
	})
})
