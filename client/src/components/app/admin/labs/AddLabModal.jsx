import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import UserSearchableSelect from '../../../utils/SearchableSelect'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LabNameField from '../../../validations/LabNameField'
import RegisterNewUser from '../../components/RegisterNewUser'
import LoadingButtonText from '../../components/LoadingButtonText'

const AddLabModal = ({ users, openModal, setOpenModal }) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [matricNo, setMatricNo] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [labName, setLabName] = useState('')

  const [labNameValidated, setLabNameValidated] = useState(false)
  const [USMEmailValidated, setUSMEmailValidated] = useState(false)
  const [passwordValidated, setPasswordValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [selectUser, setSelectUser] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const addLabHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    try {
      if (selectUser) {
        await axiosPrivate.post('/api/admin/lab-existing-user', {
          ownerId,
          labName,
        })
      } else {
        await axiosPrivate.post('/api/admin/lab', {
          email,
          password,
          labName,
        })
      }

      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 409) {
        if (error.response.data.error === 'Lab name existed.') {
          setErrorMessage('A lab with this name already exists.')
        } else {
          setErrorMessage('An account with this email already exists.')
        }
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
  }, [email, password, name, matricNo, ownerId, labName])

  useEffect(() => {
    if (selectUser) {
      setAllowed(ownerId !== '' && labNameValidated)
    } else {
      setAllowed(USMEmailValidated && passwordValidated && labNameValidated)
    }
  }, [
    USMEmailValidated,
    passwordValidated,
    selectUser,
    ownerId,
    labNameValidated,
  ])

  const resetInputField = () => {
    setEmail('')
    setPassword('')
    setName('')
    setMatricNo('')
    setOwnerId('')
  }

  const closeHandler = () => {
    resetInputField()
    setLabName('')
    setSelectUser(true)

    if (success) {
      window.location.reload(false)
    }

    setOpenModal(false)
  }

  const selectUserHandler = () => {
    resetInputField()
    setSelectUser(!selectUser)
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
            success ? 'max-w-sm text-center' : 'max-w-3xl'
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>New Lab Added!</h2>
              <p>The new lab have been added.</p>
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
                <h4>Add New Lab</h4>
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
                onSubmit={addLabHandler}
                spellCheck='false'
                autoComplete='off'
              >
                {selectUser ? (
                  <div className='mb-6'>
                    <label
                      htmlFor='userSelection'
                      className='required-input-label'
                    >
                      Lab Owner (Name / Email)
                    </label>
                    <UserSearchableSelect
                      selectedId={ownerId}
                      setSelectedId={setOwnerId}
                      options={users}
                    />
                    <p className='mt-2 text-xs text-gray-400'>
                      Lab owner for the new lab.
                    </p>
                  </div>
                ) : (
                  <RegisterNewUser
                    email={email}
                    setEmail={setEmail}
                    USMEmailValidated={USMEmailValidated}
                    setUSMEmailValidated={setUSMEmailValidated}
                    excludeStudent={true}
                    password={password}
                    setPassword={setPassword}
                    passwordValidated={passwordValidated}
                    setPasswordValidated={setPasswordValidated}
                  />
                )}

                <div className='mb-9 flex'>
                  <div className='mr-3 flex-1'>
                    <label htmlFor='labName' className='required-input-label'>
                      Lab Name
                    </label>
                    <LabNameField
                      value={labName}
                      setValue={setLabName}
                      validated={labNameValidated}
                      setValidated={setLabNameValidated}
                      showValidated={true}
                    />
                    <p className='mt-2 text-xs text-gray-400'>
                      {!labName ? (
                        'Name of the new lab.'
                      ) : labNameValidated ? (
                        <span className='text-green-600'>Looks good!</span>
                      ) : (
                        <span className='text-red-600'>
                          Please enter a valid lab name.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className='ml-3 flex-1'>
                    <label htmlFor='role'>Role</label>
                    <input
                      className='w-full'
                      type='text'
                      name='role'
                      id='role'
                      readOnly
                      value='Lab Owner'
                    />
                    <p className='mt-2 text-xs text-gray-400'>
                      Role cannot be changed.
                    </p>
                  </div>
                </div>

                <div className='flex items-center justify-end'>
                  <span
                    onClick={selectUserHandler}
                    className='mr-auto cursor-pointer self-end text-sm font-medium text-indigo-600 transition hover:text-indigo-700'
                  >
                    {selectUser ? 'Create New User' : 'Select Existing User'}
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
                    {isLoading ? <LoadingButtonText /> : 'Add Lab'}
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

export default AddLabModal
