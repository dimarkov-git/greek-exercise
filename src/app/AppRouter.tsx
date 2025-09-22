import type {PropsWithChildren, ReactElement} from 'react'
import {BrowserRouter, HashRouter, MemoryRouter} from 'react-router'
import {environment, type RouterMode} from '@/config/environment'

type RouterComponent = (properties: PropsWithChildren) => ReactElement

const routerComponents: Record<RouterMode, RouterComponent> = {
	browser: ({children}) => <BrowserRouter>{children}</BrowserRouter>,
	hash: ({children}) => <HashRouter>{children}</HashRouter>,
	memory: ({children}) => <MemoryRouter>{children}</MemoryRouter>
}

export function AppRouter({children}: PropsWithChildren) {
	const Router = routerComponents[environment.routerMode]
	return <Router>{children}</Router>
}
