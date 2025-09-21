import {screen} from '@testing-library/react'
import {render} from '@tests/utils'
import {HttpResponse, http} from 'msw'
import {describe, expect, it} from 'vitest'
import {server} from '@/mocks/server'
import {useSettingsStore} from '@/stores/settings'
import {ThemeToggle} from './ThemeToggle'

describe('ThemeToggle', () => {
	it('toggles between light and dark themes', async () => {
		const {user} = render(<ThemeToggle />)

		const toggle = await screen.findByRole('button', {name: /dark/i})
		expect(toggle).toHaveAttribute('data-current-theme', 'light')

		await user.click(toggle)

		expect(toggle).toHaveAttribute('data-current-theme', 'dark')
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

		await user.click(toggle)

		expect(toggle).toHaveAttribute('data-current-theme', 'light')
		expect(document.documentElement.getAttribute('data-theme')).toBe('light')
	})

	it('falls back to default labels when translations fail', async () => {
		server.use(
			http.get('/api/translations', () => HttpResponse.json({}, {status: 500}))
		)

		useSettingsStore.getState().setTheme('dark')

		render(<ThemeToggle />)

		const toggle = await screen.findByRole('button', {name: /light/i})
		expect(toggle).toBeInTheDocument()
	})
})
