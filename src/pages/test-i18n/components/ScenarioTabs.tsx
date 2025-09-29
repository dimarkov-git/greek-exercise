import {motion} from 'framer-motion'
import {useState} from 'react'
import type {TestShowcaseTranslationKey} from '@/shared/lib/i18n'
import {TranslationDemo} from './TranslationDemo'

interface ScenarioTabsProps {
	readonly isLoading: boolean
	readonly t: (key: TestShowcaseTranslationKey) => string
}

type Scenario = 'basic' | 'missing' | 'status' | 'fixed' | 'unicode'

const scenarios: readonly Scenario[] = [
	'basic',
	'missing',
	'status',
	'fixed',
	'unicode'
]

export function ScenarioTabs({isLoading, t}: ScenarioTabsProps) {
	const [activeScenario, setActiveScenario] = useState<Scenario>('basic')

	return (
		<div className='rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
			{/* Tab Navigation */}
			<div className='border-gray-200 border-b dark:border-gray-700'>
				<nav className='-mb-px flex space-x-8 px-6'>
					{scenarios.map(scenario => {
						const isActive = activeScenario === scenario
						return (
							<button
								className={`relative whitespace-nowrap border-b-2 px-1 py-4 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
									isActive
										? 'border-blue-500 text-blue-600 dark:text-blue-400'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
								}`}
								key={scenario}
								onClick={() => setActiveScenario(scenario)}
								role='tab'
								type='button'
							>
								{t(`testI18n.tabs.${scenario}` as TestShowcaseTranslationKey)}
								{isActive && (
									<motion.div
										className='absolute inset-x-0 bottom-0 h-0.5 bg-blue-500'
										layoutId='activeTab'
									/>
								)}
							</button>
						)
					})}
				</nav>
			</div>

			{/* Tab Content */}
			<div className='p-6'>
				<motion.div
					animate={{opacity: 1, y: 0}}
					initial={{opacity: 0, y: 20}}
					key={activeScenario}
					transition={{duration: 0.2}}
				>
					<div className='mb-4'>
						<h3 className='font-semibold text-gray-900 text-lg dark:text-white'>
							{t(
								`testI18n.scenarios.${activeScenario}.title` as TestShowcaseTranslationKey
							)}
						</h3>
						<p className='mt-2 text-gray-600 dark:text-gray-300'>
							{t(
								`testI18n.scenarios.${activeScenario}.description` as TestShowcaseTranslationKey
							)}
						</p>
					</div>

					<TranslationDemo
						isLoading={isLoading}
						scenario={activeScenario}
						t={t}
					/>
				</motion.div>
			</div>
		</div>
	)
}
