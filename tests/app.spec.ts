import {expect, test} from '@playwright/test'

// Regex constants for performance
const LIBRARY_TEXT_REGEX = /Βιβλιοθήκη Ασκήσεων|Exercise Library/
const BUILDER_TEXT_REGEX = /Κατασκευαστής Ασκήσεων|Exercise Builder/
const GREEN_BG_REGEX = /bg-green-500/

test('renders homepage with navigation cards', async ({page}) => {
	await page.goto('/')

	await expect(page.getByRole('link')).toHaveCount(3)
	await expect(page.getByText(LIBRARY_TEXT_REGEX)).toBeVisible()
	await expect(page.getByText(BUILDER_TEXT_REGEX)).toBeVisible()
})

test('theme switching works correctly', async ({page}) => {
	await page.goto('/')

	// Should start with light theme (default)
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

	// Find and click the theme toggle button
	const themeToggle = page.locator('button').filter({hasText: '☀️'})
	await expect(themeToggle).toBeVisible()

	await themeToggle.click()

	// Should switch to dark theme
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
	await expect(page.locator('button').filter({hasText: '🌙'})).toBeVisible()

	// Click again to switch back to light
	await page.locator('button').filter({hasText: '🌙'}).click()
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
	await expect(page.locator('button').filter({hasText: '☀️'})).toBeVisible()
})

test('interface language switching works correctly', async ({page}) => {
	await page.goto('/')

	// Should start with Greek (default)
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Μάθε Ελληνικά'
	)

	// Switch to English
	const englishFlag = page.locator('button[title="English"]').first()
	await englishFlag.click()

	// Should show English interface
	await expect(page.getByRole('heading', {level: 1})).toHaveText('Learn Greek')
	await expect(page.getByText('Settings')).toBeVisible()

	// Switch to Russian
	const russianFlag = page.locator('button[title="Русский"]').first()
	await russianFlag.click()

	// Should show Russian interface
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Учим греческий'
	)
	await expect(page.getByText('Настройки')).toBeVisible()

	// Switch back to Greek
	const greekFlag = page.locator('button[title="Ελληνικά"]').first()
	await greekFlag.click()

	// Should show Greek interface again
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Μάθε Ελληνικά'
	)
	await expect(page.getByText('Ρυθμίσεις')).toBeVisible()
})

test('user language switching works correctly', async ({page}) => {
	await page.goto('/')

	// Find user language section (should be the second set of flag buttons)
	const userLanguageSection = page.locator('.space-y-2').nth(1)

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

	// Change settings
	const themeToggle = page.locator('button').filter({hasText: '☀️'})
	await themeToggle.click()

	const englishFlag = page.locator('button[title="English"]').first()
	await englishFlag.click()

	// Verify settings applied
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
	await expect(page.getByRole('heading', {level: 1})).toHaveText('Learn Greek')

	// Reload page
	await page.reload()

	// Settings should persist
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
	await expect(page.getByRole('heading', {level: 1})).toHaveText('Learn Greek')
})
