import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import FormatAmountWithUnit from '../../../utils/FormatAmountWithUnit'
import NumberWithUnitField from '../../../validations/NumberWithUnitField'
import FormatDate from '../../../utils/FormatDate'
import useMobile from '../../../../hooks/useMobile'

const ChemicalUsageModal = ({
  chemical,
  openModal,
  setOpenModal,
  setUpdateAmountSuccess,
}) => {
  const isMobile = useMobile()
  const divRef = useRef(null)

  const isMounted = useRef(true)
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])
  const axiosPrivate = useAxiosPrivate()

  const labId = chemical.lab._id
  const chemicalId = chemical._id

  const [usage, setUsage] = useState('')
  const [remainingAmount, setRemainingAmount] = useState('')
  const [ownUse, setOwnUse] = useState(true)
  const [remark, setRemark] = useState('')

  const [usageValidated, setUsageValidated] = useState(false)

  const [allowed, setAllowed] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      await axiosPrivate.post('/api/private/chemical/usage', {
        labId,
        chemicalId,
        usage,
        remark: ownUse ? '' : remark,
      })
      if (isMounted.current) {
        setSuccess(true)
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }
  }

  useEffect(() => {
    setErrorMessage('')

    if (ownUse) {
      setAllowed(usageValidated && Number(usage) !== 0)
    } else {
      setAllowed(usageValidated && Number(usage) !== 0 && remark !== '')
    }

    if (usage) {
      const remainingAmount = Number(chemical.amount) - Number(usage)
      setRemainingAmount(remainingAmount)

      if (remainingAmount < 0) setAllowed(false)
    }
  }, [usage, usageValidated, ownUse, remark, chemical])

  const closeHandler = () => {
    setErrorMessage('')
    setUsage('')
    setRemainingAmount('')
    setOwnUse(true)
    setRemark('')

    if (success) {
      setSuccess(false)
      setUpdateAmountSuccess(true)
    }

    setOpenModal(false)
  }

  return (
    <Dialog
      open={openModal}
      onClose={() => {}}
      initialFocus={divRef}
      className='fixed inset-0 z-20 overflow-y-auto'
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
              <h2 className='mt-6 mb-2 text-green-600'>Usage Recorded!</h2>
              <p>The chemical usage has been recorded.</p>
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
                <h4>Chemical Usage</h4>
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
                {!isMobile && (
                  <div className='mb-6 grid grid-cols-3 gap-6'>
                    <div>
                      <label htmlFor='CAS' className='mb-1'>
                        CAS No.
                      </label>
                      {chemical.CASId.CASNo}
                    </div>

                    <div className='col-span-2'>
                      <label htmlFor='name' className='mb-1'>
                        Name
                      </label>
                      {chemical.name}
                    </div>

                    <div>
                      <label htmlFor='containerSize' className='mb-1'>
                        Container Size
                      </label>
                      {FormatAmountWithUnit(
                        chemical.containerSize,
                        chemical.unit
                      )}
                    </div>

                    <div>
                      <label htmlFor='amount' className='mb-1'>
                        Current Amount
                      </label>
                      {FormatAmountWithUnit(chemical.amount, chemical.unit)}
                      {Number(chemical.amount) <=
                        Number(chemical.minAmount) && (
                        <span
                          className='tooltip ml-1.5'
                          data-tooltip='Low Amount'
                        >
                          <ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
                        </span>
                      )}
                    </div>

                    <div>
                      <label htmlFor='lastUpdated' className='mb-1'>
                        Last Updated
                      </label>
                      {FormatDate(chemical.lastUpdated)}
                    </div>
                  </div>
                )}

                <label htmlFor='calculation'>Calculation</label>
                <div className='mb-6 grid grid-cols-5 items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3'>
                  <div className='whitespace-nowrap text-center'>
                    <p className='text-xl'>
                      {FormatAmountWithUnit(chemical.amount, chemical.unit)}
                    </p>
                    <p className='text-sm font-medium text-gray-500'>Current</p>
                  </div>

                  <p className='text-center text-gray-400'>-</p>

                  <div className='whitespace-nowrap text-center'>
                    <p className='text-xl'>
                      {usage && usageValidated
                        ? FormatAmountWithUnit(
                            Number(usage).toFixed(2),
                            chemical.unit
                          )
                        : `-- ${chemical.unit}`}
                    </p>
                    <p className='text-sm font-medium text-gray-500'>Usage</p>
                  </div>

                  <p className='text-center text-gray-400'>=</p>

                  <div className='whitespace-nowrap text-center'>
                    <p className='text-xl'>
                      {remainingAmount >= 0 && usageValidated
                        ? FormatAmountWithUnit(
                            Number(remainingAmount).toFixed(2),
                            chemical.unit
                          )
                        : `-- ${chemical.unit}`}
                    </p>
                    <p className='text-sm font-medium text-gray-500'>
                      Remaining
                    </p>
                  </div>
                </div>

                <label htmlFor='purpose' className='required-input-label'>
                  Purpose
                </label>
                <div className='mb-6 grid grid-cols-2 gap-6 sm:grid-cols-1 sm:gap-4'>
                  <label
                    className='mb-0 flex cursor-pointer text-base font-normal'
                    htmlFor='self'
                  >
                    <input
                      type='radio'
                      name='purpose'
                      id='self'
                      className='rounded-full'
                      checked={ownUse}
                      onChange={() => setOwnUse(true)}
                    />
                    <div className='pl-3'>
                      <p className='font-medium leading-4'>For Own Use</p>
                      <p className='text-sm text-gray-400'>
                        Chemical is used by you
                      </p>
                    </div>
                  </label>

                  <label
                    className='mb-0 flex cursor-pointer text-base font-normal'
                    htmlFor='others'
                  >
                    <input
                      type='radio'
                      name='purpose'
                      id='others'
                      className='rounded-full'
                      checked={!ownUse}
                      onChange={() => setOwnUse(false)}
                    />
                    <div className='pl-3'>
                      <p className='font-medium leading-4'>For Others</p>
                      <p className='text-sm text-gray-400'>
                        Chemical is used by others
                      </p>
                    </div>
                  </label>
                </div>

                <label htmlFor='usage' className='required-input-label'>
                  Usage <span className='text-xs'>(Amount used)</span>
                </label>
                <NumberWithUnitField
                  id='usage'
                  placeholder='Enter chemical usage'
                  required={true}
                  value={usage}
                  setValue={setUsage}
                  validated={usageValidated}
                  setValidated={setUsageValidated}
                  unit={chemical.unit}
                  maxValue={chemical.amount}
                  usage={true}
                />

                {!ownUse && (
                  <div className='mt-6'>
                    <label htmlFor='remark' className='required-input-label'>
                      Remark
                    </label>
                    <input
                      className='w-full'
                      type='text'
                      name='remark'
                      id='remark'
                      placeholder='For whom and which lab?'
                      required
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                    <p className='mt-2 text-xs text-gray-400'>
                      Example: Borrow to Si Sheng at Lab 1.
                    </p>
                  </div>
                )}

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
                    disabled={!allowed}
                  >
                    Record
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

export default ChemicalUsageModal
