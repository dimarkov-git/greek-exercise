import type {WordFormExercise} from '@/entities/exercise'
import {loadTranslations} from '@/shared/lib/i18n'
import {useSettingsStore} from '@/shared/model'
import {translations} from './translations-table-view'

interface TableViewProps {
	exercise: WordFormExercise
}

export function TableView({exercise}: TableViewProps) {
	const {t} = loadTranslations(translations)
	const {userLanguage} = useSettingsStore()

	return (
		<div className='p-6'>
			{/* Exercise Info */}
			<div className='mb-6'>
				<h3 className='mb-2 font-semibold text-gray-900 text-lg dark:text-white'>
					{exercise.title}
				</h3>
				<p className='mb-4 text-gray-600 dark:text-gray-400'>
					{exercise.description}
				</p>

				{/* Exercise Metadata */}
				<div className='mb-4 flex flex-wrap gap-4 text-sm'>
					<span className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'>
						{t(translations.difficulty)}
						{t(translations.colon)}
						{exercise.difficulty.toUpperCase()}
					</span>
					<span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-green-800 dark:bg-green-900/30 dark:text-green-300'>
						{t(translations.clockIcon)} {exercise.estimatedTimeMinutes}{' '}
						{t(translations.minutes)}
					</span>
					<span className='inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'>
						{t(translations.booksIcon)} {exercise.blocks.length}{' '}
						{t(translations.blocks)}
					</span>
					<span className='inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'>
						{t(translations.notesIcon)}{' '}
						{exercise.blocks.reduce(
							(total, block) => total + block.cases.length,
							0
						)}{' '}
						{t(translations.cases)}
					</span>
				</div>

				{/* Tags */}
				{exercise.tags && exercise.tags.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						{exercise.tags.map(tag => (
							<span
								className='inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-gray-600 text-xs dark:bg-gray-700 dark:text-gray-300'
								key={tag}
							>
								{`#${tag}`}
							</span>
						))}
					</div>
				)}
			</div>

			{/* Exercise Structure */}
			<div className='space-y-6'>
				<h4 className='font-semibold text-gray-900 text-lg dark:text-white'>
					{t(translations.exerciseStructure)}
				</h4>

				{exercise.blocks.map((block, blockIndex) => (
					<div
						className='rounded-lg border border-gray-200 dark:border-gray-700'
						key={block.id}
					>
						{/* Block Header */}
						<div className='border-gray-200 border-b bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800'>
							<h5 className='font-medium text-gray-900 dark:text-white'>
								{t(translations.block)} {blockIndex + 1}
								{t(translations.colon)}
								{block.name}
							</h5>
							<p className='text-gray-600 text-sm dark:text-gray-400'>
								{block.nameHintI18n?.[userLanguage] || block.name}
							</p>
						</div>

						{/* Cases Table */}
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='border-gray-200 border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800'>
									<tr>
										<th className='px-4 py-3 text-left font-medium text-gray-600 text-sm dark:text-gray-400'>
											{t(translations.hashSymbol)}
										</th>
										<th className='px-4 py-3 text-left font-medium text-gray-600 text-sm dark:text-gray-400'>
											{t(translations.prompt)}
										</th>
										<th className='px-4 py-3 text-left font-medium text-gray-600 text-sm dark:text-gray-400'>
											{t(translations.answer)}
										</th>
										<th className='px-4 py-3 text-left font-medium text-gray-600 text-sm dark:text-gray-400'>
											{t(translations.hint)}
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
									{block.cases.map((caseItem, caseIndex) => (
										<tr
											className='hover:bg-gray-50 dark:hover:bg-gray-800/50'
											key={caseItem.id}
										>
											<td className='px-4 py-3 text-gray-500 text-sm dark:text-gray-400'>
												{caseIndex + 1}
											</td>
											<td className='px-4 py-3'>
												<div className='text-gray-900 dark:text-white'>
													{caseItem.prompt}
												</div>
												<div className='text-gray-500 text-sm dark:text-gray-400'>
													{caseItem.promptHintI18n?.[userLanguage] ||
														caseItem.prompt}
												</div>
											</td>
											<td className='px-4 py-3'>
												<div className='space-y-1'>
													{caseItem.correct.map((answer, answerIndex) => (
														<div
															className='rounded bg-green-50 px-2 py-1 font-mono text-green-800 text-sm dark:bg-green-900/30 dark:text-green-300'
															key={`${answerIndex}-${answer}`}
														>
															{answer}
														</div>
													))}
												</div>
											</td>
											<td className='px-4 py-3'>
												{caseItem.hint || caseItem.hintI18n?.[userLanguage] ? (
													<div className='space-y-1'>
														{caseItem.hint && (
															<div className='text-gray-600 text-sm dark:text-gray-400'>
																{caseItem.hint}
															</div>
														)}
														{caseItem.hintI18n?.[userLanguage] && (
															<div className='text-blue-600 text-sm dark:text-blue-400'>
																{caseItem.hintI18n[userLanguage]}
															</div>
														)}
													</div>
												) : (
													<span className='text-gray-400 text-sm dark:text-gray-600'>
														{t(translations.emptyHint)}
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
