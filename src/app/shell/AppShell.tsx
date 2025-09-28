import {Suspense} from 'react'
import {Outlet} from 'react-router'
import {useLayout} from '@/shared/lib'
import {LayoutProvider} from '@/shared/lib/contexts/LayoutContext'
import {LoadingOrError} from '@/shared/ui/loading-or-error'
import {Footer} from '@/widgets/app-footer'
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
