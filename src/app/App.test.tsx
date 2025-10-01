import {describe, expect, it} from 'vitest'
import {render, screen, within} from '@/shared/test'
import {VIEWPORT_SIZES} from '../../tests/fixtures/test-data'
import {App} from './App'

const viewports = [VIEWPORT_SIZES.mobile, VIEWPORT_SIZES.desktop]

describe('App navigation', () => {
	it.each(viewports)(
		'shows header navigation at $width×$height viewport',
		async viewport => {
			window.happyDOM?.setViewport(viewport)
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
		}
	)

	it.each(viewports)(
		'shows main navigation cards at $width×$height viewport',
		async viewport => {
			window.happyDOM?.setViewport(viewport)
			render(<App />, {route: '/'})

			const main = await screen.findByRole('main')
			const mainScope = within(main)

			await expect(
				mainScope.findByRole('link', {name: /exercise library/i})
			).resolves.toBeInTheDocument()
			await expect(
				mainScope.findByRole('link', {name: /exercise builder/i})
			).resolves.toBeInTheDocument()
		}
	)
})

describe('App footer', () => {
	it.each(viewports)(
		'shows footer links at $width×$height viewport',
		async viewport => {
			window.happyDOM?.setViewport(viewport)
			render(<App />, {route: '/'})

			const footer = await screen.findByRole('contentinfo')
			const footerScope = within(footer)
			const footerLinks = await footerScope.findAllByRole('link')

			expect(footerLinks.length).toBeGreaterThanOrEqual(1)
		}
	)
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
