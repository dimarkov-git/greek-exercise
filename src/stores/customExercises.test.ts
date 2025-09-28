import {beforeEach, describe, expect, it} from 'vitest'
import type {WordFormExerciseJSON} from '@/entities/exercise'
import {
	selectCustomExerciseList,
	selectCustomExercises,
	useCustomExercisesStore
} from './customExercises'

const baseExercise: WordFormExerciseJSON = {
	enabled: true,
	id: 'custom-1',
	type: 'word-form',
	language: 'el',
	title: 'Custom exercise',
	description: 'Description',
	tags: ['custom'],
	difficulty: 'a1',
	estimatedTimeMinutes: 5,
	settings: {
		autoAdvance: true,
		autoAdvanceDelayMs: 1500,
		allowSkip: false,
		shuffleCases: false
	},
	blocks: [
		{
			id: 'block-1',
			name: 'Block',
			cases: [
				{
					id: 'case-1',
					prompt: 'prompt',
					correct: ['answer']
				}
			]
		}
	]
}

describe('custom exercises store', () => {
	beforeEach(() => {
		localStorage.clear()
		useCustomExercisesStore.setState({records: {}})
	})

	it('saves exercises by id and overwrites existing ones', () => {
		const {saveExercise, records} = useCustomExercisesStore.getState()
		expect(Object.keys(records)).toHaveLength(0)

		saveExercise(baseExercise)
		let state = useCustomExercisesStore.getState()
		expect(Object.keys(state.records)).toEqual(['custom-1'])

		const updatedExercise: WordFormExerciseJSON = {
			...baseExercise,
			description: 'Updated description'
		}

		saveExercise(updatedExercise)
		state = useCustomExercisesStore.getState()
		expect(Object.keys(state.records)).toEqual(['custom-1'])
		expect(state.records['custom-1']?.exercise.description).toBe(
			'Updated description'
		)
	})

	it('returns exercises sorted by updated date', () => {
		const {saveExercise} = useCustomExercisesStore.getState()

		saveExercise(baseExercise)
		saveExercise({...baseExercise, id: 'custom-2', title: 'Second'})

		const list = selectCustomExerciseList(useCustomExercisesStore.getState())

		expect(list).toHaveLength(2)
		expect(list[0]?.exercise.id).toBe('custom-2')
		expect(list[1]?.exercise.id).toBe('custom-1')
	})

	it('removes exercises by id', () => {
		const {saveExercise, deleteExercise} = useCustomExercisesStore.getState()

		saveExercise(baseExercise)
		saveExercise({...baseExercise, id: 'custom-2'})

		deleteExercise('custom-1')

		const exercises = selectCustomExercises(useCustomExercisesStore.getState())

		expect(exercises).toHaveLength(1)
		expect(exercises[0]?.id).toBe('custom-2')
	})

	it('clears all exercises', () => {
		const {saveExercise, clearExercises} = useCustomExercisesStore.getState()

		saveExercise(baseExercise)

		clearExercises()

		const exercises = selectCustomExercises(useCustomExercisesStore.getState())

		expect(exercises).toHaveLength(0)
	})
})
