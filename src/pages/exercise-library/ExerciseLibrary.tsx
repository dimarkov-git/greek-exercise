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
	const {data: exercises, isLoading, error} = useExercises()

	const {
		selectedTags,
		setSelectedTags,
		selectedDifficulties,
		setSelectedDifficulties,
		filteredExercises,
		allTags,
		clearFilters
	} = useExerciseFiltering(exercises)

	return (
		<>
			<Head title={t('exerciseLibrary')} />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='mx-auto max-w-6xl px-4 py-8'>
					<LibraryHeader t={t} />

					{(isLoading || error) && <LoadingOrError {...(error && {error})} />}

					{exercises && (
						<>
							<UserSettings t={t} />

							<ExerciseFilters
								allTags={allTags}
								selectedDifficulties={selectedDifficulties}
								selectedTags={selectedTags}
								setSelectedDifficulties={setSelectedDifficulties}
								setSelectedTags={setSelectedTags}
								t={t}
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
