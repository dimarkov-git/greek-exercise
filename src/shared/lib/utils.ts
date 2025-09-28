import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * Combines clsx for conditional classes and tailwind-merge for Tailwind conflicts
 *
 * @param inputs - Class names or conditional class objects
 * @returns Merged and conflict-free class string
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
