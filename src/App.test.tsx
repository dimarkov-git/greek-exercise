import {HttpResponse, http} from 'msw'
import {App} from './App'
import {server} from './mocks/server'
import {queryClient, render, screen} from './test-utils'

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
	render(<App />, {route: '/invalid-fruit'})

	// Should redirect to homepage which shows navigation cards plus footer link
	await expect(screen.findAllByRole('link')).resolves.toHaveLength(3)
})

it('can still access fruit gallery via /gallery route', async () => {
	const {user} = render(<App />, {route: '/gallery'})

	// Wait for gallery to load and check for Apple link first
	const button = await screen.findByRole('link', {name: /Apple/})

	// Now check total links count - should be fruit cards + footer link
	const links = await screen.findAllByRole('link')
	expect(links).toHaveLength(7)

	await user.click(button)

	await expect(screen.findByText('Vitamin K')).resolves.toBeInTheDocument()
})

it('renders error', async () => {
	queryClient.clear()
	server.use(http.get('/fruits', () => new HttpResponse(null, {status: 500})))
	render(<App />, {route: '/gallery'}) // Test error on gallery page

	await expect(
		screen.findByText('Failed to fetch')
	).resolves.toBeInTheDocument()
})
