import {motion} from 'framer-motion'
import {useTranslations} from '@/shared/lib/i18n'
import {viewToggleTranslations} from '@/shared/lib/i18n/dictionaries'

type ViewMode = 'json' | 'table'

interface ViewToggleProps {
	readonly viewMode: ViewMode
	readonly onViewModeChange: (mode: ViewMode) => void
}

export function ViewToggle({viewMode, onViewModeChange}: ViewToggleProps) {
	const {t} = useTranslations(viewToggleTranslations)

	return (
		<div className='flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-600 dark:bg-gray-800'>
			<button
				className={`relative flex-1 cursor-pointer rounded-md px-4 py-2 font-medium text-sm transition-colors ${
					viewMode === 'table'
						? 'text-blue-600 dark:text-blue-400'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
				}`}
				onClick={() => onViewModeChange('table')}
				type='button'
			>
				{viewMode === 'table' && (
					<motion.div
						className='absolute inset-0 rounded-md bg-blue-50 dark:bg-blue-900/30'
						layoutId='activeTab'
						transition={{type: 'spring', stiffness: 500, damping: 30}}
					/>
				)}
				<span className='relative z-10'>{t('tableView')}</span>
			</button>
			<button
				className={`relative flex-1 cursor-pointer rounded-md px-4 py-2 font-medium text-sm transition-colors ${
					viewMode === 'json'
						? 'text-blue-600 dark:text-blue-400'
						: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
				}`}
				onClick={() => onViewModeChange('json')}
				type='button'
			>
				{viewMode === 'json' && (
					<motion.div
						className='absolute inset-0 rounded-md bg-blue-50 dark:bg-blue-900/30'
						layoutId='activeTab'
						transition={{type: 'spring', stiffness: 500, damping: 30}}
					/>
				)}
				<span className='relative z-10'>{t('jsonView')}</span>
			</button>
		</div>
	)
}
