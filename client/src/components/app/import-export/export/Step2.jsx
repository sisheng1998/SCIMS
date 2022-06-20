import React from 'react'
import CSVTable from './CSVTable'
import DownloadCSV from './DownloadCSV'
import { ArrowLeftIcon } from '@heroicons/react/outline'

const Step2 = ({ data, setNextStep }) => {
	return (
		<>
			<div className='mb-6'>
				<p
					onClick={() => setNextStep(false)}
					className='inline-flex cursor-pointer items-center font-medium text-indigo-600 transition hover:text-indigo-700'
				>
					<ArrowLeftIcon className='mr-1 h-4 w-4' />
					Return
				</p>
			</div>

			<label htmlFor='preview'>Preview</label>
			<CSVTable data={data} />

			<DownloadCSV data={data} />
		</>
	)
}

export default Step2
