import 'fake-indexeddb/auto'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import type {SRSData} from '@/entities/exercise'
import {FlashcardStorage} from '../flashcard-storage'
import {initializeSRSData} from '../sm2-algorithm'

describe('FlashcardStorage', () => {
	let storage: FlashcardStorage

	beforeEach(() => {
		storage = new FlashcardStorage()
	})

	afterEach(async () => {
		await storage.clearAllData()
		await storage.close()
	})

	describe('saveCardProgress', () => {
		it('saves SRS data for a card', async () => {
			const srsData = initializeSRSData('card-1', 'exercise-1')

			await storage.saveCardProgress(srsData)

			const loaded = await storage.loadCardProgress('exercise-1', 'card-1')
			expect(loaded).toEqual(srsData)
		})

		it('overwrites existing data for same card', async () => {
			const srsData1 = initializeSRSData('card-1', 'exercise-1')
			const srsData2 = {...srsData1, easeFactor: 3.0, repetitions: 5}

			await storage.saveCardProgress(srsData1)
			await storage.saveCardProgress(srsData2)

			const loaded = await storage.loadCardProgress('exercise-1', 'card-1')
			expect(loaded?.easeFactor).toBe(3.0)
			expect(loaded?.repetitions).toBe(5)
		})

		it('saves data for multiple cards independently', async () => {
			const srsData1 = initializeSRSData('card-1', 'exercise-1')
			const srsData2 = initializeSRSData('card-2', 'exercise-1')

			await storage.saveCardProgress(srsData1)
			await storage.saveCardProgress(srsData2)

			const loaded1 = await storage.loadCardProgress('exercise-1', 'card-1')
			const loaded2 = await storage.loadCardProgress('exercise-1', 'card-2')

			expect(loaded1?.cardId).toBe('card-1')
			expect(loaded2?.cardId).toBe('card-2')
		})
	})

	describe('saveMultipleCards', () => {
		it('saves multiple cards at once', async () => {
			const cards: SRSData[] = [
				initializeSRSData('card-1', 'exercise-1'),
				initializeSRSData('card-2', 'exercise-1'),
				initializeSRSData('card-3', 'exercise-1')
			]

			await storage.saveMultipleCards(cards)

			const loaded = await storage.loadExerciseProgress('exercise-1')
			expect(loaded).toHaveLength(3)
		})

		it('handles empty array', async () => {
			await expect(storage.saveMultipleCards([])).resolves.toBeUndefined()
		})
	})

	describe('loadCardProgress', () => {
		it('returns null for non-existent card', async () => {
			const loaded = await storage.loadCardProgress('exercise-1', 'card-999')

			expect(loaded).toBeNull()
		})

		it('loads saved card data', async () => {
			const srsData = {
				...initializeSRSData('card-1', 'exercise-1'),
				easeFactor: 2.8,
				interval: 10,
				repetitions: 3
			}

			await storage.saveCardProgress(srsData)

			const loaded = await storage.loadCardProgress('exercise-1', 'card-1')
			expect(loaded).toEqual(srsData)
		})
	})

	describe('loadExerciseProgress', () => {
		it('returns empty array for exercise with no progress', async () => {
			const loaded = await storage.loadExerciseProgress('exercise-999')

			expect(loaded).toEqual([])
		})

		it('loads all cards for an exercise', async () => {
			const cards: SRSData[] = [
				initializeSRSData('card-1', 'exercise-1'),
				initializeSRSData('card-2', 'exercise-1'),
				initializeSRSData('card-3', 'exercise-1')
			]

			for (const card of cards) {
				await storage.saveCardProgress(card)
			}

			const loaded = await storage.loadExerciseProgress('exercise-1')
			expect(loaded).toHaveLength(3)
			expect(loaded.map(c => c.cardId)).toEqual(
				expect.arrayContaining(['card-1', 'card-2', 'card-3'])
			)
		})

		it('does not return cards from other exercises', async () => {
			await storage.saveCardProgress(initializeSRSData('card-1', 'exercise-1'))
			await storage.saveCardProgress(initializeSRSData('card-2', 'exercise-2'))

			const loaded = await storage.loadExerciseProgress('exercise-1')
			expect(loaded).toHaveLength(1)
			expect(loaded[0]?.cardId).toBe('card-1')
		})
	})

	describe('resetExerciseProgress', () => {
		it('deletes all progress for an exercise', async () => {
			const cards: SRSData[] = [
				initializeSRSData('card-1', 'exercise-1'),
				initializeSRSData('card-2', 'exercise-1')
			]

			for (const card of cards) {
				await storage.saveCardProgress(card)
			}

			await storage.resetExerciseProgress('exercise-1')

			const loaded = await storage.loadExerciseProgress('exercise-1')
			expect(loaded).toEqual([])
		})

		it('does not affect other exercises', async () => {
			await storage.saveCardProgress(initializeSRSData('card-1', 'exercise-1'))
			await storage.saveCardProgress(initializeSRSData('card-2', 'exercise-2'))

			await storage.resetExerciseProgress('exercise-1')

			const loaded = await storage.loadExerciseProgress('exercise-2')
			expect(loaded).toHaveLength(1)
		})

		it('handles reset for non-existent exercise', async () => {
			await expect(
				storage.resetExerciseProgress('exercise-999')
			).resolves.toBeUndefined()
		})
	})

	describe('getExerciseStats', () => {
		it('returns zero stats for empty exercise', async () => {
			const stats = await storage.getExerciseStats('exercise-1')

			expect(stats).toEqual({
				total: 0,
				new: 0,
				learning: 0,
				review: 0,
				dueToday: 0
			})
		})

		it('counts cards by state', async () => {
			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), state: 'new'},
				{...initializeSRSData('card-2', 'exercise-1'), state: 'new'},
				{...initializeSRSData('card-3', 'exercise-1'), state: 'learning'},
				{...initializeSRSData('card-4', 'exercise-1'), state: 'review'}
			]

			for (const card of cards) {
				await storage.saveCardProgress(card)
			}

			const stats = await storage.getExerciseStats('exercise-1')

			expect(stats.total).toBe(4)
			expect(stats.new).toBe(2)
			expect(stats.learning).toBe(1)
			expect(stats.review).toBe(1)
		})

		it('counts due cards correctly', async () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)

			const tomorrow = new Date()
			tomorrow.setDate(tomorrow.getDate() + 1)

			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), nextReview: yesterday},
				{...initializeSRSData('card-2', 'exercise-1'), nextReview: yesterday},
				{...initializeSRSData('card-3', 'exercise-1'), nextReview: tomorrow}
			]

			for (const card of cards) {
				await storage.saveCardProgress(card)
			}

			const stats = await storage.getExerciseStats('exercise-1')

			expect(stats.dueToday).toBe(2)
		})

		it('counts relearning cards in learning stat', async () => {
			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), state: 'learning'},
				{...initializeSRSData('card-2', 'exercise-1'), state: 'relearning'}
			]

			for (const card of cards) {
				await storage.saveCardProgress(card)
			}

			const stats = await storage.getExerciseStats('exercise-1')

			expect(stats.learning).toBe(2)
		})
	})

	describe('clearAllData', () => {
		it('clears all stored data', async () => {
			await storage.saveCardProgress(initializeSRSData('card-1', 'exercise-1'))
			await storage.saveCardProgress(initializeSRSData('card-2', 'exercise-2'))

			await storage.clearAllData()

			const loaded1 = await storage.loadExerciseProgress('exercise-1')
			const loaded2 = await storage.loadExerciseProgress('exercise-2')

			expect(loaded1).toEqual([])
			expect(loaded2).toEqual([])
		})
	})

	describe('close', () => {
		it('closes database connection', async () => {
			await storage.saveCardProgress(initializeSRSData('card-1', 'exercise-1'))

			await storage.close()

			// Should still work after close (reopens connection)
			const loaded = await storage.loadCardProgress('exercise-1', 'card-1')
			expect(loaded).not.toBeNull()
		})
	})
})
