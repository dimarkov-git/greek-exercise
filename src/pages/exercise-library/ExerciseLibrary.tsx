import {Head} from '@/components/Head'
import {LoadingOrError} from '@/components/LoadingOrError'
import {useExercises} from '@/hooks/useExercises'
import {useTranslations} from '@/hooks/useTranslations'
import {ExerciseFilters} from './components/ExerciseFilters'
import {ExerciseGrid} from './components/ExerciseGrid'
import {LibraryHeader} from './components/LibraryHeader'
import {UserSettings} from './components/UserSettings'
import {EXERCISE_LIBRARY_TRANSLATIONS} from './constants'
import {useExerciseFiltering} from './hooks/useExerciseFiltering'

export function ExerciseLibrary() {
	const {t} = useTranslations(EXERCISE_LIBRARY_TRANSLATIONS)
	const {data: exerciseLibrary, isLoading, error} = useExercises()

	const {
		filteredExercises,
		selectedTags,
		setSelectedTags,
		selectedDifficulties,
		setSelectedDifficulties,
		selectedLanguages,
		setSelectedLanguages,
		tagOptions,
		difficultyOptions,
		languageOptions,
		clearFilters
	} = useExerciseFiltering(exerciseLibrary)

	const errorProps = error instanceof Error ? {error} : undefined

	return (
		<>
			<Head title={t('exerciseLibrary')} />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-6xl px-4 py-8'>
					<LibraryHeader t={t} />

					{(isLoading || error) && <LoadingOrError {...errorProps} />}

					{exerciseLibrary && (
						<>
							<UserSettings t={t} />

							<ExerciseFilters
								difficultyOptions={difficultyOptions}
								languageOptions={languageOptions}
								selectedDifficulties={selectedDifficulties}
								selectedLanguages={selectedLanguages}
								selectedTags={selectedTags}
								setSelectedDifficulties={setSelectedDifficulties}
								setSelectedLanguages={setSelectedLanguages}
								setSelectedTags={setSelectedTags}
								t={t}
								tagOptions={tagOptions}
							/>

							<ExerciseGrid
								exercises={filteredExercises}
								onClearFilters={clearFilters}
								t={t}
							/>
						</>
					)}
				</div>
			</div>
		</>
	)
}
