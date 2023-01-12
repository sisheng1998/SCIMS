import React, { useRef, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import { Loading, Success, Failed } from './ModalComponents'
import BackupField from './BackupField'

const UploadAndRestoreModal = ({ openModal, setOpenModal, setRefresh }) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [backup, setBackup] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(true)
  const [success, setSuccess] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsUploading(false)
    setIsLoading(true)

    const formData = new FormData()
    formData.append('backup', backup)

    try {
      await axiosPrivate.post('/api/admin/backup/upload-and-restore', formData)
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
    if (success) {
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
          className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
            isUploading ? 'max-w-xl' : 'max-w-sm text-center'
          }`}
        >
          {isUploading ? (
            <>
              <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
                <h4>Upload & Restore</h4>
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
                onSubmit={submitHandler}
                spellCheck='false'
                autoComplete='off'
              >
                <BackupField
                  backup={backup}
                  setBackup={setBackup}
                  setErrorMessage={setErrorMessage}
                />

                <div className='mt-9 flex items-center justify-end'>
                  <span
                    onClick={closeHandler}
                    className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                  >
                    Cancel
                  </span>
                  <button
                    className='ml-6 w-40 lg:w-32'
                    type='submit'
                    disabled={!backup}
                  >
                    Restore
                  </button>
                </div>
              </form>
            </>
          ) : isLoading ? (
            <Loading text='Restoring Backup...' closeHandler={closeHandler} />
          ) : success ? (
            <Success
              title='Restore Completed!'
              description='The data have been restored.'
              closeHandler={closeHandler}
            />
          ) : (
            <Failed
              title='Restoration Failed!'
              description='Please try again later.'
              closeHandler={closeHandler}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default UploadAndRestoreModal
