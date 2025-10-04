import {beforeEach, describe, expect, it} from 'vitest'
import type {SRSData} from '@/entities/exercise'
import {
	calculateNextReview,
	getDueCards,
	getSRSStatistics,
	initializeSRSData,
	isCardDue
} from '../sm2-algorithm'

describe('SM-2 Algorithm', () => {
	describe('initializeSRSData', () => {
		it('creates new SRS data with defaults', () => {
			const data = initializeSRSData('card-1', 'exercise-1')

			expect(data.cardId).toBe('card-1')
			expect(data.exerciseId).toBe('exercise-1')
			expect(data.easeFactor).toBe(2.5)
			expect(data.interval).toBe(0)
			expect(data.repetitions).toBe(0)
			expect(data.state).toBe('new')
			expect(data.lastReview).toBeNull()
			expect(data.nextReview).toBeInstanceOf(Date)
		})

		it('creates unique SRS data for different cards', () => {
			const data1 = initializeSRSData('card-1', 'exercise-1')
			const data2 = initializeSRSData('card-2', 'exercise-1')

			expect(data1.cardId).not.toBe(data2.cardId)
		})
	})

	describe('calculateNextReview', () => {
		let baseData: SRSData

		beforeEach(() => {
			baseData = initializeSRSData('card-1', 'exercise-1')
		})

		it('increases interval for correct answer (quality 3)', () => {
			const updated = calculateNextReview(baseData, 3)

			expect(updated.repetitions).toBe(1)
			expect(updated.interval).toBeGreaterThan(0)
			expect(updated.state).toBe('learning')
			expect(updated.nextReview).toBeInstanceOf(Date)
		})

		it('increases interval more for quality 4', () => {
			const q3 = calculateNextReview(baseData, 3)
			const q4 = calculateNextReview(baseData, 4)

			expect(q4.interval).toBeGreaterThanOrEqual(q3.interval)
		})

		it('resets interval for incorrect answer (quality < 3)', () => {
			const data = {
				...baseData,
				repetitions: 5,
				interval: 30,
				state: 'review' as const
			}

			const updated = calculateNextReview(data, 1)

			expect(updated.repetitions).toBe(0)
			expect(updated.interval).toBe(0)
			expect(updated.state).toBe('relearning')
		})

		it('resets interval for quality 2 (hard)', () => {
			const data = {
				...baseData,
				repetitions: 3,
				interval: 10
			}

			const updated = calculateNextReview(data, 2)

			expect(updated.repetitions).toBe(0)
			expect(updated.interval).toBe(0)
		})

		it('applies ease factor on subsequent reviews', () => {
			let data = baseData

			// First review
			data = calculateNextReview(data, 3)

			// Second review
			data = calculateNextReview(data, 3)
			const secondInterval = data.interval

			// Third review - should use ease factor
			data = calculateNextReview(data, 3)
			const thirdInterval = data.interval

			expect(thirdInterval).toBeGreaterThan(secondInterval)
			expect(data.state).toBe('review')
		})

		it('increases ease factor for high quality ratings', () => {
			const initialEase = baseData.easeFactor
			const updated = calculateNextReview(baseData, 5)

			expect(updated.easeFactor).toBeGreaterThan(initialEase)
		})

		it('decreases ease factor for low quality ratings', () => {
			const initialEase = baseData.easeFactor
			const updated = calculateNextReview(baseData, 0)

			expect(updated.easeFactor).toBeLessThan(initialEase)
		})

		it('enforces minimum ease factor of 1.3', () => {
			let data = {...baseData, easeFactor: 1.3}

			// Try to decrease below minimum
			for (let i = 0; i < 10; i++) {
				data = calculateNextReview(data, 0)
			}

			expect(data.easeFactor).toBeGreaterThanOrEqual(1.3)
		})

		it('applies easy bonus for quality 4-5 after graduation', () => {
			let data = baseData

			// Graduate the card
			data = calculateNextReview(data, 3)
			data = calculateNextReview(data, 3)

			// Now test easy bonus
			const baseInterval = data.interval
			data = calculateNextReview(data, 4)

			expect(data.interval).toBeGreaterThan(baseInterval)
		})

		it('updates lastReview timestamp', () => {
			const before = new Date()
			const updated = calculateNextReview(baseData, 3)
			const after = new Date()

			expect(updated.lastReview).toBeInstanceOf(Date)
			expect(updated.lastReview!.getTime()).toBeGreaterThanOrEqual(
				before.getTime()
			)
			expect(updated.lastReview!.getTime()).toBeLessThanOrEqual(after.getTime())
		})

		it('sets next review to future date for correct answers', () => {
			const now = new Date()
			const updated = calculateNextReview(baseData, 3)

			expect(updated.nextReview).toBeInstanceOf(Date)
			expect(updated.nextReview!.getTime()).toBeGreaterThan(now.getTime())
		})

		it('respects custom SRS settings', () => {
			const customSettings = {
				graduatingInterval: 7,
				easyInterval: 10
			}

			const updated = calculateNextReview(baseData, 3, customSettings)

			expect(updated.interval).toBe(7)
		})
	})

	describe('isCardDue', () => {
		it('returns true for new cards without nextReview', () => {
			const data = {
				...initializeSRSData('card-1', 'exercise-1'),
				nextReview: null
			}

			expect(isCardDue(data)).toBe(true)
		})

		it('returns true for cards with past nextReview date', () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)

			const data = {
				...initializeSRSData('card-1', 'exercise-1'),
				nextReview: yesterday
			}

			expect(isCardDue(data)).toBe(true)
		})

		it('returns true for cards due exactly now', () => {
			const now = new Date()

			const data = {
				...initializeSRSData('card-1', 'exercise-1'),
				nextReview: now
			}

			expect(isCardDue(data, now)).toBe(true)
		})

		it('returns false for cards with future nextReview date', () => {
			const tomorrow = new Date()
			tomorrow.setDate(tomorrow.getDate() + 1)

			const data = {
				...initializeSRSData('card-1', 'exercise-1'),
				nextReview: tomorrow
			}

			expect(isCardDue(data)).toBe(false)
		})

		it('uses provided now parameter', () => {
			const futureDate = new Date('2025-12-31')
			const testDate = new Date('2025-12-30')

			const data = {
				...initializeSRSData('card-1', 'exercise-1'),
				nextReview: futureDate
			}

			expect(isCardDue(data, testDate)).toBe(false)
		})
	})

	describe('getDueCards', () => {
		it('returns empty array when no cards are due', () => {
			const tomorrow = new Date()
			tomorrow.setDate(tomorrow.getDate() + 1)

			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), nextReview: tomorrow},
				{...initializeSRSData('card-2', 'exercise-1'), nextReview: tomorrow}
			]

			const due = getDueCards(cards)

			expect(due).toHaveLength(0)
		})

		it('returns only cards that are due', () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)

			const tomorrow = new Date()
			tomorrow.setDate(tomorrow.getDate() + 1)

			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), nextReview: yesterday},
				{...initializeSRSData('card-2', 'exercise-1'), nextReview: tomorrow},
				{...initializeSRSData('card-3', 'exercise-1'), nextReview: yesterday}
			]

			const due = getDueCards(cards)

			expect(due).toHaveLength(2)
			expect(due.map(d => d.cardId)).toEqual(
				expect.arrayContaining(['card-1', 'card-3'])
			)
		})

		it('sorts overdue cards by most overdue first', () => {
			const now = new Date()
			const oneDayAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24)
			const twoDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)

			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), nextReview: oneDayAgo},
				{...initializeSRSData('card-2', 'exercise-1'), nextReview: twoDaysAgo},
				{...initializeSRSData('card-3', 'exercise-1'), nextReview: now}
			]

			const due = getDueCards(cards, now)

			expect(due[0]?.cardId).toBe('card-2') // Most overdue
			expect(due[1]?.cardId).toBe('card-1')
			expect(due[2]?.cardId).toBe('card-3')
		})

		it('prioritizes new cards over review cards', () => {
			const now = new Date()

			const cards: SRSData[] = [
				{
					...initializeSRSData('card-1', 'exercise-1'),
					nextReview: now,
					state: 'review'
				},
				{
					...initializeSRSData('card-2', 'exercise-1'),
					nextReview: now,
					state: 'new'
				}
			]

			const due = getDueCards(cards, now)

			expect(due[0]?.cardId).toBe('card-2') // New card first
		})

		it('prioritizes learning cards over review cards', () => {
			const now = new Date()

			const cards: SRSData[] = [
				{
					...initializeSRSData('card-1', 'exercise-1'),
					nextReview: now,
					state: 'review'
				},
				{
					...initializeSRSData('card-2', 'exercise-1'),
					nextReview: now,
					state: 'learning'
				}
			]

			const due = getDueCards(cards, now)

			expect(due[0]?.cardId).toBe('card-2') // Learning card first
		})
	})

	describe('getSRSStatistics', () => {
		it('returns statistics for empty array', () => {
			const stats = getSRSStatistics([])

			expect(stats.total).toBe(0)
			expect(stats.new).toBe(0)
			expect(stats.learning).toBe(0)
			expect(stats.review).toBe(0)
			expect(stats.dueToday).toBe(0)
			expect(stats.averageEaseFactor).toBe(2.5)
		})

		it('counts cards by state', () => {
			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), state: 'new'},
				{...initializeSRSData('card-2', 'exercise-1'), state: 'new'},
				{...initializeSRSData('card-3', 'exercise-1'), state: 'learning'},
				{...initializeSRSData('card-4', 'exercise-1'), state: 'review'}
			]

			const stats = getSRSStatistics(cards)

			expect(stats.total).toBe(4)
			expect(stats.new).toBe(2)
			expect(stats.learning).toBe(1)
			expect(stats.review).toBe(1)
		})

		it('counts due cards correctly', () => {
			const yesterday = new Date()
			yesterday.setDate(yesterday.getDate() - 1)

			const tomorrow = new Date()
			tomorrow.setDate(tomorrow.getDate() + 1)

			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), nextReview: yesterday},
				{...initializeSRSData('card-2', 'exercise-1'), nextReview: yesterday},
				{...initializeSRSData('card-3', 'exercise-1'), nextReview: tomorrow}
			]

			const stats = getSRSStatistics(cards)

			expect(stats.dueToday).toBe(2)
		})

		it('calculates average ease factor', () => {
			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), easeFactor: 2.0},
				{...initializeSRSData('card-2', 'exercise-1'), easeFactor: 2.5},
				{...initializeSRSData('card-3', 'exercise-1'), easeFactor: 3.0}
			]

			const stats = getSRSStatistics(cards)

			expect(stats.averageEaseFactor).toBe(2.5)
		})

		it('rounds average ease factor to 2 decimals', () => {
			const cards: SRSData[] = [
				{...initializeSRSData('card-1', 'exercise-1'), easeFactor: 2.333},
				{...initializeSRSData('card-2', 'exercise-1'), easeFactor: 2.666}
			]

			const stats = getSRSStatistics(cards)

			expect(stats.averageEaseFactor).toBe(2.5)
		})
	})
})
