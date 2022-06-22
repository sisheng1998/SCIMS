import React from 'react'
import { ArrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/outline'
import ColumnMapping from './ColumnMapping'

const Step2 = ({
	detectedColumns,
	mappedColumns,
	setMappedColumns,
	setStep,
}) => {
	return (
		<>
			<label htmlFor='columnMapping' className='required-input-label'>
				Map CSV Fields to Chemicals
			</label>
			<ColumnMapping
				detectedColumns={detectedColumns}
				mappedColumns={mappedColumns}
				setMappedColumns={setMappedColumns}
			/>
			<p className='mt-2 text-xs text-gray-400'>
				Select fields from CSV file to map against chemicals fields, or to
				ignore during import.
			</p>

			<div className='mt-9 flex items-center justify-end'>
				<p
					onClick={() => setStep(1)}
					className='mr-auto inline-flex cursor-pointer items-center self-end font-medium text-indigo-600 transition hover:text-indigo-700'
				>
					<ArrowLeftIcon className='mr-1 h-4 w-4' />
					Return Back
				</p>

				<button
					className='button button-outline justify-center px-4 py-3'
					onClick={() => setStep(3)}
				>
					Continue
					<ArrowNarrowRightIcon className='ml-2 h-4 w-4 stroke-2' />
				</button>
			</div>
		</>
	)
}

export default Step2
