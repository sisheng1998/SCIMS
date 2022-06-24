import React from 'react'
import CSVDropZone from './components/CSVDropZone'
import FormatBytes from '../../../utils/FormatBytes'
import {
	DocumentTextIcon,
	ArrowNarrowRightIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'

const Step1 = ({
	CSV,
	setCSV,
	detectedColumns,
	setDetectedColumns,
	setMappedColumns,
	data,
	setData,
	errorMessage,
	setErrorMessage,
	setStep,
}) => {
	const changeFileHandler = () => {
		setErrorMessage('')
		setCSV('')
		setDetectedColumns([])
		setData([])
	}

	return (
		<>
			<label htmlFor='CSVFile' className='required-input-label'>
				CSV File
			</label>
			{!CSV ? (
				<>
					<CSVDropZone
						setCSV={setCSV}
						setDetectedColumns={setDetectedColumns}
						setMappedColumns={setMappedColumns}
						setData={setData}
						setErrorMessage={setErrorMessage}
					/>
					<p className='mt-2 text-xs text-gray-400'>
						Only CSV is supported. Max file size: 10 MB.
					</p>
				</>
			) : (
				<>
					<div className='mt-3 flex items-center'>
						<DocumentTextIcon className='mr-2 h-12 w-12 shrink-0 stroke-1 text-gray-400' />

						<div className='overflow-auto'>
							<p className='max-w-full overflow-hidden text-ellipsis text-sm font-medium'>
								{CSV.name}
							</p>

							<p className='text-xs'>{FormatBytes(CSV.size)}</p>
						</div>

						<div className='ml-6 border-l border-l-gray-200 pl-6'>
							<p className='text-xs text-gray-500'>Columns</p>

							<p className='peer text-sm font-medium empty:hidden'>
								{detectedColumns.join(', ')}
							</p>

							<p className='hidden text-sm font-medium peer-empty:block'>-</p>

							<p className='mt-4 text-xs text-gray-500'>No. of Chemicals</p>
							<p className='text-sm font-medium'>
								{data.length} Chemical{data.length > 1 ? 's ' : ' '}
							</p>
						</div>
					</div>

					<button
						className='button button-outline mt-4 px-3 py-2 text-xs font-semibold'
						onClick={changeFileHandler}
					>
						Change File
					</button>
				</>
			)}

			<div className='mt-9 flex items-center justify-end'>
				{errorMessage && (
					<p className='mr-auto flex items-center self-end text-sm font-medium text-red-600'>
						<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
						{errorMessage}
					</p>
				)}

				<button
					className='button button-outline justify-center px-4 py-3'
					onClick={() => {
						window.scrollTo(0, 0)
						setStep(2)
					}}
					disabled={!CSV || data.length === 0}
				>
					Continue
					<ArrowNarrowRightIcon className='ml-2 h-4 w-4 stroke-2' />
				</button>
			</div>
		</>
	)
}

export default Step1
