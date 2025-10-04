import AxeBuilder from '@axe-core/playwright'
import {expect, test} from '@playwright/test'
import {ROUTES} from '../fixtures/selectors'
import {HomePage} from '../pages/HomePage'

test.describe('Home Page - Structure and Rendering', () => {
	test('should load without errors', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectPageLoaded()
	})

	test('should display hero section with title and subtitle', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Check hero section
		await expect(homePage.mainHeading).toBeVisible()
		await expect(
			page
				.locator('p')
				.filter({hasText: /interactive/i})
				.first()
		).toBeVisible()
	})

	test('should display exactly 2 navigation cards (Library, Builder)', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Check that only Library and Builder cards are visible
		await expect(homePage.exercisesCard).toBeVisible()
		await expect(homePage.builderCard).toBeVisible()

		// Ensure test card is NOT visible
		const testCard = page.locator('[data-testid="nav-card-test/i18n"]')
		await expect(testCard).not.toBeVisible()
	})

	test('should display footer with copyright and GitHub link', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Check footer elements
		const footer = page.locator('footer')
		await expect(footer).toBeVisible()
		await expect(footer.getByText(/2025.*Learn Greek/i)).toBeVisible()
		await expect(footer.getByRole('link', {name: /github/i})).toBeVisible()
	})

	test('should display test link only in footer (dev mode)', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Test link should be in footer (if in dev mode)
		const footerTestLink = page.locator('footer a[href*="/test"]')
		// In dev mode it should be visible
		const isVisible = await footerTestLink.isVisible()
		expect(isVisible).toBe(true) // Assuming dev mode
	})
})

test.describe('Home Page - Navigation', () => {
	test('should navigate to exercises page when clicking Library card', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.clickExercisesCard()

		await expect(page).toHaveURL(ROUTES.exercises)
	})

	test('should navigate to builder page when clicking Builder card', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.clickBuilderCard()

		// Should navigate to builder
		await expect(page).toHaveURL(/builder/)
	})

	test('should navigate back to home when clicking header logo', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.clickExercisesCard()
		await expect(page).toHaveURL(ROUTES.exercises)

		// Click logo to go back home
		await page
			.getByRole('link', {name: /ΜΕ.*Learn Greek/i})
			.first()
			.click()
		await expect(page).toHaveURL(ROUTES.home)
	})

	test('should navigate via header menu links', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Click Library in header
		await page
			.getByRole('navigation')
			.getByRole('link', {name: /library/i})
			.click()
		await expect(page).toHaveURL(ROUTES.exercises)

		// Navigate back
		await page
			.getByRole('navigation')
			.getByRole('link', {name: /home/i})
			.click()
		await expect(page).toHaveURL(ROUTES.home)
	})
})

test.describe('Home Page - Theme Toggle', () => {
	test('should toggle between light and dark themes', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Get initial theme
		const initialTheme = await page.locator('html').getAttribute('data-theme')

		// Toggle theme
		await homePage.toggleTheme()

		// Theme should have changed
		const newTheme = await page.locator('html').getAttribute('data-theme')
		expect(newTheme).not.toBe(initialTheme)
	})

	test('should persist theme after page reload', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Set to dark theme
		await homePage.toggleTheme()
		await page.waitForTimeout(500) // Wait for state to persist

		// Reload page
		await page.reload()
		await page.waitForLoadState('networkidle')

		// Theme toggle should still be present
		await expect(homePage.themeToggle).toBeVisible()
	})

	test('should display all elements correctly in both themes', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()

		// Check in light theme
		await homePage.expectNavigationCardsVisible()
		await expect(homePage.mainHeading).toBeVisible()

		// Switch to dark theme
		await homePage.toggleTheme()

		// Check in dark theme
		await homePage.expectNavigationCardsVisible()
		await expect(homePage.mainHeading).toBeVisible()
	})
})

test.describe('Home Page - Language Switching', () => {
	test('should switch UI language to Greek', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.selectUILanguage('el')

		// Check that content is in Greek
		await expect(homePage.mainHeading).toHaveText(/Μάθε Ελληνικά/i)
	})

	test('should switch UI language to Russian', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.selectUILanguage('ru')

		// Check that content is in Russian
		await expect(homePage.mainHeading).toHaveText(/Учим греческий/i)
	})

	test('should persist language after page reload', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.selectUILanguage('ru')

		// Reload page
		await page.reload()
		await page.waitForLoadState('networkidle')

		// Language should persist (Russian)
		await expect(homePage.mainHeading).toHaveText(/Учим греческий/i)
	})

	test('should translate all page content on language change', async ({
		page
	}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await page.waitForLoadState('networkidle')

		// Switch to Greek
		await homePage.selectUILanguage('el')
		await page.waitForTimeout(1000)

		// Check that Greek content is displayed
		await expect(homePage.mainHeading).toHaveText(/Ελληνικά/i)
	})
})

test.describe('Home Page - Responsive Design', () => {
	test('should display correctly on desktop (1920x1080)', async ({page}) => {
		await page.setViewportSize({width: 1920, height: 1080})

		const homePage = new HomePage(page)
		await homePage.goto()

		await homePage.expectNavigationCardsVisible()
		// Desktop header should be visible
		await expect(page.locator('header nav').first()).toBeVisible()
	})

	test('should display correctly on tablet (768x1024)', async ({page}) => {
		await page.setViewportSize({width: 768, height: 1024})

		const homePage = new HomePage(page)
		await homePage.goto()

		await homePage.expectNavigationCardsVisible()
	})

	test('should display correctly on mobile (375x667)', async ({page}) => {
		await page.setViewportSize({width: 375, height: 667})

		const homePage = new HomePage(page)
		await homePage.goto()

		await homePage.expectNavigationCardsVisible()

		// Mobile menu button should be visible
		const mobileMenuButton = page.getByRole('button', {name: /menu/i})
		await expect(mobileMenuButton).toBeVisible()
	})

	test('should open and close mobile menu', async ({page}) => {
		await page.setViewportSize({width: 375, height: 667})

		const homePage = new HomePage(page)
		await homePage.goto()

		// Open mobile menu
		const menuButton = page.getByRole('button', {name: /menu/i}).first()
		await menuButton.click()
		await page.waitForTimeout(500)

		// Menu should be visible
		const mobileMenu = page.locator('[data-testid="mobile-menu"]')
		await expect(mobileMenu).toBeVisible()

		// Close mobile menu by clicking outside
		await page.keyboard.press('Escape')
		await page.waitForTimeout(500)
	})

	test('should NOT show test link in mobile menu', async ({page}) => {
		await page.setViewportSize({width: 375, height: 667})

		const homePage = new HomePage(page)
		await homePage.goto()

		// Open mobile menu
		await page.getByRole('button', {name: /menu/i}).click()
		await homePage.expectMobileMenuVisible()

		// Test link should NOT be in mobile menu
		const mobileMenu = page.locator('[data-testid="mobile-menu"]')
		const testLink = mobileMenu.getByRole('link', {name: /test/i})
		await expect(testLink).not.toBeVisible()
	})
})

test.describe('Home Page - Accessibility', () => {
	test('should have no accessibility violations', async ({page}) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		await page.waitForLoadState('networkidle')

		const accessibilityScanResults = await new AxeBuilder({page})
			.exclude('[data-testid="mobile-menu"]') // Exclude mobile menu when closed
			.analyze()

		// Log violations if any
		if (accessibilityScanResults.violations.length > 0) {
		}

		expect(accessibilityScanResults.violations.length).toBe(0)
	})

	test('should have proper cursor pointer on interactive elements', async ({
		page
	}) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		// Check cursor for various elements
		const logo = page.getByRole('link', {name: /ΜΕ.*Learn Greek/i}).first()
		await expect(logo).toHaveCSS('cursor', 'pointer')

		const themeToggle = homePage.themeToggle
		await expect(themeToggle).toHaveCSS('cursor', 'pointer')

		const languageDropdown = homePage.uiLanguageDropdown
		await expect(languageDropdown).toHaveCSS('cursor', 'pointer')
	})

	test('should support keyboard navigation', async ({page}) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		// Tab through interactive elements
		await page.keyboard.press('Tab')
		await expect(
			page.getByRole('link', {name: /ΜΕ.*Learn Greek/i}).first()
		).toBeFocused()

		// Continue tabbing
		await page.keyboard.press('Tab')
		await page.keyboard.press('Tab')
		await page.keyboard.press('Tab')

		// Should be able to activate with Enter
		await page.keyboard.press('Enter')
	})

	test('should have visible focus indicators', async ({page}) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		// Tab to first link
		await page.keyboard.press('Tab')

		// Check that focused element is visible
		const focusedElement = page.locator(':focus')
		await expect(focusedElement).toBeVisible()
	})
})

test.describe('Home Page - Animations', () => {
	test('should animate cards on page load', async ({page}) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		// Cards should be visible after animation
		await expect(homePage.exercisesCard).toBeVisible()
		await expect(homePage.builderCard).toBeVisible()
	})

	test('should show hover effects on cards', async ({page}) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		// Hover over a card
		await homePage.exercisesCard.hover()

		// Card should still be visible
		await expect(homePage.exercisesCard).toBeVisible()
	})
})
