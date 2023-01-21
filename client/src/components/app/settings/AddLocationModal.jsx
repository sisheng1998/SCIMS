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

const AddLocationModal = ({
  openModal,
  setOpenModal,
  setAddLocationSuccess,
}) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const labId = auth.currentLabId
  const [name, setName] = useState('')
  const [storageClasses, setStorageClasses] = useState([])
  const [nameValidated, setNameValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const addLocationHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    try {
      const sortedStorageClasses =
        storageClasses.length === STORAGE_CLASSES.length
          ? STORAGE_CLASSES.map((storage_class) => storage_class.code)
          : STORAGE_CLASSES.filter((storage_class) =>
              storageClasses.includes(storage_class.code)
            ).map((storage_class) => storage_class.code)

      await axiosPrivate.post('/api/private/location', {
        labId,
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

    setIsLoading(false)
  }

  useEffect(() => {
    setErrorMessage('')
    setAllowed(nameValidated && storageClasses.length !== 0)
  }, [name, nameValidated, storageClasses])

  const closeHandler = () => {
    setErrorMessage('')
    setName('')
    setStorageClasses([])

    if (success) {
      setSuccess(false)
      setAddLocationSuccess(true)
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
              <h2 className='mt-6 mb-2 text-green-600'>New Location Added!</h2>
              <p>The new location have been added.</p>
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
                <h4>Add New Location</h4>
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
                onSubmit={addLocationHandler}
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
                  showValidated={true}
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

                <div className='mt-9 flex items-center justify-end'>
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
                    {isLoading ? <LoadingButtonText /> : 'Add Location'}
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

export default AddLocationModal
