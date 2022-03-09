import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'

const Pagination = ({
	searchTerm,
	filterTerms,
	indexOfFirstItem,
	indexOfLastItem,
	currentPage,
	itemsPerPage,
	totalItems,
	paginate,
}) => {
	const pageNumbers = []
	for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
		pageNumbers.push(i)
	}

	const [buttons, setButtons] = useState([])

	useEffect(() => {
		const dots = '...'
		let tempPageNumbers = [...buttons]

		if (pageNumbers.length < 6) {
			tempPageNumbers = pageNumbers
		} else if (currentPage >= 1 && currentPage <= 3) {
			tempPageNumbers = [1, 2, 3, 4, dots, pageNumbers.length]
		} else if (currentPage === 4) {
			const sliced = pageNumbers.slice(0, 5)
			tempPageNumbers = [...sliced, dots, pageNumbers.length]
		} else if (currentPage > 4 && currentPage < pageNumbers.length - 2) {
			const sliced1 = pageNumbers.slice(currentPage - 2, currentPage)
			const sliced2 = pageNumbers.slice(currentPage, currentPage + 1)
			tempPageNumbers = [
				1,
				dots,
				...sliced1,
				...sliced2,
				dots,
				pageNumbers.length,
			]
		} else if (currentPage > pageNumbers.length - 3) {
			const sliced = pageNumbers.slice(pageNumbers.length - 4)
			tempPageNumbers = [1, dots, ...sliced]
		}

		setButtons(tempPageNumbers)
		paginate(currentPage)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, itemsPerPage, searchTerm, filterTerms])

	return (
		<nav className='mb-6 flex items-center justify-between'>
			<p className='text-sm'>
				Showing{' '}
				{indexOfFirstItem + 1 === totalItems ? (
					<span className='font-medium'>{indexOfFirstItem + 1}</span>
				) : totalItems === 0 ? null : (
					<>
						<span className='font-medium'>{indexOfFirstItem + 1}</span> -{' '}
						<span className='font-medium'>{indexOfLastItem}</span>
					</>
				)}{' '}
				{totalItems === 0 ? '' : 'of'}{' '}
				<span className='font-medium'>{totalItems}</span>{' '}
				{totalItems > 1 ? 'results' : 'result'}
			</p>

			<ul className='flex items-center rounded-lg text-sm font-medium text-gray-500 shadow-sm'>
				<li
					className={`pointer-events-none inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-l-lg border border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 ${
						currentPage > 1 ? 'pointer-events-auto' : 'text-gray-300'
					}`}
					onClick={() => paginate(currentPage - 1)}
				>
					<ChevronLeftIcon className='h-3.5 w-3.5 stroke-2' />
				</li>

				{buttons.map((number, index) => (
					<li
						className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 ${
							number === currentPage
								? 'pointer-events-none border-indigo-500 bg-indigo-50 font-semibold text-indigo-600'
								: ''
						}${number === '...' ? ' pointer-events-none text-gray-300' : ''}`}
						key={index}
						onClick={() => paginate(number)}
					>
						{number}
					</li>
				))}

				<li
					className={`pointer-events-none inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-r-lg border border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 ${
						currentPage < pageNumbers[pageNumbers.length - 1]
							? 'pointer-events-auto'
							: 'text-gray-300'
					}`}
					onClick={() => paginate(currentPage + 1)}
				>
					<ChevronRightIcon className='h-3.5 w-3.5 stroke-2' />
				</li>
			</ul>
		</nav>
	)
}

export default Pagination
