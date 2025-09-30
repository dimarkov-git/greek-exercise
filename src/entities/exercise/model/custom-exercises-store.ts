import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {WordFormExerciseJSON} from '@/entities/exercise'

const STORAGE_KEY = 'greek-exercise-custom-exercises'

export interface CustomExerciseRecord {
	readonly exercise: WordFormExerciseJSON
	readonly updatedAt: number
}

export interface CustomExercisesState {
	readonly records: Record<string, CustomExerciseRecord>
	readonly saveExercise: (exercise: WordFormExerciseJSON) => void
	readonly deleteExercise: (id: string) => void
	readonly clearExercises: () => void
}

const sortByUpdatedAtDesc = (
	recordA: CustomExerciseRecord,
	recordB: CustomExerciseRecord
) => recordB.updatedAt - recordA.updatedAt

let cachedRecordsReference: CustomExercisesState['records'] | null = null
let cachedList: readonly CustomExerciseRecord[] = []
let cachedExercisesReference: readonly CustomExerciseRecord[] | null = null
let cachedExercises: readonly WordFormExerciseJSON[] = []
let lastUpdatedTimestamp = 0

export const useCustomExercisesStore = create<CustomExercisesState>()(
	persist(
		set => ({
			records: {},
			saveExercise: (exercise: WordFormExerciseJSON) =>
				set(state => {
					const now = Date.now()
					const nextTimestamp =
						now <= lastUpdatedTimestamp ? lastUpdatedTimestamp + 1 : now
					lastUpdatedTimestamp = nextTimestamp

					return {
						records: {
							...state.records,
							[exercise.id]: {
								exercise,
								updatedAt: nextTimestamp
							}
						}
					}
				}),
			deleteExercise: (id: string) =>
				set(state => {
					if (!(id in state.records)) {
						return state
					}

					const {[id]: _, ...rest} = state.records
					return {records: rest}
				}),
			clearExercises: () => {
				lastUpdatedTimestamp = 0
				set({records: {}})
			}
		}),
		{
			name: STORAGE_KEY
		}
	)
)

export function selectCustomExerciseList(
	state: CustomExercisesState
): readonly CustomExerciseRecord[] {
	if (state.records === cachedRecordsReference) {
		return cachedList
	}

	cachedRecordsReference = state.records
	cachedList = Object.values(state.records).sort(sortByUpdatedAtDesc)
	return cachedList
}

export function selectCustomExercises(
	state: CustomExercisesState
): readonly WordFormExerciseJSON[] {
	const list = selectCustomExerciseList(state)

	if (list === cachedExercisesReference) {
		return cachedExercises
	}

	cachedExercisesReference = list
	cachedExercises = list.map(record => record.exercise)
	return cachedExercises
}
