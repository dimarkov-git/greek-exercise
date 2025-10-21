import {expect, test} from '@playwright/test'
import {ROUTES} from '../fixtures/selectors'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'
import {ExercisePage} from '../pages/ExercisePage'
import {HomePage} from '../pages/HomePage'

test.describe('Navigation - Basic', () => {
	test('should render homepage with navigation cards', async ({page}) => {
		const homePage = new HomePage(page)

		await homePage.goto()
		await homePage.expectPageLoaded()
	})

	test('should navigate from homepage to exercise library', async ({page}) => {
		const homePage = new HomePage(page)
		const exerciseLibrary = new ExerciseLibrary(page)

		await homePage.goto()
		await homePage.clickExercisesCard()

		await expect(page).toHaveURL(ROUTES.exercises)
		await exerciseLibrary.expectPageLoaded()
	})
})

test.describe('Navigation - Advanced', () => {
	test('should navigate to specific exercise types', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()

		// Test verbs-be exercise
		await exerciseLibrary.startExerciseById('word-form-verbs-be-1')
		await expect(page).toHaveURL(ROUTES.exerciseVerbsBe)
		await exercisePage.expectPageLoaded()

		// Go back and test verbs-have exercise
		await exercisePage.clickBackButton()
		await exerciseLibrary.startExerciseById('word-form-verbs-have-1')
		await expect(page).toHaveURL(ROUTES.exerciseVerbsHave)
		await exercisePage.expectPageLoaded()
	})

	test('should handle direct URL navigation', async ({page}) => {
		const exercisePage = new ExercisePage(page)

		// Direct navigation to exercise should work
		await page.goto(ROUTES.exercisePath('word-form-verbs-be-1'))
		await exercisePage.expectPageLoaded()

		// Should be able to navigate back
		await exercisePage.clickBackButton()
		await expect(page).toHaveURL(ROUTES.exercises)
	})
})

test.describe('Navigation - Exercises', () => {
	test('should navigate from exercise library to exercise', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startExerciseById('word-form-verbs-be-1')

		await expect(page).toHaveURL(ROUTES.exerciseVerbsBe)
		await exercisePage.expectPageLoaded()
	})

	test('should navigate back from exercise to library', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)
		const exercisePage = new ExercisePage(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.startExerciseById('word-form-verbs-be-1')
		await exercisePage.expectPageLoaded()

		await exercisePage.clickBackButton()

		await expect(page).toHaveURL(ROUTES.exercises)
		await exerciseLibrary.expectPageLoaded()
	})

	test('should show exercise count in library', async ({page}) => {
		const exerciseLibrary = new ExerciseLibrary(page)

		await exerciseLibrary.goto()
		await exerciseLibrary.expectExerciseCardsVisible()

		// Verify we have at least 2 exercises available
		const cardCount = await exerciseLibrary.exerciseCards.count()
		expect(cardCount).toBeGreaterThanOrEqual(2)
	})
})
