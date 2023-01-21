import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import NameField from '../../validations/NameField'
import StorageClassesField from '../../validations/StorageClassesField'
import STORAGE_CLASSES from '../../../config/storage_classes'
import LoadingButtonText from '../components/LoadingButtonText'

const EditLocationModal = ({
  location,
  openModal,
  setOpenModal,
  setEditLocationSuccess,
}) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const labId = auth.currentLabId
  const locationId = location._id
  const [name, setName] = useState(location.name)
  const [storageClasses, setStorageClasses] = useState(location.storageClasses)

  const [nameValidated, setNameValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isRemove, setIsRemove] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const editLocationHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    if (isRemove) {
      try {
        await axiosPrivate.delete('/api/private/location', {
          data: {
            labId,
            locationId,
          },
        })
        setSuccess(true)
      } catch (error) {
        if (error.response?.status === 500) {
          setErrorMessage('Server not responding. Please try again later.')
        } else {
          setErrorMessage('Oops. Something went wrong. Please try again later.')
        }
      }
    } else {
      try {
        const sortedStorageClasses =
          storageClasses.length === STORAGE_CLASSES.length
            ? STORAGE_CLASSES.map((storage_class) => storage_class.code)
            : STORAGE_CLASSES.filter((storage_class) =>
                storageClasses.includes(storage_class.code)
              ).map((storage_class) => storage_class.code)

        await axiosPrivate.put('/api/private/location', {
          labId,
          locationId,
          name,
          storageClasses: sortedStorageClasses,
        })
        setSuccess(true)
      } catch (error) {
        if (error.response?.status === 409) {
          setErrorMessage('The location already exists.')
        } else if (error.response?.status === 500) {
          setErrorMessage('Server not responding. Please try again later.')
        } else {
          setErrorMessage('Oops. Something went wrong. Please try again later.')
        }
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setErrorMessage('')
    setAllowed(
      nameValidated &&
        storageClasses.length !== 0 &&
        (name !== location.name ||
          storageClasses.join('') !== location.storageClasses.join(''))
    )
  }, [location, name, nameValidated, storageClasses])

  const closeHandler = () => {
    setErrorMessage('')
    setName('')
    setIsRemove(false)

    if (success) {
      setSuccess(false)
      setEditLocationSuccess(true)
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
                Location {isRemove ? 'Removed' : 'Updated'}!
              </h2>
              {isRemove ? (
                <p>The location has been removed.</p>
              ) : (
                <p>The location have been updated.</p>
              )}
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
                <h4>Edit Location</h4>
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
                onSubmit={editLocationHandler}
                spellCheck='false'
                autoComplete='off'
              >
                <label htmlFor='location' className='required-input-label'>
                  Location Name
                </label>
                <NameField
                  id='location'
                  placeholder='Enter location name (e.g Cabinet A)'
                  required={true}
                  value={name}
                  setValue={setName}
                  validated={nameValidated}
                  setValidated={setNameValidated}
                  withNumber={true}
                />

                <label
                  htmlFor='storageClasses'
                  className='required-input-label'
                >
                  Storage Class(es)
                </label>
                <StorageClassesField
                  value={storageClasses}
                  setValue={setStorageClasses}
                />

                {isRemove ? (
                  <div className='mt-9 flex items-center justify-end'>
                    <div className='mr-auto'>
                      <p className='font-medium text-gray-900'>
                        Confirm remove location?
                      </p>
                      <p className='mt-1 flex items-center text-sm font-medium text-red-600'>
                        <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />
                        This action is irreversible!
                      </p>
                    </div>
                    <span
                      onClick={() => setIsRemove(false)}
                      className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                    >
                      Cancel
                    </span>
                    <button
                      className='button-red ml-6 flex w-40 items-center justify-center'
                      type='submit'
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingButtonText /> : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className='mt-9 flex items-center justify-end'>
                    <span
                      onClick={() => setIsRemove(true)}
                      className='mr-auto cursor-pointer self-end text-sm font-medium text-red-600 transition hover:text-red-700'
                    >
                      Remove Location
                    </span>
                    <span
                      onClick={closeHandler}
                      className='mr-6 cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                    >
                      Cancel
                    </span>
                    <button
                      className='flex w-40 items-center justify-center'
                      type='submit'
                      disabled={!allowed || isLoading}
                    >
                      {isLoading ? <LoadingButtonText /> : 'Update'}
                    </button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default EditLocationModal
