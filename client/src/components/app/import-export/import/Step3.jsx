import React from 'react'
import ImportChemicals from './ImportChemicals'

const Step3 = ({
	data,
	setData,
	mappedColumns,
	errorMessage,
	setErrorMessage,
	setStep,
}) => {
	return (
		<>
			<label htmlFor='editor'>Chemicals' Data Editor</label>
			<p className='mt-2 text-xs text-gray-400'>
				You may edit the chemicals' data directly in the table and import them
				when done editing.
			</p>

			<ImportChemicals
				data={data}
				mappedColumns={mappedColumns}
				errorMessage={errorMessage}
				setErrorMessage={setErrorMessage}
				setStep={setStep}
			/>
		</>
	)
}

export default Step3
