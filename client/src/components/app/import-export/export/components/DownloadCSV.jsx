import React from 'react'
import { CSVLink } from 'react-csv'
import { ArrowLeftIcon, DownloadIcon } from '@heroicons/react/outline'
import useAuth from '../../../../../hooks/useAuth'
import { HEADERS } from '../../../../../config/import_export'

const DownloadCSV = ({ data, setNextStep }) => {
	const headers = HEADERS.filter(
		(header) => data.length !== 0 && Object.keys(data[0]).includes(header.key)
	)

	const { auth } = useAuth()
	const today = new Date().toJSON().slice(0, 10)

	const filename = `lab ${auth.currentLabName} chemicals ${today}.csv`
		.replace(/\s/g, '_')
		.toLowerCase()

	return (
		<div className='mt-9 flex items-center justify-end'>
			<p
				onClick={() => setNextStep(false)}
				className='mr-auto inline-flex cursor-pointer items-center self-end font-medium text-indigo-600 transition hover:text-indigo-700'
			>
				<ArrowLeftIcon className='mr-1 h-4 w-4' />
				Return Back
			</p>

			{data.length !== 0 && (
				<CSVLink
					data={data}
					headers={headers}
					filename={filename}
					className='button button-outline ml-6 justify-center px-4 py-3'
					target='_blank'
				>
					Download CSV
					<DownloadIcon className='ml-2 h-4 w-4 stroke-2' />
				</CSVLink>
			)}
		</div>
	)
}

export default DownloadCSV
