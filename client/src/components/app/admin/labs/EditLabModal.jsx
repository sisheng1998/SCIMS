import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import UserSearchableSelect from '../../../utils/SearchableSelect'
import LabNameField from '../../../validations/LabNameField'
import FormatDate from '../../../utils/FormatDate'
import StaticLabInfo from '../../components/StaticLabInfo'
import LoadingButtonText from '../../components/LoadingButtonText'

const EditLabModal = ({ lab, isEdit, openModal, setOpenModal, users }) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const labId = lab._id
  const [ownerId, setOwnerId] = useState(lab.labOwner._id)
  const [labName, setLabName] = useState(lab.labName)
  const [labNameValidated, setLabNameValidated] = useState(false)
  const [status, setStatus] = useState(lab.status)

  const [allowed, setAllowed] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isRemove, setIsRemove] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const chemicalsNo = lab.chemicals.length + lab.disposedChemicals.length

  const labUsersNo =
    lab.labUsers.length + lab.admins + (lab.labOwner.isAdmin ? 0 : 1)

  const editLabHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    if (isRemove) {
      try {
        await axiosPrivate.delete('/api/admin/lab', {
          data: {
            labId,
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
        await axiosPrivate.put('/api/admin/lab', {
          labId,
          ownerId,
          labName,
          status,
        })

        setSuccess(true)
      } catch (error) {
        if (error.response?.status === 409) {
          setErrorMessage('A lab with this name already exists.')
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
      labNameValidated &&
        (status !== lab.status ||
          ownerId !== lab.labOwner._id ||
          labName !== lab.labName)
    )
  }, [lab, ownerId, labName, labNameValidated, status])

  const closeHandler = () => {
    setErrorMessage('')
    setIsRemove(false)

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
            success ? 'max-w-sm text-center' : 'max-w-2xl'
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>
                Lab {isRemove ? 'Removed' : 'Info Updated'}!
              </h2>
              {isRemove ? (
                <p>The lab has been removed.</p>
              ) : (
                <p>The lab information has been updated.</p>
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
                <h4>{isEdit ? 'Edit' : 'View'} Lab Information</h4>
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
                onSubmit={editLabHandler}
                spellCheck='false'
                autoComplete='off'
              >
                <div className='mb-6'>
                  <label
                    htmlFor='userSelection'
                    className={isEdit ? 'required-input-label' : undefined}
                  >
                    Lab Owner (Name / Email)
                  </label>
                  <UserSearchableSelect
                    readOnly={!isEdit}
                    selectedId={ownerId}
                    setSelectedId={setOwnerId}
                    options={users}
                    fallbackUser={{
                      name: lab.labOwner.name,
                      email: lab.labOwner.email,
                    }}
                  />
                  {isEdit ? (
                    <p className='mt-2 text-xs text-gray-400'>
                      Lab owner for the current lab.
                    </p>
                  ) : null}
                </div>

                <div className='mb-6 flex space-x-6'>
                  <div className='flex-1'>
                    <label
                      htmlFor='labName'
                      className={isEdit ? 'required-input-label' : undefined}
                    >
                      Lab Name
                    </label>
                    {isEdit ? (
                      <>
                        <LabNameField
                          value={labName}
                          setValue={setLabName}
                          validated={labNameValidated}
                          setValidated={setLabNameValidated}
                        />
                        {labNameValidated || labName === '' ? (
                          <p className='mt-2 text-xs text-gray-400'>
                            Name of the current lab.
                          </p>
                        ) : (
                          <p className='mt-2 text-xs text-red-600'>
                            Please enter a valid lab name.
                          </p>
                        )}
                      </>
                    ) : (
                      <input
                        className='w-full'
                        type='text'
                        name='labName'
                        id='labName'
                        readOnly
                        value={'Lab ' + labName}
                      />
                    )}
                  </div>

                  <div className='flex-1'>
                    <label
                      htmlFor='statusSelection'
                      className={isEdit ? 'required-input-label' : undefined}
                    >
                      Status
                    </label>
                    {isEdit ? (
                      <>
                        <select
                          className='w-full'
                          id='statusSelection'
                          required
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value='In Use'>In Use</option>
                          <option value='Not In Use'>Not In Use</option>
                        </select>
                        <p className='mt-2 text-xs text-gray-400'>
                          Status of the current lab.
                        </p>
                      </>
                    ) : (
                      <input
                        className='w-full'
                        type='text'
                        name='statusSelection'
                        id='statusSelection'
                        readOnly
                        value={lab.status}
                      />
                    )}
                  </div>
                </div>

                <StaticLabInfo
                  labUsersNo={labUsersNo}
                  chemicalsNo={chemicalsNo}
                />

                <div className='mb-9 mt-6 flex items-center justify-between space-x-6 text-sm text-gray-500'>
                  <p>
                    Created At:{' '}
                    <span className='font-semibold'>
                      {FormatDate(lab.createdAt)}
                    </span>
                  </p>
                  <p>
                    Last Updated:{' '}
                    <span className='font-semibold'>
                      {FormatDate(lab.lastUpdated)}
                    </span>
                  </p>
                </div>

                {isRemove ? (
                  <div className='flex items-center justify-end'>
                    <div className='mr-auto'>
                      <p className='font-medium text-gray-900'>
                        Confirm remove the current lab?
                      </p>
                      <p className='mt-1 flex items-center text-sm font-medium text-red-600'>
                        <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
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
                  <div className='flex items-center justify-end'>
                    {isEdit && lab.chemicals.length === 0 && (
                      <span
                        onClick={() => setIsRemove(true)}
                        className='mr-auto cursor-pointer self-end text-sm font-medium text-red-600 transition hover:text-red-700'
                      >
                        Remove Lab
                      </span>
                    )}
                    <span
                      onClick={closeHandler}
                      className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                    >
                      {isEdit ? 'Cancel' : 'Close'}
                    </span>
                    {isEdit && (
                      <button
                        className='ml-6 flex w-40 items-center justify-center'
                        type='submit'
                        disabled={!allowed || isLoading}
                      >
                        {isLoading ? <LoadingButtonText /> : 'Update'}
                      </button>
                    )}
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

export default EditLabModal
