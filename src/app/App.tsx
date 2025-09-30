import {useSettingsSync} from '@/shared/lib'
import {AppRoutes} from './router/AppRoutes'

export function App() {
	useSettingsSync()
	return <AppRoutes />
}
