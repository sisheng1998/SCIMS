import React from 'react'
import useMobile from '../../../hooks/useMobile'
import { SearchIcon } from '@heroicons/react/outline'

const Filters = (props) => {
	const isMobile = useMobile()

	return (
		<div className='mb-5 flex items-center justify-between text-sm text-gray-500 lg:mb-4 lg:flex-col-reverse lg:items-start'>
			<div className='flex items-center'>
				{!isMobile && (
					<div className='flex items-center'>
						<p>Display</p>
						<select
							className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
							name='itemsPerPage'
							id='itemsPerPage'
							value={props.itemsPerPage}
							onChange={(e) => props.setItemsPerPage(e.target.value)}
						>
							<option value='10'>10</option>
							<option value='50'>50</option>
							<option value='100'>100</option>
							<option value={props.results.length}>All</option>
						</select>
					</div>
				)}
				{props.children}
			</div>

			{!props.hideSearch && (
				<>
					{isMobile ? (
						<div className='relative flex w-full items-center rounded-lg hover:shadow-sm'>
							<input
								type='text'
								id='searchFilter'
								className='w-full pr-8 pl-7 text-sm shadow-none'
								autoComplete='off'
								spellCheck='false'
								placeholder={props.searchPlaceholder}
								value={props.searchTerm}
								onChange={(e) => props.setSearchTerm(e.target.value)}
							/>
							<SearchIcon className='pointer-events-none absolute left-2 h-4 w-4 text-gray-400' />
						</div>
					) : (
						<div className='flex w-full max-w-[18rem] items-center'>
							<p>Search</p>
							<input
								type='text'
								id='searchFilter'
								className='ml-2 w-full px-2 py-1 text-sm text-gray-700 lg:ml-2.5'
								autoComplete='off'
								spellCheck='false'
								placeholder={props.searchPlaceholder}
								value={props.searchTerm}
								onChange={(e) => props.setSearchTerm(e.target.value)}
							/>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default Filters
