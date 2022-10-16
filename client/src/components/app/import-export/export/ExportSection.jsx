import React, { useState } from 'react'
import Step1 from './Step1'
import Step2 from './Step2'

const ExportSection = () => {
  const [selectedColumns, setSelectedColumns] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [nextStep, setNextStep] = useState(false)
  const [data, setData] = useState([])

  return (
    <div className='mb-6 flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
      <div className='w-full max-w-md space-y-2 font-medium text-gray-400 2xl:max-w-xs xl:flex xl:max-w-full xl:items-center xl:space-x-4 xl:space-y-0'>
        <p
          className={
            !nextStep
              ? 'pointer-events-none text-lg font-semibold text-indigo-600'
              : 'cursor-pointer transition hover:text-indigo-700'
          }
          onClick={() => nextStep && setNextStep(false)}
        >
          Configure Export Options
        </p>
        <p
          className={`pointer-events-none ${
            nextStep ? 'text-lg font-semibold text-indigo-600' : ''
          }`}
        >
          Preview & Download
        </p>
      </div>

      <div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
        <h4>Export Chemicals to a CSV File</h4>
        <p className='text-sm text-gray-500'>
          Generate and download a CSV file containing a list of all chemicals.
        </p>

        <hr className='mb-6 mt-4 border-gray-200' />

        {!nextStep ? (
          <Step1
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setData={setData}
            setNextStep={setNextStep}
          />
        ) : (
          <Step2 data={data} setNextStep={setNextStep} />
        )}
      </div>
    </div>
  )
}

export default ExportSection
