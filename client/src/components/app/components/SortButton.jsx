import React from 'react'
import {
	SelectorIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from '@heroicons/react/outline'

const SortButton = ({ children, sortOrder, columnKey, sortKey, onClick }) => {
	return (
		<button
			className='group flex items-center font-medium transition hover:text-indigo-600'
			onClick={onClick}
		>
			{children}
			{sortKey === columnKey ? (
				sortOrder === 'asc' ? (
					<ChevronUpIcon className='ml-1 h-4 w-4 stroke-2 p-0.5 text-gray-400 transition group-hover:text-indigo-500' />
				) : (
					<ChevronDownIcon className='ml-1 h-4 w-4 stroke-2 p-0.5 text-gray-400 transition group-hover:text-indigo-500' />
				)
			) : (
				<SelectorIcon className='ml-1 h-4 w-4 text-gray-400 transition group-hover:text-indigo-500' />
			)}
		</button>
	)
}

export default SortButton
