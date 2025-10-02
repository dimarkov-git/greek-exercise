/**
 * IndexedDB persistence layer for flashcard SRS data
 *
 * This module handles storing and retrieving Spaced Repetition System (SRS)
 * data for flashcards using IndexedDB for persistent client-side storage.
 */

import type {FlashcardExerciseStats, SRSData} from '@/entities/exercise'

const DB_NAME = 'greek-exercise-flashcards'
const DB_VERSION = 1
const STORE_NAME = 'srs-data'

/**
 * IndexedDB storage for flashcard SRS data
 *
 * Uses IndexedDB for persistent storage of card review history and scheduling.
 * Data persists across browser sessions and page reloads.
 */
export class FlashcardStorage {
	private dbPromise: Promise<IDBDatabase> | null = null

	/**
	 * Initialize IndexedDB connection
	 *
	 * Creates or opens the database and sets up the object store schema.
	 * @returns Promise that resolves to the IDBDatabase instance
	 */
	private getDB(): Promise<IDBDatabase> {
		if (this.dbPromise) return this.dbPromise

		this.dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION)

			request.onerror = () => reject(request.error)
			request.onsuccess = () => resolve(request.result)

			request.onupgradeneeded = event => {
				const db = (event.target as IDBOpenDBRequest).result

				// Create object store with compound key [exerciseId, cardId]
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const store = db.createObjectStore(STORE_NAME, {
						keyPath: ['exerciseId', 'cardId']
					})

					// Create indexes for efficient queries
					store.createIndex('exerciseId', 'exerciseId', {unique: false})
					store.createIndex('nextReview', 'nextReview', {unique: false})
					store.createIndex('state', 'state', {unique: false})
				}
			}
		})

		return this.dbPromise
	}

	/**
	 * Save SRS data for a card
	 *
	 * @param srsData - SRS data to save
	 * @returns Promise that resolves when save is complete
	 */
	async saveCardProgress(srsData: SRSData): Promise<void> {
		const db = await this.getDB()
		const tx = db.transaction(STORE_NAME, 'readwrite')
		const store = tx.objectStore(STORE_NAME)

		return new Promise((resolve, reject) => {
			const request = store.put(srsData)
			request.onsuccess = () => resolve()
			request.onerror = () => reject(request.error)
		})
	}

	/**
	 * Save multiple cards at once (batch operation)
	 *
	 * @param srsDataArray - Array of SRS data to save
	 * @returns Promise that resolves when all saves are complete
	 */
	async saveMultipleCards(srsDataArray: SRSData[]): Promise<void> {
		if (srsDataArray.length === 0) return

		const db = await this.getDB()
		const tx = db.transaction(STORE_NAME, 'readwrite')
		const store = tx.objectStore(STORE_NAME)

		return new Promise((resolve, reject) => {
			let pending = srsDataArray.length
			let hasError = false

			for (const srsData of srsDataArray) {
				const request = store.put(srsData)

				request.onsuccess = () => {
					pending--
					if (pending === 0 && !hasError) {
						resolve()
					}
				}

				request.onerror = () => {
					hasError = true
					reject(request.error)
				}
			}
		})
	}

	/**
	 * Load SRS data for all cards in an exercise
	 *
	 * @param exerciseId - Exercise identifier
	 * @returns Promise that resolves to array of SRS data
	 */
	async loadExerciseProgress(exerciseId: string): Promise<SRSData[]> {
		const db = await this.getDB()
		const tx = db.transaction(STORE_NAME, 'readonly')
		const store = tx.objectStore(STORE_NAME)
		const index = store.index('exerciseId')

		return new Promise((resolve, reject) => {
			const request = index.getAll(exerciseId)
			request.onsuccess = () => resolve(request.result || [])
			request.onerror = () => reject(request.error)
		})
	}

	/**
	 * Load SRS data for a specific card
	 *
	 * @param exerciseId - Exercise identifier
	 * @param cardId - Card identifier
	 * @returns Promise that resolves to SRS data or null if not found
	 */
	async loadCardProgress(
		exerciseId: string,
		cardId: string
	): Promise<SRSData | null> {
		const db = await this.getDB()
		const tx = db.transaction(STORE_NAME, 'readonly')
		const store = tx.objectStore(STORE_NAME)

		return new Promise((resolve, reject) => {
			const request = store.get([exerciseId, cardId])
			request.onsuccess = () => resolve(request.result || null)
			request.onerror = () => reject(request.error)
		})
	}

	/**
	 * Reset progress for an exercise (delete all SRS data)
	 *
	 * @param exerciseId - Exercise identifier
	 * @returns Promise that resolves when reset is complete
	 */
	async resetExerciseProgress(exerciseId: string): Promise<void> {
		const db = await this.getDB()
		const tx = db.transaction(STORE_NAME, 'readwrite')
		const store = tx.objectStore(STORE_NAME)
		const index = store.index('exerciseId')

		return new Promise((resolve, reject) => {
			const request = index.getAllKeys(exerciseId)

			request.onsuccess = () => {
				const keys = request.result
				let pending = keys.length

				if (pending === 0) {
					resolve()
					return
				}

				for (const key of keys) {
					const deleteRequest = store.delete(key)
					deleteRequest.onsuccess = () => {
						pending--
						if (pending === 0) resolve()
					}
					deleteRequest.onerror = () => reject(deleteRequest.error)
				}
			}

			request.onerror = () => reject(request.error)
		})
	}

	/**
	 * Get statistics for an exercise
	 *
	 * @param exerciseId - Exercise identifier
	 * @returns Promise that resolves to statistics object
	 */
	async getExerciseStats(exerciseId: string): Promise<FlashcardExerciseStats> {
		const allData = await this.loadExerciseProgress(exerciseId)
		const now = new Date()

		return {
			total: allData.length,
			new: allData.filter(d => d.state === 'new').length,
			learning: allData.filter(
				d => d.state === 'learning' || d.state === 'relearning'
			).length,
			review: allData.filter(d => d.state === 'review').length,
			dueToday: allData.filter(d => !d.nextReview || d.nextReview <= now).length
		}
	}

	/**
	 * Clear all flashcard data (for testing or reset)
	 *
	 * @returns Promise that resolves when clear is complete
	 */
	async clearAllData(): Promise<void> {
		const db = await this.getDB()
		const tx = db.transaction(STORE_NAME, 'readwrite')
		const store = tx.objectStore(STORE_NAME)

		return new Promise((resolve, reject) => {
			const request = store.clear()
			request.onsuccess = () => resolve()
			request.onerror = () => reject(request.error)
		})
	}

	/**
	 * Close database connection
	 */
	async close(): Promise<void> {
		if (this.dbPromise) {
			const db = await this.dbPromise
			db.close()
			this.dbPromise = null
		}
	}
}

/**
 * Singleton instance of flashcard storage
 *
 * Use this instance throughout the app for consistent storage access.
 */
export const flashcardStorage = new FlashcardStorage()
