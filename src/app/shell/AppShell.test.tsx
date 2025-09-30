import {render, screen, waitFor} from '@testing-library/react'
import {useEffect} from 'react'
import {MemoryRouter, Route, Routes} from 'react-router'
import {describe, expect, it, vi} from 'vitest'
import {useLayout} from '@/shared/test'

const HEADER_TEST_ID = 'header-mock'
const FOOTER_TEST_ID = 'footer-mock'
const LOADING_TEST_ID = 'loading-state'
const CONTENT_AREA_TEST_ID = 'content-area'
const LAYOUT_FLAG_TEST_ID = 'layout-flag'

const HEADER_TEXT = 'Header'
const FOOTER_TEXT = 'Footer'
const LOADING_TEXT = 'Loading'
const CONTENT_TEXT = 'Content'
const LAYOUT_ENABLED_TEXT = 'enabled'
const LAYOUT_DISABLED_TEXT = 'disabled'

function renderHeaderMock() {
	return <div data-testid={HEADER_TEST_ID}>{HEADER_TEXT}</div>
}

function renderFooterMock() {
	return <div data-testid={FOOTER_TEST_ID}>{FOOTER_TEXT}</div>
}

function renderLoadingMock() {
	return <div data-testid={LOADING_TEST_ID}>{LOADING_TEXT}</div>
}

function getHeaderExportName() {
	return 'Header' as const
}

function getFooterExportName() {
	return 'Footer' as const
}

function getLoadingExportName() {
	return 'LoadingOrError' as const
}

vi.mock('@/widgets/app-header', () => ({
	[getHeaderExportName()]: () => renderHeaderMock()
}))

vi.mock('@/widgets/app-footer', () => ({
	[getFooterExportName()]: () => renderFooterMock()
}))

vi.mock('@/shared/ui/loading-or-error', () => ({
	[getLoadingExportName()]: () => renderLoadingMock()
}))

import {AppShell} from './AppShell'

describe('AppShell', () => {
	it('wraps routes with layout context and toggles header padding', async () => {
		function ToggleHeaderPage() {
			const {headerEnabled, setHeaderEnabled} = useLayout()

			useEffect(() => {
				setHeaderEnabled(false)
			}, [setHeaderEnabled])

			const layoutStateText = headerEnabled
				? LAYOUT_ENABLED_TEXT
				: LAYOUT_DISABLED_TEXT

			return (
				<div data-testid={CONTENT_AREA_TEST_ID}>
					<span data-testid={LAYOUT_FLAG_TEST_ID}>{layoutStateText}</span>
					{CONTENT_TEXT}
				</div>
			)
		}

		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route element={<AppShell />}>
						<Route element={<ToggleHeaderPage />} index={true} />
					</Route>
				</Routes>
			</MemoryRouter>
		)

		expect(screen.getByTestId(HEADER_TEST_ID)).toBeInTheDocument()
		expect(screen.getByTestId(FOOTER_TEST_ID)).toBeInTheDocument()
		expect(screen.getByTestId(CONTENT_AREA_TEST_ID)).toBeInTheDocument()

		await waitFor(() => {
			expect(screen.getByTestId(LAYOUT_FLAG_TEST_ID)).toHaveTextContent(
				LAYOUT_DISABLED_TEXT
			)
		})

		const main = screen.getByRole('main')
		expect(main.className).toContain('pt-0')
		expect(screen.queryByTestId(LOADING_TEST_ID)).not.toBeInTheDocument()
	})
})
