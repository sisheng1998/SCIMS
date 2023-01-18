import React, { useState } from 'react'
import {
  ArrowNarrowRightIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../../hooks/useAuth'
import LoadingButtonText from '../../../components/LoadingButtonText'

const ImportChemicals = ({
  CSV,
  processedData,
  setResults,
  errorMessage,
  setErrorMessage,
  setStep,
}) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [isLoading, setIsLoading] = useState(false)

  const validation = processedData.map((chemical) => chemical.validated)
  const allValidated = validation.every((result) => result === true)

  const importChemicalsHandler = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data } = await axiosPrivate.post('/api/private/import', {
        labId: auth.currentLabId,
        chemicals: processedData,
        filename: CSV.name,
      })

      setResults(data.results)
      setIsLoading(false)

      window.scrollTo(0, 0)
      setStep(4)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else if (error.response?.status === 409) {
        setErrorMessage(error.response.data.error)
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }

      setIsLoading(false)
    }
  }

  return (
    <div className='mt-9 flex items-center justify-end'>
      <div className='mr-auto space-y-2 self-end'>
        {errorMessage && (
          <p className='flex items-center text-sm font-medium text-red-600'>
            <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
            {errorMessage}
          </p>
        )}

        <p
          onClick={() => {
            setErrorMessage('')
            setStep(2)
          }}
          className='inline-flex cursor-pointer items-center font-medium text-indigo-600 transition hover:text-indigo-700'
        >
          <ArrowLeftIcon className='mr-1 h-4 w-4' />
          Return Back
        </p>
      </div>

      <button
        className='button button-outline justify-center px-4 py-3'
        onClick={importChemicalsHandler}
        disabled={isLoading || !allValidated}
      >
        {isLoading ? (
          <LoadingButtonText />
        ) : (
          <>
            Import {processedData.length} Chemical
            {processedData.length > 1 ? 's' : ''}
            <ArrowNarrowRightIcon className='ml-2 h-4 w-4 stroke-2' />
          </>
        )}
      </button>
    </div>
  )
}

export default ImportChemicals
