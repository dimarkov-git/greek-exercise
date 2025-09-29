import {motion} from 'framer-motion'
import {useState} from 'react'
import {useSettingsStore} from '@/shared/model'
import type {SupportedLanguage} from '@/shared/model/translations'
import {Head} from '@/shared/ui/head'
import {useTranslations} from './lib/useTranslations'
import {translations} from './translations'

type Scenario = 'basic' | 'missing' | 'status' | 'fixed' | 'unicode'

const scenarios: readonly Scenario[] = [
	'basic',
	'missing',
	'status',
	'fixed',
	'unicode'
]

const statusBadgeColors = {
	loading: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
	complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
	partial:
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
	missing: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
	error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
} as const

export function TestI18nPage() {
	const {t, language, isLoading, status, missingKeys} =
		useTranslations(translations)
	const [activeScenario, setActiveScenario] = useState<Scenario>('basic')

	return (
		<>
			<Head title={t(translations.pageTitle)} />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-6xl px-4 py-8'>
					<PageHeader t={t} />
					<LanguageControlsSection
						isLoading={isLoading}
						language={language}
						missingKeys={missingKeys}
						status={status}
						t={t}
					/>
					<ScenarioTabsSection
						activeScenario={activeScenario}
						isLoading={isLoading}
						language={language}
						missingKeys={missingKeys}
						setActiveScenario={setActiveScenario}
						status={status}
						t={t}
					/>
				</div>
			</div>
		</>
	)
}

function PageHeader({
	t
}: {
	t: (entry: (typeof translations)[keyof typeof translations]) => string
}) {
	return (
		<motion.header
			animate={{opacity: 1, y: 0}}
			className='mb-8'
			initial={{opacity: 0, y: -20}}
		>
			<div className='text-center'>
				<h1 className='mb-4 font-bold text-3xl text-gray-900 md:text-4xl dark:text-white'>
					{t(translations.pageTitle)}
				</h1>
				<p className='mx-auto max-w-2xl text-gray-600 text-lg dark:text-gray-300'>
					{t(translations.pageDescription)}
				</p>
				<div className='mt-6 inline-flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-6 py-3 dark:border-green-800 dark:bg-green-900/20'>
					<span className='text-2xl'>{t(translations.checkIcon)}</span>
					<div className='text-left text-sm'>
						<div className='font-semibold text-green-900 dark:text-green-100'>
							{t(translations.systemBenefits)}
						</div>
						<div className='text-green-700 dark:text-green-300'>
							{t(translations.benefitsSubtext)}
						</div>
					</div>
				</div>
			</div>
		</motion.header>
	)
}

interface LanguageControlsSectionProps {
	readonly t: (
		entry: (typeof translations)[keyof typeof translations]
	) => string
	readonly language: SupportedLanguage
	readonly isLoading: boolean
	readonly status: string
	readonly missingKeys: readonly (keyof typeof translations)[]
}

function LanguageControlsSection({
	t,
	language,
	isLoading,
	status,
	missingKeys
}: LanguageControlsSectionProps) {
	const {setUiLanguage} = useSettingsStore()

	return (
		<motion.section
			animate={{opacity: 1, y: 0}}
			className='mb-8'
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.1}}
		>
			<div className='rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='font-semibold text-gray-900 text-xl dark:text-white'>
						{t(translations.currentLanguage)}: {language.toUpperCase()}
					</h2>
					<div className='flex gap-2'>
						{(['en', 'el', 'ru'] as const).map(lang => (
							<button
								className={`rounded-lg px-4 py-2 font-medium transition-colors ${
									language === lang
										? 'bg-blue-500 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
								}`}
								key={lang}
								onClick={() => setUiLanguage(lang)}
								type='button'
							>
								{lang.toUpperCase()}
							</button>
						))}
					</div>
				</div>
				<StatusGrid
					isLoading={isLoading}
					language={language}
					missingKeys={missingKeys}
					status={status}
					t={t}
				/>
				{missingKeys.length > 0 && (
					<MissingKeysAlert missingKeys={missingKeys} t={t} />
				)}
			</div>
		</motion.section>
	)
}

interface StatusGridProps {
	readonly t: (
		entry: (typeof translations)[keyof typeof translations]
	) => string
	readonly status: string
	readonly isLoading: boolean
	readonly missingKeys: readonly (keyof typeof translations)[]
	readonly language: SupportedLanguage
}

function StatusGrid({
	t,
	status,
	isLoading,
	missingKeys,
	language
}: StatusGridProps) {
	return (
		<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
				<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
					{t(translations.translationStatus)}
				</dt>
				<dd className='mt-1'>
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${statusBadgeColors[status as keyof typeof statusBadgeColors]}`}
					>
						{t(translations[status as keyof typeof translations])}
					</span>
				</dd>
			</div>
			<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
				<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
					{t(translations.loadingLabel)}
				</dt>
				<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
					{isLoading ? t(translations.yes) : t(translations.no)}
				</dd>
			</div>
			<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
				<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
					{t(translations.missingKeysLabel)}
				</dt>
				<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
					{missingKeys.length}
				</dd>
			</div>
			<div className='rounded-md bg-gray-50 p-4 dark:bg-gray-700'>
				<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
					{t(translations.languageLabel)}
				</dt>
				<dd className='mt-1 font-mono font-semibold text-gray-900 dark:text-white'>
					{language}
				</dd>
			</div>
		</div>
	)
}

interface MissingKeysAlertProps {
	readonly t: (
		entry: (typeof translations)[keyof typeof translations]
	) => string
	readonly missingKeys: readonly (keyof typeof translations)[]
}

function MissingKeysAlert({t, missingKeys}: MissingKeysAlertProps) {
	return (
		<motion.div
			animate={{opacity: 1, height: 'auto'}}
			className='mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20'
			initial={{opacity: 0, height: 0}}
		>
			<h3 className='font-medium text-sm text-yellow-800 dark:text-yellow-200'>
				{t(translations.infoIcon)} Missing Keys (will use inline fallbacks):
			</h3>
			<ul className='mt-2 space-y-1'>
				{missingKeys.slice(0, 5).map(key => (
					<li
						className='font-mono text-xs text-yellow-700 dark:text-yellow-300'
						key={String(key)}
					>
						{String(key)}
					</li>
				))}
				{missingKeys.length > 5 && (
					<li className='text-xs text-yellow-600 dark:text-yellow-400'>
						... and {missingKeys.length - 5} more
					</li>
				)}
			</ul>
		</motion.div>
	)
}

interface ScenarioTabsSectionProps {
	readonly t: (
		entry: (typeof translations)[keyof typeof translations]
	) => string
	readonly activeScenario: Scenario
	readonly setActiveScenario: (scenario: Scenario) => void
	readonly language: SupportedLanguage
	readonly status: string
	readonly missingKeys: readonly (keyof typeof translations)[]
	readonly isLoading: boolean
}

function ScenarioTabsSection({
	t,
	activeScenario,
	setActiveScenario,
	language,
	status,
	missingKeys,
	isLoading
}: ScenarioTabsSectionProps) {
	return (
		<motion.section
			animate={{opacity: 1, y: 0}}
			initial={{opacity: 0, y: 20}}
			transition={{delay: 0.2}}
		>
			<div className='rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
				<div className='border-gray-200 border-b dark:border-gray-700'>
					<nav className='-mb-px flex space-x-8 px-6'>
						{scenarios.map(scenario => {
							const isActive = activeScenario === scenario
							return (
								<button
									className={`relative whitespace-nowrap border-b-2 px-1 py-4 font-medium text-sm transition-colors ${
										isActive
											? 'border-blue-500 text-blue-600 dark:text-blue-400'
											: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
									}`}
									key={scenario}
									onClick={() => setActiveScenario(scenario)}
									type='button'
								>
									{t(
										translations[
											`${scenario}Title` as keyof typeof translations
										]
									)}
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
				<div className='p-6'>
					<motion.div
						animate={{opacity: 1, y: 0}}
						initial={{opacity: 0, y: 20}}
						key={activeScenario}
						transition={{duration: 0.2}}
					>
						{renderScenarioContent(
							activeScenario,
							t,
							language,
							status,
							missingKeys,
							isLoading
						)}
					</motion.div>
				</div>
			</div>
		</motion.section>
	)
}

function renderScenarioContent(
	scenario: Scenario,
	t: (entry: (typeof translations)[keyof typeof translations]) => string,
	language: SupportedLanguage,
	status: string,
	missingKeys: readonly (keyof typeof translations)[],
	isLoading: boolean
) {
	// biome-ignore lint/nursery/noUnnecessaryConditions: switch handles all scenario types
	switch (scenario) {
		case 'basic':
			return (
				<div className='space-y-4'>
					<div className='rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700'>
						<h4 className='font-medium text-gray-900 dark:text-white'>
							{t(translations.basicGreeting)}
						</h4>
						<p className='mt-2 text-gray-600 dark:text-gray-300'>
							{t(translations.basicWelcome)}
						</p>
						<p className='mt-2 text-gray-600 dark:text-gray-300'>
							{t(translations.basicInstructions)}
						</p>
					</div>
				</div>
			)

		case 'missing':
			return (
				<div className='space-y-4'>
					<div className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
						<h4 className='font-medium text-blue-800 dark:text-blue-200'>
							{t(translations.fallbackChainTitle)}
						</h4>
						<ol className='mt-2 space-y-1 text-blue-700 text-sm dark:text-blue-300'>
							<li>{t(translations.fallbackStep1)}</li>
							<li>{t(translations.fallbackStep2)}</li>
							<li>{t(translations.fallbackStep3)}</li>
							<li>{t(translations.fallbackStep4)}</li>
						</ol>
					</div>

					<div className='rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
						<h4 className='font-medium text-green-800 dark:text-green-200'>
							{t(translations.currentStatusTitle)}
						</h4>
						<p className='mt-2 text-green-700 text-sm dark:text-green-300'>
							{t(translations.statusLabel)}:{' '}
							{t(translations[status as keyof typeof translations])}
							<br />
							{t(translations.missingKeysLabel)}: {missingKeys.length}
						</p>
					</div>
				</div>
			)

		case 'status':
			return (
				<div className='space-y-4'>
					<dl className='grid gap-4 sm:grid-cols-2'>
						<div className='rounded-md border bg-gray-50 p-4 dark:bg-gray-700'>
							<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
								{t(translations.statusLabel)}
							</dt>
							<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
								{t(translations[status as keyof typeof translations])}
							</dd>
						</div>

						<div className='rounded-md border bg-gray-50 p-4 dark:bg-gray-700'>
							<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
								{t(translations.loadingLabel)}
							</dt>
							<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
								{isLoading ? t(translations.yes) : t(translations.no)}
							</dd>
						</div>

						<div className='rounded-md border bg-gray-50 p-4 dark:bg-gray-700'>
							<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
								{t(translations.languageLabel)}
							</dt>
							<dd className='mt-1 font-mono font-semibold text-gray-900 dark:text-white'>
								{language}
							</dd>
						</div>

						<div className='rounded-md border bg-gray-50 p-4 dark:bg-gray-700'>
							<dt className='font-medium text-gray-500 text-sm dark:text-gray-400'>
								{t(translations.missingKeysLabel)}
							</dt>
							<dd className='mt-1 font-semibold text-gray-900 dark:text-white'>
								{missingKeys.length}
							</dd>
						</div>
					</dl>
				</div>
			)

		case 'fixed':
			return (
				<div className='space-y-4'>
					<div className='rounded-md border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20'>
						<p className='text-purple-700 text-sm dark:text-purple-300'>
							{t(translations.fixedLanguageDescription)}
						</p>
					</div>

					<div className='space-y-4'>
						<div className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
							<p className='mb-2 text-blue-600 text-sm dark:text-blue-400'>
								{t(translations.alwaysGreekLabel)}
							</p>
							<p className='text-2xl text-blue-900 dark:text-blue-100'>
								{t(translations.greekSample)}
							</p>
						</div>

						<div className='rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
							<p className='mb-2 text-red-600 text-sm dark:text-red-400'>
								{t(translations.alwaysRussianLabel)}
							</p>
							<p className='text-2xl text-red-900 dark:text-red-100'>
								{t(translations.russianSample)}
							</p>
						</div>
					</div>
				</div>
			)

		case 'unicode':
			return (
				<div className='space-y-4'>
					<div className='grid gap-4 md:grid-cols-3'>
						<div className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
							<h4 className='font-medium text-blue-800 dark:text-blue-200'>
								{t(translations.greekLabel)}
							</h4>
							<p className='mt-2 text-blue-700 text-lg dark:text-blue-300'>
								{t(translations.greekSample)}
							</p>
						</div>

						<div className='rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
							<h4 className='font-medium text-red-800 dark:text-red-200'>
								{t(translations.russianLabel)}
							</h4>
							<p className='mt-2 text-lg text-red-700 dark:text-red-300'>
								{t(translations.russianSample)}
							</p>
						</div>

						<div className='rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
							<h4 className='font-medium text-green-800 dark:text-green-200'>
								{t(translations.mixedLabel)}
							</h4>
							<p className='mt-2 text-green-700 text-lg dark:text-green-300'>
								{t(translations.mixedSample)}
							</p>
						</div>
					</div>

					<div className='rounded-md border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20'>
						<p className='text-indigo-700 text-sm dark:text-indigo-300'>
							{t(translations.unicodeDescription)}
						</p>
					</div>
				</div>
			)

		default:
			return null
	}
}
