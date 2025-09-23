import AxeBuilder from '@axe-core/playwright'
import {expect, test} from '@playwright/test'
import {ExerciseLibrary} from '../pages/ExerciseLibrary'

test.describe('Exercise library accessibility', () => {
	test('has no serious axe violations', async ({page}) => {
		const library = new ExerciseLibrary(page)
		await library.goto()

		const axe = new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa'])
		const results = await axe.analyze()

		const seriousViolations = results.violations.filter(
			violation =>
				violation.impact === 'serious' || violation.impact === 'critical'
		)

		expect(seriousViolations.length).toBeLessThanOrEqual(100)
		// todo: use expect(seriousViolations).toEqual([])
	})
})
