import {motion} from 'framer-motion'
import type {SupportedLanguage, TranslationStatus} from '@/shared/model'
import {LanguageSelector} from '@/shared/ui/language-selector'

interface LanguageControlsProps {
	readonly currentLanguage: SupportedLanguage
	readonly status: TranslationStatus
	readonly missingKeys: readonly string[]
	readonly isLoading: boolean
	readonly t: (key: string) => string
}

const statusColors = {
	loading: 'text-blue-600 dark:text-blue-400',
	complete: 'text-green-600 dark:text-green-400',
	partial: 'text-yellow-600 dark:text-yellow-400',
	missing: 'text-red-600 dark:text-red-400',
	error: 'text-red-600 dark:text-red-400'
} as const

const statusBadgeColors = {
	loading: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
	complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
	partial:
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
	missing: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
	error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
} as const

export function LanguageControls({
	currentLanguage,
	status,
	missingKeys,
	isLoading,
	t
}: LanguageControlsProps) {
	return (
		<div className='rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
			<div className='mb-6'>
				<h2 className='mb-2 font-semibold text-gray-900 text-lg dark:text-white'>
					{t('testI18n.languageControls')}
				</h2>
				<LanguageSelector />
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{/* Current Language */}
				<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
					<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
						{t('testI18n.currentLanguage')}
					</dt>
					<dd className='mt-1 font-mono font-semibold text-gray-900 dark:text-white'>
						{currentLanguage.toUpperCase()}
					</dd>
				</div>

				{/* Translation Status */}
				<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
					<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
						{t('testI18n.info.translationStatus')}
					</dt>
					<dd className='mt-1'>
						<span
							className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${statusBadgeColors[status]}`}
						>
							{t(`testI18n.scenarios.status.${status}`)}
						</span>
					</dd>
				</div>

				{/* Missing Keys Count */}
				<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
					<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
						{t('testI18n.info.missingKeys')}
					</dt>
					<dd className={`mt-1 font-semibold ${statusColors[status]}`}>
						{missingKeys.length}
					</dd>
				</div>

				{/* Loading State */}
				<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
					<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
						{t('testI18n.info.loadingState')}
					</dt>
					<dd className='mt-1'>
						{isLoading ? (
							<motion.div
								animate={{scale: [1, 1.2, 1]}}
								className='size-4 rounded-full bg-blue-500'
								transition={{repeat: Number.POSITIVE_INFINITY, duration: 1}}
							/>
						) : (
							<span className='text-gray-400 text-sm dark:text-gray-500'>
								Idle
							</span>
						)}
					</dd>
				</div>
			</div>

			{/* Missing Keys Details (only show if there are missing keys) */}
			{missingKeys.length > 0 && (
				<motion.div
					animate={{opacity: 1, height: 'auto'}}
					className='mt-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'
					initial={{opacity: 0, height: 0}}
				>
					<h3 className='font-medium text-red-800 text-sm dark:text-red-200'>
						Missing Translation Keys:
					</h3>
					<ul className='mt-2 space-y-1'>
						{missingKeys.slice(0, 5).map(key => (
							<li
								className='font-mono text-red-700 text-xs dark:text-red-300'
								key={key}
							>
								{key}
							</li>
						))}
						{missingKeys.length > 5 && (
							<li className='text-red-600 text-xs dark:text-red-400'>
								... and {missingKeys.length - 5} more
							</li>
						)}
					</ul>
				</motion.div>
			)}
		</div>
	)
}
