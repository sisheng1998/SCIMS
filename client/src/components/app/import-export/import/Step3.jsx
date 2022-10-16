import React from 'react'
import ImportChemicals from './components/ImportChemicals'
import DataTable from './components/DataTable'

const Step3 = ({
  CSV,
  processedData,
  setProcessedData,
  setResults,
  errorMessage,
  setErrorMessage,
  setStep,
}) => {
  return (
    <>
      <label htmlFor='editor'>Chemicals' Data Editor</label>
      <DataTable
        processedData={processedData}
        setProcessedData={setProcessedData}
      />
      <p className='mt-2 text-xs text-gray-400'>
        You may edit the chemicals' data directly in the table and import them
        when done editing.
      </p>

      <ImportChemicals
        CSV={CSV}
        processedData={processedData}
        setResults={setResults}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setStep={setStep}
      />
    </>
  )
}

export default Step3
