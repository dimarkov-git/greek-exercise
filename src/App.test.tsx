import {App} from './App'
import {render, screen} from './test-utils'

const widths = [360, 1280]

it.each(widths)(
	'should show homepage navigation cards with %o viewport',
	async width => {
		window.happyDOM?.setViewport({width, height: 720})
		render(<App />, {route: '/'})

		// Homepage now shows 2 navigation cards plus 1 footer link
		await expect(screen.findAllByRole('link')).resolves.toHaveLength(3)

		// Verify we can find the navigation cards
		await expect(
			screen.findByText(/Βιβλιοθήκη Ασκήσεων|Exercise Library/)
		).resolves.toBeInTheDocument()
		await expect(
			screen.findByText(/Κατασκευαστής Ασκήσεων|Exercise Builder/)
		).resolves.toBeInTheDocument()
	}
)

it('redirects to homepage when accessing invalid route', async () => {
	render(<App />, {route: '/invalid-route'})

	// Should redirect to homepage which shows navigation cards plus footer link
	await expect(screen.findAllByRole('link')).resolves.toHaveLength(3)
})
