import React from 'react'
import { CSVLink } from 'react-csv'
import { DownloadIcon } from '@heroicons/react/outline'

const DownloadCSV = ({ data }) => {
	return (
		<div className='mt-9 flex items-center justify-end'>
			<CSVLink
				data={data}
				filename='chemicals.csv'
				className='button button-outline justify-center px-4 py-3'
				target='_blank'
			>
				Download CSV
				<DownloadIcon className='ml-2 h-4 w-4 stroke-2' />
			</CSVLink>
		</div>
	)
}

export default DownloadCSV
