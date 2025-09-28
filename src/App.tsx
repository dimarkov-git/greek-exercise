import {useSettingsSync} from '@/shared/lib'
import {AppRoutes} from './app/router/AppRoutes'

export function App() {
	useSettingsSync()
	return <AppRoutes />
}
