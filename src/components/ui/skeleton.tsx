import {memo} from 'react'
import {cn} from '@/lib/utils'

interface SkeletonProps {
	className?: string
}

export const Skeleton = memo(function Skeleton({className}: SkeletonProps) {
	return (
		<div
			className={cn(
				'animate-pulse rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-surface-elevated)]',
				className
			)}
		/>
	)
})

// Predefined skeleton components for common use cases

export const SkeletonText = memo(function SkeletonText({className}: SkeletonProps) {
	return <Skeleton className={cn('h-4 w-full', className)} />
})

export const SkeletonTitle = memo(function SkeletonTitle({className}: SkeletonProps) {
	return <Skeleton className={cn('h-6 w-3/4', className)} />
})

export const SkeletonButton = memo(function SkeletonButton({className}: SkeletonProps) {
	return <Skeleton className={cn('h-10 w-24 rounded-lg', className)} />
})

export function SkeletonCard({className}: SkeletonProps) {
	return (
		<div className={cn('space-y-4 rounded-lg border p-6', className)}>
			<div className='space-y-2'>
				<SkeletonTitle />
				<SkeletonText />
				<SkeletonText className='w-2/3' />
			</div>
			<div className='flex justify-between'>
				<SkeletonButton />
				<SkeletonButton />
			</div>
		</div>
	)
}

export function SkeletonExerciseCard({className}: SkeletonProps) {
	return (
		<div
			className={cn(
				'space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800',
				className
			)}
		>
			{/* Header */}
			<div className='space-y-3'>
				<div className='flex items-start justify-between'>
					<div className='flex-1 space-y-2'>
						<SkeletonTitle />
						<SkeletonText />
						<SkeletonText className='w-4/5' />
					</div>
					<Skeleton className='h-8 w-12 rounded-full' />
				</div>
			</div>

			{/* Tags */}
			<div className='flex gap-2'>
				<Skeleton className='h-6 w-16 rounded-full' />
				<Skeleton className='h-6 w-20 rounded-full' />
				<Skeleton className='h-6 w-12 rounded-full' />
			</div>

			{/* Stats */}
			<div className='flex justify-between text-sm'>
				<Skeleton className='h-4 w-16' />
				<Skeleton className='h-4 w-16' />
				<Skeleton className='h-4 w-16' />
			</div>

			{/* Actions */}
			<div className='flex justify-between pt-2'>
				<SkeletonButton className='w-32' />
				<SkeletonButton className='w-20' />
			</div>
		</div>
	)
}

export function SkeletonExerciseList({count = 3}: {count?: number}) {
	// Create array with unique identifiers to avoid array index key issue
	const items = Array.from(
		{length: count},
		(_, i) => `exercise-skeleton-${Date.now()}-${i}`
	)

	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{items.map(id => (
				<SkeletonExerciseCard key={id} />
			))}
		</div>
	)
}

export function SkeletonExercisePage() {
	return (
		<div className='space-y-8'>
			{/* Header */}
			<div className='space-y-4'>
				<div className='flex items-center gap-4'>
					<Skeleton className='h-8 w-8 rounded-full' />
					<SkeletonText className='w-32' />
				</div>
				<div className='space-y-2'>
					<SkeletonTitle className='w-1/2' />
					<SkeletonTitle className='h-8 w-1/3' />
				</div>
				<div className='flex justify-between'>
					<SkeletonText className='w-20' />
					<SkeletonText className='w-16' />
				</div>
			</div>

			{/* Exercise Content */}
			<div className='space-y-6'>
				<div className='space-y-4 rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800'>
					<div className='flex items-center gap-4'>
						<SkeletonText className='w-48' />
						<Skeleton className='h-6 w-6 rounded-full' />
					</div>
					<div className='flex items-center gap-4'>
						<SkeletonText className='w-32' />
						<Skeleton className='h-6 w-6 rounded-full' />
					</div>
				</div>

				{/* Input Area */}
				<div className='space-y-4'>
					<Skeleton className='h-12 w-full rounded-lg' />
					<div className='flex gap-3'>
						<SkeletonButton className='w-24' />
						<SkeletonText className='w-32' />
					</div>
				</div>
			</div>
		</div>
	)
}
