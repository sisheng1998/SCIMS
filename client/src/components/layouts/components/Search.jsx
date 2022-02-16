import React from 'react'
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/outline'

const Search = () => {
	return (
		<form
			autoComplete='off'
			spellCheck='false'
			className='relative flex w-full max-w-sm flex-1 items-center rounded-lg hover:shadow-sm'
		>
			<input
				type='text'
				name='search'
				id='search'
				placeholder='Search inventory'
				className='w-full pr-8 pl-7 text-sm shadow-none'
			/>
			<SearchIcon className='absolute left-2 h-4 w-4 cursor-pointer text-gray-400 transition hover:text-indigo-600' />
			<AdjustmentsIcon className='absolute right-2 h-5 w-5 cursor-pointer text-gray-400 transition hover:text-indigo-600' />
		</form>
	)
}

export default Search
