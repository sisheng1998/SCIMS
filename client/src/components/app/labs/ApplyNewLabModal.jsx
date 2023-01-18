import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import axios from 'axios'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import LabSelectionField from '../../validations/LabSelectionField'
import LoadingButtonText from '../components/LoadingButtonText'

const ApplyNewLabModal = ({ openModal, setOpenModal }) => {
  const { auth } = useAuth()
  const divRef = useRef(null)

  const email = auth.email
  const [labId, setLabId] = useState('')
  const [labValidated, setLabValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setAllowed(labValidated)
  }, [labValidated])

  const applyNewLabHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      await axios.put('/api/auth/apply-new-lab', { email, labId }, config)
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage('The selected lab already exists in your labs.')
      } else if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }

    setIsLoading(false)
  }

  const closeHandler = () => {
    setLabId('')

    if (success) {
      window.location.reload(false)
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
          className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
            success ? 'max-w-sm text-center' : 'max-w-xl'
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>Request Sent!</h2>
              <p>The request has been sent.</p>
              <button
                className='button button-solid mt-6 w-32 justify-center'
                onClick={closeHandler}
              >
                Okay
              </button>
            </>
          ) : (
            <>
              <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
                <h4>Apply New Lab</h4>
                <XIcon
                  className='h-5 w-5 cursor-pointer hover:text-indigo-600'
                  onClick={closeHandler}
                />
              </div>

              {errorMessage && (
                <p className='mb-6 flex items-center text-sm font-medium text-red-600'>
                  <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                  {errorMessage}
                </p>
              )}

              <form
                onSubmit={applyNewLabHandler}
                spellCheck='false'
                autoComplete='off'
              >
                <label htmlFor='labSelection' className='required-input-label'>
                  Lab
                </label>
                <LabSelectionField
                  checkExist={true}
                  userRoles={auth.roles}
                  value={labId}
                  setValue={setLabId}
                  validated={labValidated}
                  setValidated={setLabValidated}
                />

                <div className='mt-9 flex items-center justify-end'>
                  <span
                    onClick={closeHandler}
                    className='mr-6 cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                  >
                    Cancel
                  </span>
                  <button
                    className='flex w-40 items-center justify-center lg:w-32'
                    type='submit'
                    disabled={!allowed || isLoading}
                  >
                    {isLoading ? <LoadingButtonText /> : 'Apply'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default ApplyNewLabModal
