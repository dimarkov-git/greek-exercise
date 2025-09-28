import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {useSettingsStore} from '@/shared/model'
import {DEFAULT_SETTINGS} from '@/shared/model/settings'
import {ThemeToggle} from '@/shared/ui/theme-toggle'

vi.mock('@/hooks/useTranslations', () => ({
	useTranslations: () => ({
		t: (key: string) => key,
		status: 'complete' as const,
		missingKeys: [] as string[]
	})
}))

describe('ThemeToggle', () => {
	beforeEach(() => {
		localStorage.clear()
		act(() => {
			useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
		})
	})

	afterEach(() => {
		localStorage.clear()
		act(() => {
			useSettingsStore.setState(() => ({...DEFAULT_SETTINGS}))
		})
	})

	it('reflects the current theme from the settings store', () => {
		render(<ThemeToggle />)

		const toggle = screen.getByTestId('theme-toggle')
		expect(toggle).toHaveAttribute('data-current-theme', 'light')
	})

	it('toggles the theme in the settings store when clicked', async () => {
		const user = userEvent.setup()

		render(<ThemeToggle />)

		const toggle = screen.getByTestId('theme-toggle')

		await user.click(toggle)

		expect(useSettingsStore.getState().theme).toBe('dark')
		expect(toggle).toHaveAttribute('data-current-theme', 'dark')
	})
})
