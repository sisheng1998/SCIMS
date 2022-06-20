import React from 'react'
import MultipleSelect from './MultipleSelect'
import GenerateCSV from './GenerateCSV'

const Step1 = ({
	selectedColumns,
	setSelectedColumns,
	selectedStatuses,
	setSelectedStatuses,
	setData,
	setNextStep,
}) => {
	return (
		<>
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
				setData={setData}
				setNextStep={setNextStep}
			/>
		</>
	)
}

export default Step1
