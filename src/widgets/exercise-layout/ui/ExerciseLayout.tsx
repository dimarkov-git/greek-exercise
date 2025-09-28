import type {ReactNode} from 'react'
import {cn} from '@/shared/lib'
import {Head} from '@/shared/ui/head'

interface ExerciseLayoutProps {
	title: string
	children: ReactNode
	className?: string
}

export function ExerciseLayout({
	title,
	children,
	className
}: ExerciseLayoutProps) {
	return (
		<>
			<Head title={title} />
			<div
				className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}
			>
				<div className='mx-auto max-w-4xl p-4'>
					<div className='flex min-h-[calc(100vh-2rem)] flex-col'>
						{children}
					</div>
				</div>
			</div>
		</>
	)
}
