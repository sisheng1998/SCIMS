import React from 'react'
import { ArrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/outline'
import ColumnMapping from './components/ColumnMapping'
import { Validate, STATUS } from '../../../../config/import_export'

const removeSingleQuote = (value) =>
  value.startsWith("'") ? value.substring(1) : value

const capitalizeFirstLetter = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

const capitalizeFirstLetterForEachWord = (value) => {
  const words = value.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = capitalizeFirstLetter(words[i])
  }

  return words.join(' ')
}

const processValue = (value, key) => {
  let processedValue = removeSingleQuote(String(value))

  if (key === 'state') {
    processedValue = capitalizeFirstLetter(processedValue)
  } else if (key === 'status') {
    const isValid = STATUS.includes(processedValue.toLowerCase())

    processedValue = isValid
      ? capitalizeFirstLetterForEachWord(processedValue)
      : ''
  } else if (key === 'storageClass') {
    processedValue = processedValue.toUpperCase().replace(/\s/g, '')
  } else if (
    key === 'dateIn' ||
    key === 'dateOpen' ||
    key === 'expirationDate' ||
    key === 'disposedDate'
  ) {
    processedValue = processedValue.replace(/\b\d\b/g, '0$&')
  }

  return processedValue
}

const Step2 = ({
  data,
  setProcessedData,
  detectedColumns,
  mappedColumns,
  setMappedColumns,
  setStep,
}) => {
  const getLabel = (value) =>
    mappedColumns.find((column) => column.key === value)['label']

  const continueHandler = () => {
    const processedData = data.map((chemical) => {
      const processedChemical = {
        validated: true,
      }

      mappedColumns.forEach((column) => {
        const value = chemical[getLabel(column.key)]
        const processedValue = value ? processValue(value, column.key) : ''

        processedChemical[column.key] = processedValue
        const isValid = Validate(column.key, processedValue)

        if (processedChemical['validated'] && !isValid) {
          processedChemical['validated'] = false
        }
      })

      return processedChemical
    })

    setProcessedData(processedData)

    window.scrollTo(0, 0)
    setStep(3)
  }

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
          onClick={continueHandler}
        >
          Continue
          <ArrowNarrowRightIcon className='ml-2 h-4 w-4 stroke-2' />
        </button>
      </div>
    </>
  )
}

export default Step2
