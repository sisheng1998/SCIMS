import React, { useState } from 'react'
import {
  ArrowNarrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../../hooks/useAuth'
import { COLUMNS, STATUS } from '../../../../../config/import_export'
import { FormatChemicalDate } from '../../../../utils/FormatDate'

const getValues = (objects) => objects.map((object) => object.value)

const getProcessedData = (columns, chemicals, locations) =>
  chemicals.map((chemical) => {
    const data = {}

    columns.forEach((column) => {
      const value = column.value

      if (value === 'CASId') {
        data['CASNo'] = String("'" + chemical.CASId.CASNo)
      } else if (value === 'locationId') {
        const location = locations.find(
          (location) => location._id === chemical.locationId
        )
        data['location'] = location ? String(location.name) : ''
      } else if (
        value === 'dateIn' ||
        value === 'dateOpen' ||
        value === 'expirationDate' ||
        value === 'disposedDate'
      ) {
        data[value] = chemical[value]
          ? String("'" + FormatChemicalDate(chemical[value]))
          : ''
      } else {
        data[value] = String(chemical[value])
      }
    })

    return data
  })

const GenerateCSV = ({
  selectedColumns,
  selectedStatus,
  setData,
  setNextStep,
}) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const columns = selectedColumns.length === 0 ? COLUMNS : selectedColumns
  const status = selectedStatus.length === 0 ? STATUS : selectedStatus

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const generateCSVHandler = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data } = await axiosPrivate.post('/api/private/export', {
        labId: auth.currentLabId,
        columns: getValues(columns),
        status: getValues(status),
      })

      setData(getProcessedData(columns, data.chemicals, data.locations))

      setIsLoading(false)
      setNextStep(true)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }

      setIsLoading(false)
    }
  }

  return (
    <div className='mt-9 flex items-center justify-end'>
      {errorMessage && (
        <p className='mr-auto flex items-center self-end text-sm font-medium text-red-600'>
          <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
          {errorMessage}
        </p>
      )}

      <button
        className='button button-outline justify-center px-4 py-3'
        onClick={generateCSVHandler}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            Loading
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
              className='ml-2 h-4 w-4 animate-spin stroke-2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                className='origin-center -scale-x-100'
              ></path>
            </svg>
          </>
        ) : (
          <>
            Generate CSV
            <ArrowNarrowRightIcon className='ml-2 h-4 w-4 stroke-2' />
          </>
        )}
      </button>
    </div>
  )
}

export default GenerateCSV
