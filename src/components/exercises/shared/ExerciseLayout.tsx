import type {ReactNode} from 'react'
import {Head} from '@/components/Head'
import {cn} from '@/lib/utils'

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
