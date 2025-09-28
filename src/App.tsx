import {useSettingsSync} from '@/shared/lib'
import {AppRoutes} from './app/routes/AppRoutes'

export function App() {
	useSettingsSync()
	return <AppRoutes />
}
