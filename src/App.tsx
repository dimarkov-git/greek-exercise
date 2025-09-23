import {useSettingsSync} from '@/hooks/useSettingsSync'
import {AppRoutes} from './app/routes/AppRoutes'

export function App() {
	useSettingsSync()
	return <AppRoutes />
}
