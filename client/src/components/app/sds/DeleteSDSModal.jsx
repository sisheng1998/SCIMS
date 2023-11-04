import React, { useEffect, useRef, useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'
import LoadingButtonText from '../components/LoadingButtonText'
import axiosPrivate from '../../../api/axiosPrivate'
import { Loading } from '../admin/backup-restore/components/ModalComponents'
import ChemicalTable from './ChemicalTable'

const DeleteSDSModal = ({
  CAS,
  openModal,
  setOpenModal,
  setDeleteSDSSuccess,
}) => {
  const divRef = useRef(null)

  const [chemicals, setChemicals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getSDSChemicals = async () => {
      try {
        const { data } = await axiosPrivate.get(
          `/api/private/sds/${CAS._id}/chemicals`,
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          setChemicals(data.chemicals)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getSDSChemicals()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [CAS._id])

  const submitHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsDeleting(true)

    try {
      await axiosPrivate.delete(`/api/private/sds/${CAS._id}`)
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error)
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }

    setIsDeleting(false)
  }

  const closeHandler = () => {
    setErrorMessage('')

    if (success) {
      setSuccess(false)
      setDeleteSDSSuccess(true)
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
            success || isLoading ? 'max-w-sm text-center' : 'max-w-xl'
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>SDS Deleted!</h2>
              <p>The SDS have been deleted.</p>
              <button
                className='button button-solid mt-6 w-32 justify-center'
                onClick={closeHandler}
              >
                Okay
              </button>
            </>
          ) : isLoading ? (
            <Loading
              text='Verifying SDS dependencies...'
              closeHandler={closeHandler}
            />
          ) : (
            <>
              <div className='flex justify-between border-b border-gray-200 pb-3'>
                <h4>Delete SDS</h4>
                <XIcon
                  className='h-5 w-5 cursor-pointer hover:text-indigo-600'
                  onClick={closeHandler}
                />
              </div>

              <div className='my-4 flex items-start space-x-2 rounded-lg bg-red-50 p-3 text-red-600'>
                <InformationCircleIcon className='h-5 w-5 shrink-0' />
                <p className='text-sm font-medium'>
                  {chemicals.length > 0
                    ? 'Unable to delete, the SDS has chemical(s) associated.'
                    : 'Are you sure you want to delete? This action cannot be undone.'}
                </p>
              </div>

              {chemicals.length > 0 ? (
                <>
                  <label htmlFor='chemicals'>Associated Chemicals</label>
                  <ChemicalTable chemicals={chemicals} />
                  <p className='mt-2 text-xs text-gray-400'>
                    Total {chemicals.length} chemical
                    {chemicals.length === 1 ? '' : 's'} associated with this
                    SDS.
                  </p>

                  <div className='mt-9 flex items-center justify-end'>
                    <span
                      onClick={closeHandler}
                      className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                    >
                      Close
                    </span>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={submitHandler}
                  spellCheck='false'
                  autoComplete='off'
                >
                  <div className='mb-6 grid grid-cols-3 gap-6'>
                    <div>
                      <label htmlFor='CAS' className='mb-0.5'>
                        CAS No.
                      </label>
                      <p className='font-medium'>{CAS.CASNo}</p>
                    </div>

                    <div className='col-span-2'>
                      <label htmlFor='chemicalName' className='mb-0.5'>
                        Name of Chemical
                      </label>
                      <p className='font-medium'>{CAS.chemicalName}</p>
                    </div>
                  </div>

                  <label
                    htmlFor='confirmationText'
                    className='required-input-label'
                  >
                    Type <b>DELETE</b> to confirm
                  </label>
                  <input
                    id='confirmationText'
                    name='confirmationText'
                    className='w-full'
                    type='text'
                    placeholder='DELETE'
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    required
                  />
                  <p className='mt-2 text-xs text-gray-400'>
                    Enter the word <b>DELETE</b> in the field above to confirm
                    the deletion.
                  </p>

                  {errorMessage && (
                    <p className='mt-3 flex items-center text-sm font-medium text-red-600'>
                      <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                      {errorMessage}
                    </p>
                  )}

                  <div className='mt-9 flex items-center justify-end'>
                    <span
                      onClick={closeHandler}
                      className='mr-6 cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                    >
                      Cancel
                    </span>
                    <button
                      className='button-red flex w-40 items-center justify-center'
                      type='submit'
                      disabled={confirmationText !== 'DELETE' || isDeleting}
                    >
                      {isDeleting ? <LoadingButtonText /> : 'Delete'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default DeleteSDSModal
