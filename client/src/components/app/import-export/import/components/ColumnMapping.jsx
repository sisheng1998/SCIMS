import React from 'react'
import { HEADERS } from '../../../../../config/import_export'

const ColumnMapping = ({
	detectedColumns,
	mappedColumns,
	setMappedColumns,
}) => {
	const selectHandler = (value, index) => {
		const updatedMappedColumns = [...mappedColumns]
		updatedMappedColumns[index].label = value

		setMappedColumns(updatedMappedColumns)
	}

	return (
		<div className='overflow-hidden rounded-lg border border-gray-300'>
			<div className='grid grid-cols-2 bg-gray-50 font-medium text-gray-500'>
				<p className='px-3 py-2'>Column Name</p>
				<p className='px-3 py-2'>Map to Field</p>
			</div>

			{HEADERS.map((header, index) => (
				<div
					key={index}
					className='grid grid-cols-2 border-t border-gray-300 hover:bg-indigo-50/30'
				>
					<div className='space-y-0.5 p-3'>
						<p className='font-medium leading-5'>{header.label}</p>
						<p className='text-sm italic text-gray-400'>
							Sample: {header.sample}
						</p>
					</div>

					<div className='p-3'>
						<select
							className='w-full cursor-pointer'
							name={header.key}
							id={header.key}
							value={mappedColumns[index].label}
							onChange={(e) => selectHandler(e.target.value, index)}
						>
							<option value=''>Select column</option>
							{detectedColumns.map((column, index) => (
								<option key={index} value={column}>
									{column}
								</option>
							))}
						</select>
					</div>
				</div>
			))}

			<div className='h-3 border-t border-gray-300 bg-gray-50'></div>
		</div>
	)
}

export default ColumnMapping
