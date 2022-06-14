import React, { useState } from 'react'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'

const ExportSection = ({ chemicals }) => {
	const [columns, setColumns] = useState('')

	return (
		<>
			<label htmlFor='columnsSelection' className='required-input-label'>
				Columns
			</label>
			<select
				className='w-full text-gray-700'
				name='columnsSelection'
				id='columnsSelection'
				value={columns}
				onChange={(e) => setColumns(e.target.value)}
			>
				<option value=''>Select</option>
			</select>
			<p className='mt-2 text-xs text-gray-400'>
				Select the columns that need to be included in the CSV file.
			</p>

			<div className='mt-6 flex items-center justify-end'>
				<button
					className='button button-outline w-32 justify-center px-4 py-3'
					onClick={() => {}}
					disabled={true}
				>
					Continue
					<ArrowNarrowRightIcon className='ml-2 h-4 w-4' />
				</button>
			</div>
		</>
	)
}

export default ExportSection
