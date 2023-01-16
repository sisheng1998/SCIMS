import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingButtonText from '../../components/LoadingButtonText'

const EditSystemConfigModal = ({
  settings,
  setEditSuccess,
  openModal,
  setOpenModal,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [duration, setDuration] = useState(settings.DAY_BEFORE_EXP)
  const [backupTTL, setBackupTTL] = useState(settings.BACKUP_TTL)

  const [allowed, setAllowed] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const editEmailConfigHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    try {
      const newSettings = {
        ...settings,
        DAY_BEFORE_EXP: duration,
        BACKUP_TTL: backupTTL,
      }
      await axiosPrivate.put('/api/admin/settings', newSettings)
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

  useEffect(() => {
    setErrorMessage('')
    setAllowed(
      duration >= 5 &&
        backupTTL >= 7 &&
        (duration !== settings.DAY_BEFORE_EXP ||
          backupTTL !== settings.BACKUP_TTL)
    )
  }, [duration, settings.DAY_BEFORE_EXP, backupTTL, settings.BACKUP_TTL])

  const closeHandler = () => {
    setErrorMessage('')

    if (success) {
      setSuccess(false)
      setEditSuccess(true)
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
              <h2 className='mt-6 mb-2 text-green-600'>
                Configuration Updated!
              </h2>
              <p>The system configuration has been updated.</p>
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
                <h4>Edit System Configuration</h4>
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
                onSubmit={editEmailConfigHandler}
                spellCheck='false'
                autoComplete='off'
              >
                <div>
                  <label htmlFor='duration' className='required-input-label'>
                    Duration Before Chemical Expired
                  </label>
                  <div className='flex items-stretch'>
                    <input
                      className='z-[1] w-full rounded-r-none'
                      type='number'
                      min='5'
                      step='1'
                      id='duration'
                      placeholder='Enter duration'
                      required
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      onWheel={(e) => e.target.blur()}
                    />
                    <p className='flex w-20 flex-shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm'>
                      Days
                    </p>
                  </div>
                  <p className='mt-2 text-xs text-gray-400'>
                    To get notified and change the status of the chemical to
                    "Expiring Soon". Minimum: 5 days.
                  </p>
                </div>

                <div className='mt-6'>
                  <label htmlFor='backup-ttl' className='required-input-label'>
                    Auto Backup Retention Period
                  </label>
                  <div className='flex items-stretch'>
                    <input
                      className='z-[1] w-full rounded-r-none'
                      type='number'
                      min='7'
                      step='1'
                      id='backup-ttl'
                      placeholder='Enter retention period'
                      required
                      value={backupTTL}
                      onChange={(e) => setBackupTTL(Number(e.target.value))}
                      onWheel={(e) => e.target.blur()}
                    />
                    <p className='flex w-20 flex-shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm'>
                      Days
                    </p>
                  </div>
                  <p className='mt-2 text-xs text-gray-400'>
                    The maximum days for auto backups to be kept. Minimum: 7
                    days.
                  </p>
                </div>

                <div className='mt-9 flex items-center justify-end'>
                  <span
                    onClick={closeHandler}
                    className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                  >
                    Cancel
                  </span>
                  <button
                    className='ml-6 flex w-40 items-center justify-center'
                    type='submit'
                    disabled={!allowed || isLoading}
                  >
                    {isLoading ? <LoadingButtonText /> : 'Update'}
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

export default EditSystemConfigModal
