import {screen, within} from '@testing-library/react'
import {render} from '@tests/utils'
import {describe, expect, it} from 'vitest'
import {App} from './App'

describe('App layout', () => {
	it('shows header navigation links', async () => {
		render(<App />, {route: '/'})

		const header = await screen.findByRole('banner')
		const headerScope = within(header)

		await expect(
			headerScope.findByRole('link', {name: /home/i})
		).resolves.toBeInTheDocument()
		await expect(
			headerScope.findByRole('link', {name: /library/i})
		).resolves.toBeInTheDocument()
		await expect(
			headerScope.findByRole('link', {name: /builder/i})
		).resolves.toBeInTheDocument()
	})

	it('shows main navigation cards', async () => {
		render(<App />, {route: '/'})

		const main = await screen.findByRole('main')
		const mainScope = within(main)

		await expect(
			mainScope.findByRole('link', {name: /exercise library/i})
		).resolves.toBeInTheDocument()
		await expect(
			mainScope.findByRole('link', {name: /exercise builder/i})
		).resolves.toBeInTheDocument()
	})

	it('shows footer links', async () => {
		render(<App />, {route: '/'})

		const footer = await screen.findByRole('contentinfo')
		const footerScope = within(footer)
		const footerLinks = await footerScope.findAllByRole('link')

		expect(footerLinks.length).toBeGreaterThanOrEqual(1)
	})
})

describe('App routing', () => {
	it('redirects unknown routes to the homepage', async () => {
		render(<App />, {route: '/invalid-route'})

		const main = await screen.findByRole('main')
		const mainScope = within(main)

		await expect(
			mainScope.findByRole('link', {name: /exercise library/i})
		).resolves.toBeInTheDocument()
		await expect(
			mainScope.findByRole('link', {name: /exercise builder/i})
		).resolves.toBeInTheDocument()
	})
})
