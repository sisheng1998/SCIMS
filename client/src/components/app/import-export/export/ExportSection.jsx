import React, { useState } from 'react'
import MultipleSelect from './MultipleSelect'
import GenerateCSV from './GenerateCSV'

const ExportSection = () => {
	const [selectedColumns, setSelectedColumns] = useState([])
	const [selectedStatuses, setSelectedStatuses] = useState([])

	return (
		<div className='mx-auto w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
			<h4>Export Chemicals to a CSV File</h4>
			<p className='text-sm text-gray-500'>
				Generate and download a CSV file containing a list of all chemicals.
			</p>

			<hr className='mb-6 mt-4 border-gray-200' />

			<label htmlFor='columnsSelection'>
				Which Columns Should Be Exported?
			</label>
			<MultipleSelect
				type='Columns'
				selected={selectedColumns}
				setSelected={setSelectedColumns}
			/>
			<p className='mt-2 text-xs text-gray-400'>
				Leave it empty to export all columns or select the columns that need to
				be included in the CSV file.
			</p>

			<label htmlFor='statusSelection' className='mt-6'>
				Which Chemical's Status Should Be Exported?
			</label>
			<MultipleSelect
				type='Statuses'
				selected={selectedStatuses}
				setSelected={setSelectedStatuses}
			/>
			<p className='mt-2 text-xs text-gray-400'>
				Leave it empty to export all chemical's status or select the statuses
				that need to be included in the CSV file.
			</p>

			<GenerateCSV
				selectedColumns={selectedColumns}
				selectedStatuses={selectedStatuses}
			/>
		</div>
	)
}

export default ExportSection
