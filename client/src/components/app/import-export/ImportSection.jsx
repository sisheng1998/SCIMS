import React, { useState } from 'react'
import CSVDropZone from '../components/CSVDropZone'
import {
	ExclamationCircleIcon,
	ArrowNarrowRightIcon,
} from '@heroicons/react/outline'

const ImportSection = () => {
	const [errorMessage, setErrorMessage] = useState('')

	return (
		<>
			{errorMessage && (
				<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
					<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
					{errorMessage}
				</p>
			)}

			<label htmlFor='uploadCSV' className='required-input-label'>
				Upload CSV File
			</label>
			<CSVDropZone setCSV={''} setErrorMessage={setErrorMessage} />
			<p className='mt-2 text-xs text-gray-400'>
				Only CSV is supported. Max file size: 5 MB.
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

export default ImportSection
