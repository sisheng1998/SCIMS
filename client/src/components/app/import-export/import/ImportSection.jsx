import React, { useState } from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const ImportSection = () => {
	const [step, setStep] = useState(1)
	const [CSV, setCSV] = useState('')
	const [detectedColumns, setDetectedColumns] = useState([])
	const [mappedColumns, setMappedColumns] = useState([])
	const [data, setData] = useState([])

	const [errorMessage, setErrorMessage] = useState('')

	const setCurrentStep = (currentStep) => {
		if (step === currentStep) return

		setErrorMessage('')
		setStep(currentStep)
	}

	return (
		<div className='mb-6 flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
			<div className='w-full max-w-md space-y-2 font-medium text-gray-400 2xl:max-w-xs xl:flex xl:max-w-full xl:items-center xl:space-x-4 xl:space-y-0'>
				<p
					className={
						step === 1
							? 'pointer-events-none text-lg font-semibold text-indigo-600'
							: 'cursor-pointer transition hover:text-indigo-700'
					}
					onClick={() => setCurrentStep(1)}
				>
					Upload CSV File
				</p>
				<p
					className={
						step === 2
							? 'pointer-events-none text-lg font-semibold text-indigo-600'
							: step > 2
							? 'cursor-pointer transition hover:text-indigo-700'
							: 'pointer-events-none'
					}
					onClick={() => setCurrentStep(2)}
				>
					Column Mapping
				</p>
				<p
					className={
						step === 3
							? 'pointer-events-none text-lg font-semibold text-indigo-600'
							: step > 3
							? 'cursor-pointer transition hover:text-indigo-700'
							: 'pointer-events-none'
					}
					onClick={() => setCurrentStep(3)}
				>
					Preview, Edit & Import
				</p>
				<p
					className={`pointer-events-none ${
						step === 4 ? 'text-lg font-semibold text-indigo-600' : ''
					}`}
				>
					Done!
				</p>
			</div>

			<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
				<h4>Import Chemicals from a CSV File</h4>
				<p className='text-sm text-gray-500'>
					Import (or update) chemicals to current lab from a CSV file containing
					a list of chemicals.
				</p>

				<hr className='mb-6 mt-4 border-gray-200' />

				{step === 1 && (
					<Step1
						CSV={CSV}
						setCSV={setCSV}
						detectedColumns={detectedColumns}
						setDetectedColumns={setDetectedColumns}
						setMappedColumns={setMappedColumns}
						data={data}
						setData={setData}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
						setStep={setStep}
					/>
				)}

				{step === 2 && (
					<Step2
						detectedColumns={detectedColumns}
						mappedColumns={mappedColumns}
						setMappedColumns={setMappedColumns}
						setStep={setStep}
					/>
				)}

				{step === 3 && (
					<Step3
						data={data}
						setData={setData}
						mappedColumns={mappedColumns}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
						setStep={setStep}
					/>
				)}
			</div>
		</div>
	)
}

export default ImportSection
