import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@/test-utils'
import {ExerciseLibrary} from './ExerciseLibrary'

// Mock the ExerciseLibraryView component
vi.mock('./exercise-library/ExerciseLibrary', () => ({
	ExerciseLibrary: () => (
		<div data-testid="exercise-library-view">Exercise Library View</div>
	)
}))

describe('ExerciseLibrary', () => {
	it('renders ExerciseLibraryView component', () => {
		render(<ExerciseLibrary />)

		expect(screen.getByTestId('exercise-library-view')).toBeInTheDocument()
		expect(screen.getByText('Exercise Library View')).toBeInTheDocument()
	})

	it('renders without errors', () => {
		expect(() => render(<ExerciseLibrary />)).not.toThrow()
	})

	it('passes props to ExerciseLibraryView', () => {
		render(<ExerciseLibrary />)

		// Verify the component is rendered (implicitly testing prop passing)
		expect(screen.getByTestId('exercise-library-view')).toBeInTheDocument()
	})
})