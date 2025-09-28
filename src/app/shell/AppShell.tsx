import {Suspense} from 'react'
import {Outlet} from 'react-router'
import {LoadingOrError} from '@/components/LoadingOrError'
import {Footer} from '@/components/layout/Footer'
import {LayoutProvider} from '@/contexts/LayoutContext'
import {useLayout} from '@/hooks/useLayout'
import {Header} from '@/widgets/app-header'

function AppShellContent() {
	const {headerEnabled} = useLayout()

	return (
		<div className='flex min-h-screen flex-col'>
			<Header />
			<main className={`flex-1 ${headerEnabled ? 'pt-16' : 'pt-0'}`}>
				<Suspense fallback={<LoadingOrError />}>
					<Outlet />
				</Suspense>
			</main>
			<Footer />
		</div>
	)
}

export function AppShell() {
	return (
		<LayoutProvider>
			<AppShellContent />
		</LayoutProvider>
	)
}
