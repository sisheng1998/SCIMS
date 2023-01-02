import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Dialog } from '@headlessui/react'
import {
  XIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingButtonText from '../../components/LoadingButtonText'
import CASNoSelectionField from '../../../validations/CASNoSelectionField'

const EditCASNoModal = ({ chemical, openModal, setOpenModal, setRefresh }) => {
  const params = useParams()
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const labId = chemical.lab._id
  const originalCASId = chemical.CASId._id
  const [CASId, setCASId] = useState(originalCASId)

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateCASNo = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    try {
      await axiosPrivate.patch(
        `/api/private/chemical/${params.chemicalId}/cas`,
        {
          labId,
          CASId,
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

  const handleClose = () => {
    setErrorMessage('')

    if (success) {
      setSuccess(false)
      setRefresh(true)
    }

    setOpenModal(false)
  }

  const isDisabled = CASId === '' || CASId === originalCASId || isLoading

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
          className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
            success ? 'max-w-sm text-center' : 'max-w-xl'
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>CAS No. Updated!</h2>
              <p>The chemical's CAS No. has been updated.</p>
              <span
                className='button button-solid mt-6 w-32 cursor-pointer justify-center'
                onClick={handleClose}
              >
                Okay
              </span>
            </>
          ) : (
            <>
              <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
                <h4>Edit CAS No.</h4>
                <XIcon
                  className='h-5 w-5 cursor-pointer hover:text-indigo-600'
                  onClick={handleClose}
                />
              </div>

              {errorMessage && (
                <p className='mb-6 flex items-center text-sm font-medium text-red-600'>
                  <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                  {errorMessage}
                </p>
              )}

              <div>
                <CASNoSelectionField CASId={CASId} setCASId={setCASId} />

                <div className='mt-9 flex items-center justify-end'>
                  <span
                    onClick={handleClose}
                    className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                  >
                    Cancel
                  </span>

                  <span
                    onClick={updateCASNo}
                    className={`button button-solid ml-6 flex w-40 items-center justify-center ${
                      isDisabled
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    {isLoading ? <LoadingButtonText /> : 'Update'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default EditCASNoModal
