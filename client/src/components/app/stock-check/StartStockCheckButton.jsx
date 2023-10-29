import React, { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import axiosPrivate from '../../../api/axiosPrivate'
import useAuth from '../../../hooks/useAuth'
import LoadingButtonText from '../components/LoadingButtonText'
import StockCheckStartedModal from './StockCheckStartedModal'

const StartStockCheckButton = ({ setRefresh }) => {
  const { auth } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const startStockCheck = async () => {
    setErrorMessage('')

    setIsLoading(true)

    try {
      await axiosPrivate.post('/api/private/stock-check/start', {
        labId: auth.currentLabId,
      })
      setOpenModal(true)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }

    setIsLoading(false)
  }

  return (
    <>
      <button
        className='button button-solid w-full justify-center'
        onClick={startStockCheck}
        disabled={isLoading}
      >
        {isLoading ? <LoadingButtonText /> : 'Start Stock Check'}
      </button>

      {errorMessage && (
        <p className='flex items-center text-sm font-medium text-red-600'>
          <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
          {errorMessage}
        </p>
      )}

      {openModal && (
        <StockCheckStartedModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          setRefresh={setRefresh}
        />
      )}
    </>
  )
}

export default StartStockCheckButton
