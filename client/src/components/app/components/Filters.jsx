import React from 'react'

const Filters = (props) => {
	return (
		<div className='mb-5 flex items-end justify-between text-sm text-gray-500'>
			<div className='flex items-center'>
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
						<option value='1'>50</option>
						<option value='100'>100</option>
						<option value={props.results.length}>All</option>
					</select>
				</div>
				{props.children}
			</div>

			<div className='flex items-center'>
				<p>Search</p>
				<input
					type='text'
					id='search'
					className='ml-2 w-48 px-2 py-1 text-sm text-gray-700'
					autoComplete='off'
					spellCheck='false'
					placeholder={props.searchPlaceholder}
					value={props.searchTerm}
					onChange={(e) => props.setSearchTerm(e.target.value)}
				/>
			</div>
		</div>
	)
}

export default Filters
