import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingButtonText from '../../components/LoadingButtonText'
import SubjectField from './SubjectField'

const EditSubjectModal = ({ ticket, openModal, setOpenModal, setRefresh }) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [subject, setSubject] = useState(ticket.subject)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateSubject = async (e) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await axiosPrivate.patch(`/api/support/ticket/${ticket._id}`, {
        subject,
      })
      setRefresh(true)
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
        <div className='relative m-4 w-full max-w-xl rounded-lg bg-white p-6 shadow'>
          <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
            <h4>Edit Subject</h4>
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

          <form onSubmit={updateSubject} spellCheck='false' autoComplete='off'>
            <SubjectField subject={subject} setSubject={setSubject} />

            <div className='mt-9 flex items-center justify-end'>
              <span
                onClick={handleClose}
                className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
              >
                Cancel
              </span>

              <button
                className='ml-6 flex w-40 items-center justify-center'
                type='submit'
                disabled={
                  subject === '' || subject === ticket.subject || isLoading
                }
              >
                {isLoading ? <LoadingButtonText /> : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  )
}

export default EditSubjectModal
