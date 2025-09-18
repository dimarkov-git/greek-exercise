import {expect, type Page, test} from '@playwright/test'

// Regex constants for performance
const LIBRARY_TEXT_REGEX = /Βιβλιοθήκη Ασκήσεων|Exercise Library/
const BUILDER_TEXT_REGEX = /Κατασκευαστής Ασκήσεων|Exercise Builder/
const GREEN_BG_REGEX = /bg-green-500/
const MENU_BUTTON_REGEX = /Menu|Μενού|Меню/
const _SETTINGS_TEXT_REGEX = /Settings|Настройки|Ρυθμίσεις/
const USER_LANGUAGE_REGEX =
	/Language you know:|Язык, который вы знаете:|Γλώσσα που γνωρίζεις:/

test('renders homepage with navigation cards', async ({page}) => {
	await page.goto('/')

	// Desktop: Header has 4 links + 2 navigation cards + 1 footer = 7 total
	// Mobile: Header logo + 2 navigation cards + 1 footer = 4 total (desktop nav hidden)
	const linkCount = await page.getByRole('link').count()
	expect(linkCount).toBeGreaterThanOrEqual(4) // At least 4 links on mobile
	expect(linkCount).toBeLessThanOrEqual(7) // At most 7 links on desktop

	await expect(page.getByText(LIBRARY_TEXT_REGEX)).toBeVisible()
	await expect(page.getByText(BUILDER_TEXT_REGEX)).toBeVisible()
})

test('theme switching works correctly', async ({page}) => {
	await page.goto('/')

	// Should start with light theme (default)
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

	// Theme toggle is now in header (visible on desktop, hidden on mobile)
	const viewport = page.viewportSize()
	if (viewport && viewport.width >= 768) {
		// Desktop: theme toggle visible in header
		const themeToggle = page.locator('button').filter({hasText: '🌙'})
		await expect(themeToggle).toBeVisible()
		await themeToggle.click()

		// Should switch to dark theme
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
		await expect(page.locator('button').filter({hasText: '☀️'})).toBeVisible()

		// Click again to switch back to light
		await page.locator('button').filter({hasText: '☀️'}).click()
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
	} else {
		// Mobile: need to open mobile menu first
		const menuButton = page
			.locator('button')
			.filter({hasText: MENU_BUTTON_REGEX})
		await menuButton.click()

		// Now theme toggle should be visible in mobile menu
		const themeToggle = page
			.locator('.md\\:hidden button')
			.filter({hasText: '🌙'})
		await expect(themeToggle).toBeVisible()
		await themeToggle.click()

		// Should switch to dark theme
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
	}
})

async function testDesktopLanguageSwitching(page: Page) {
	// Desktop: click language dropdown in header (visible on desktop)
	const languageDropdown = page.locator('header button').filter({hasText: '🇬🇷'})
	await languageDropdown.click()

	// Click English option in dropdown
	await page.locator('.absolute button').filter({hasText: 'English'}).click()

	// Should show English interface
	await expect(page.getByRole('heading', {level: 1})).toHaveText('Learn Greek')

	// Click language dropdown again (now shows US flag)
	const englishDropdown = page.locator('header button').filter({hasText: '🇺🇸'})
	await englishDropdown.click()

	// Click Greek option to return
	await page.locator('.absolute button').filter({hasText: 'Ελληνικά'}).click()

	// Should show Greek interface again
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Μάθε Ελληνικά'
	)
}

async function testMobileLanguageSwitching(page: Page) {
	// Mobile: open menu first
	const menuButton = page.locator('button').filter({hasText: MENU_BUTTON_REGEX})
	await menuButton.click()

	// Language dropdown is in mobile menu
	const languageDropdown = page
		.locator('.md\\:hidden button')
		.filter({hasText: '🇬🇷'})
	await languageDropdown.click()
	await page.locator('.absolute button').filter({hasText: 'English'}).click()

	// Should show English interface
	await expect(page.getByRole('heading', {level: 1})).toHaveText('Learn Greek')
}

test('interface language switching works correctly', async ({page}) => {
	await page.goto('/')

	// Should start with Greek (default)
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Μάθε Ελληνικά'
	)

	// Interface language switching is now in header dropdown
	const viewport = page.viewportSize()
	if (viewport && viewport.width >= 768) {
		await testDesktopLanguageSwitching(page)
	} else {
		await testMobileLanguageSwitching(page)
	}
})

test('user language switching works correctly', async ({page}) => {
	// Navigate to Exercise Library page where UserLanguageSelector is now located
	await page.goto('/exercises')

	// Wait for page to load
	await expect(page.getByText(LIBRARY_TEXT_REGEX)).toBeVisible()

	// User language is now on ExerciseLibrary page - find the UserLanguageSelector component
	// Look for the specific div with the class and exact text match
	const userLanguageLabel = page
		.locator('div.block.font-medium')
		.filter({hasText: USER_LANGUAGE_REGEX})
		.first()
	await expect(userLanguageLabel).toBeVisible()

	// Find user language button container (next sibling with .flex class)
	const userLanguageSection = userLanguageLabel.locator('..').locator('.flex')

	// Switch to English for user language
	await userLanguageSection.locator('button[title="English"]').click()

	// Verify English flag is selected (green background)
	await expect(
		userLanguageSection.locator('button[title="English"]')
	).toHaveClass(GREEN_BG_REGEX)

	// Switch to Russian for user language
	await userLanguageSection.locator('button[title="Русский"]').click()

	// Verify Russian flag is selected
	await expect(
		userLanguageSection.locator('button[title="Русский"]')
	).toHaveClass(GREEN_BG_REGEX)

	// Switch back to English for user language
	await userLanguageSection.locator('button[title="English"]').click()

	// Verify English flag is selected
	await expect(
		userLanguageSection.locator('button[title="English"]')
	).toHaveClass(GREEN_BG_REGEX)
})

test('settings persist after page reload', async ({page}) => {
	await page.goto('/')

	// Change settings in header (desktop) or mobile menu
	const viewport = page.viewportSize()
	if (viewport && viewport.width >= 768) {
		// Desktop: settings in header
		const themeToggle = page.locator('header button').filter({hasText: '🌙'})
		await themeToggle.click()

		const languageDropdown = page
			.locator('header button')
			.filter({hasText: '🇬🇷'})
		await languageDropdown.click()
		await page.locator('.absolute button').filter({hasText: 'English'}).click()
	} else {
		// Mobile: settings in mobile menu
		const menuButton = page
			.locator('button')
			.filter({hasText: MENU_BUTTON_REGEX})
		await menuButton.click()

		const themeToggle = page
			.locator('.md\\:hidden button')
			.filter({hasText: '🌙'})
		await themeToggle.click()

		const languageDropdown = page
			.locator('.md\\:hidden button')
			.filter({hasText: '🇬🇷'})
		await languageDropdown.click()
		await page.locator('.absolute button').filter({hasText: 'English'}).click()
	}

	// Verify settings applied
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
	await expect(page.getByRole('heading', {level: 1})).toHaveText('Learn Greek')

	// Reload page
	await page.reload()

	// Settings should persist
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
	await expect(page.getByRole('heading', {level: 1})).toHaveText('Learn Greek')
})
