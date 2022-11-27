import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import UserSearchableSelect from '../../../utils/SearchableSelect'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { LabSearchableSelect } from '../../../utils/SearchableSelect'
import RegisterNewUser from '../../components/RegisterNewUser'

const AddUserModal = ({
  users,
  labs,
  openModal,
  setOpenModal,
  setAddUserSuccess,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const divRef = useRef(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [matricNo, setMatricNo] = useState('')
  const [labId, setLabId] = useState('')
  const [role, setRole] = useState(Object.keys(ROLES_LIST)[4])
  const [userId, setUserId] = useState('')

  const [USMEmailValidated, setUSMEmailValidated] = useState(false)
  const [passwordValidated, setPasswordValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [selectUser, setSelectUser] = useState(true)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifiedUser = users.filter(
    (user) => user.isEmailVerified && !user.isAdmin
  )
  const inUseLab = labs.filter((lab) => lab.status === 'In Use')

  const addUserHandler = async (e) => {
    e.preventDefault()

    try {
      if (selectUser) {
        await axiosPrivate.post('/api/private/existing-user', {
          userId,
          labId,
          role: ROLES_LIST[role],
        })
      } else {
        await axiosPrivate.post('/api/private/user', {
          email,
          password,
          labId,
          role: ROLES_LIST[role],
        })
      }
      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 409) {
        if (error.response.data.error === 'User existed.') {
          setErrorMessage(
            'The selected user already exists in the selected lab.'
          )
        } else {
          setErrorMessage('An account with this email already exists.')
        }
      } else if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }
  }

  useEffect(() => {
    setErrorMessage('')
  }, [email, password, name, matricNo, userId, labId])

  useEffect(() => {
    if (selectUser) {
      setAllowed(userId !== '' && labId !== '')
    } else {
      setAllowed(USMEmailValidated && passwordValidated && labId !== '')
    }
  }, [USMEmailValidated, passwordValidated, selectUser, userId, labId])

  const resetInputField = () => {
    setEmail('')
    setPassword('')
    setName('')
    setMatricNo('')
    setUserId('')
  }

  const closeHandler = () => {
    resetInputField()
    setRole(Object.keys(ROLES_LIST)[4])
    setSelectUser(true)

    if (success) {
      if (userId === auth.id) {
        window.location.reload(false)
      } else {
        setSuccess(false)
        setAddUserSuccess(true)
      }
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
              <h2 className='mt-6 mb-2 text-green-600'>New User Added!</h2>
              <p>The new user have been added.</p>
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
                <h4>Add New User</h4>
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
                onSubmit={addUserHandler}
                spellCheck='false'
                autoComplete='off'
              >
                {selectUser ? (
                  <div className='mb-6'>
                    <label
                      htmlFor='userSelection'
                      className='required-input-label'
                    >
                      User (Name / Email)
                    </label>
                    <UserSearchableSelect
                      selectedId={userId}
                      setSelectedId={setUserId}
                      options={verifiedUser}
                    />
                    <p className='mt-2 text-xs text-gray-400'>
                      The list provided includes email verified users only.
                    </p>
                  </div>
                ) : (
                  <RegisterNewUser
                    email={email}
                    setEmail={setEmail}
                    USMEmailValidated={USMEmailValidated}
                    setUSMEmailValidated={setUSMEmailValidated}
                    excludeStudent={false}
                    password={password}
                    setPassword={setPassword}
                    passwordValidated={passwordValidated}
                    setPasswordValidated={setPasswordValidated}
                  />
                )}

                <div className='mb-9 flex'>
                  <div className='mr-3 flex-1'>
                    <label
                      htmlFor='labSelection'
                      className='required-input-label'
                    >
                      Lab
                    </label>
                    <LabSearchableSelect
                      selectedId={labId}
                      setSelectedId={setLabId}
                      options={inUseLab}
                    />
                    <p className='mt-2 text-xs text-gray-400'>
                      The list provided includes "In Use" labs only.
                    </p>
                  </div>

                  <div className='ml-3 flex-1'>
                    <label
                      htmlFor='roleSelection'
                      className='required-input-label'
                    >
                      Role
                    </label>
                    <select
                      className='w-full'
                      id='roleSelection'
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value={Object.keys(ROLES_LIST)[2]}>
                        Postgraduate
                      </option>
                      <option value={Object.keys(ROLES_LIST)[3]}>
                        Undergraduate
                      </option>
                      <option value={Object.keys(ROLES_LIST)[4]}>Guest</option>
                    </select>
                    <p className='mt-2 text-xs text-gray-400'>
                      User role for the current lab.
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
                  <button className='w-40' type='submit' disabled={!allowed}>
                    Add User
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

export default AddUserModal
