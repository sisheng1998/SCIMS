import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingButtonText from '../../components/LoadingButtonText'
import useAuth from '../../../../hooks/useAuth'

const ConfirmationModal = ({
  reportId,
  openModal,
  setOpenModal,
  setRefresh,
  isReopen = false,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const { auth } = useAuth()
  const labId = auth.currentLabId

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const actionHandler = async () => {
    setErrorMessage('')

    setIsLoading(true)

    try {
      await axiosPrivate.patch(
        `/api/private/stock-check/${isReopen ? 'reopen' : 'end'}`,
        {
          labId,
          reportId,
        }
      )
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }

    setIsLoading(false)
  }

  const closeHandler = () => {
    setErrorMessage('')

    if (success) {
      setSuccess(false)
      setRefresh(true)
    }

    setOpenModal(false)
  }

  return (
    <Dialog
      open={openModal}
      onClose={() => {}}
      initialFocus={divRef}
      className='fixed inset-0 z-10 overflow-y-auto'
    >
      <div
        ref={divRef}
        className='flex min-h-screen items-center justify-center'
      >
        <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
        <div
          className={`relative m-4 w-full max-w-sm rounded-lg bg-white p-6 shadow ${
            success ? 'text-center' : ''
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>
                Stock Check Process {isReopen ? 'Reopened' : 'Completed'}!
              </h2>

              <p>
                {isReopen
                  ? 'The stock check process has been reopened and ready to accept any new changes.'
                  : 'The stock check process has been completed and all records are now finalized.'}
              </p>

              <button
                className='button button-solid mt-6 w-32 justify-center'
                onClick={closeHandler}
              >
                Okay
              </button>
            </>
          ) : (
            <>
              <h4 className='mb-2'>
                {isReopen ? 'Reopen' : 'Complete'} Stock Check Process
              </h4>

              {isReopen ? (
                <>
                  <p>
                    Are you sure you want to reopen the stock check process?
                  </p>
                  <p className='mt-2 text-sm text-gray-500'>
                    Once the process is reopened, the stock check report will be
                    set to "In Progress" and able to accept any new changes.
                  </p>
                </>
              ) : (
                <>
                  <p>Are you sure the stock check process is completed?</p>
                  <p className='mt-2 text-sm text-gray-500'>
                    Once the process is completed, all records will be finalized
                    and any new changes won't be accepted.
                  </p>
                </>
              )}

              {errorMessage && (
                <p className='mt-6 flex items-center text-sm font-medium text-red-600'>
                  <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                  {errorMessage}
                </p>
              )}

              <div className='mt-9 flex items-center justify-end'>
                <span
                  onClick={closeHandler}
                  className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                >
                  No
                </span>
                <button
                  onClick={actionHandler}
                  className='button button-solid ml-6 flex w-32 items-center justify-center'
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingButtonText /> : 'Yes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmationModal
