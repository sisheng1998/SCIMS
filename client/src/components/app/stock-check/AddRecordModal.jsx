import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { CheckIcon, XIcon, ExclamationIcon } from '@heroicons/react/outline'
// import NumberWithUnitField from '../../validations/NumberWithUnitField'
import useAuth from '../../../hooks/useAuth'
import FormatAmountWithUnit from '../../utils/FormatAmountWithUnit'

const AddRecordModal = ({
  scannedChemicalId,
  setScannedChemicalId,
  chemicals,
  setChemicals,
}) => {
  const { auth } = useAuth()
  const storageName = auth.currentLabId + '_chemicals'
  const divRef = useRef(null)

  const [openModal, setOpenModal] = useState(true)

  const [chemical, setChemical] = useState('')
  // const [amount, setAmount] = useState('')
  // const [amountValidated, setAmountValidated] = useState(false)

  const [success, setSuccess] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [disposed, setDisposed] = useState(false)

  useEffect(() => {
    if (scannedChemicalId.length !== 12 && scannedChemicalId.length !== 24) {
      setInvalid(true)
      return
    }

    const recorded = chemicals.some(
      (chemical) => chemical.chemicalId === scannedChemicalId
    )
    if (recorded) {
      setRecorded(true)
      return
    }

    const disposed = auth.stockCheck.disposedChemicals.some(
      (chemical) => chemical.chemicalId === scannedChemicalId
    )
    if (disposed) {
      setDisposed(true)
      return
    }

    const foundChemical = auth.stockCheck.chemicals.find(
      (chemical) => chemical.chemicalId === scannedChemicalId
    )
    if (!foundChemical) {
      setNotFound(true)
      return
    } else {
      setChemical(foundChemical)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()

    const updatedRecords = [
      ...chemicals,
      {
        chemicalId: chemical.chemicalId,
        CASNo: chemical.CASNo,
        name: chemical.name,
        location: chemical.location,
        // amount: Number(amount),
        amount: chemical.amountInDB,
        unit: chemical.unit,
      },
    ]

    setChemicals(updatedRecords)
    localStorage.setItem(storageName, JSON.stringify(updatedRecords))

    setSuccess(true)
  }

  const closeHandler = () => {
    setScannedChemicalId('')
    // setAmount('')

    if (success) {
      setSuccess(false)
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
            success || notFound || invalid || recorded || disposed
              ? 'max-w-sm text-center'
              : 'max-w-xl'
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>Record Added!</h2>
              <p>The record has been added.</p>
              <button
                className='button button-solid mt-6 w-32 justify-center'
                onClick={closeHandler}
              >
                Okay
              </button>
            </>
          ) : (
            <>
              {invalid && (
                <>
                  <XIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />
                  <h2 className='mt-6 mb-2 text-red-600'>Invalid QR Code</h2>
                  <p>The QR code is invalid.</p>
                  <button
                    className='button button-solid mt-6 w-32 justify-center'
                    onClick={closeHandler}
                  >
                    Okay
                  </button>
                </>
              )}

              {recorded && (
                <>
                  <ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
                  <h2 className='mt-6 mb-2 text-yellow-600'>
                    Recorded Chemical
                  </h2>
                  <p>The chemical is already recorded.</p>
                  <button
                    className='button button-solid mt-6 w-32 justify-center'
                    onClick={closeHandler}
                  >
                    Okay
                  </button>
                </>
              )}

              {notFound && (
                <>
                  <ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
                  <h2 className='mt-6 mb-2 text-yellow-600'>
                    Chemical Not Found
                  </h2>
                  <p>The chemical does not exist in this lab.</p>
                  <button
                    className='button button-solid mt-6 w-32 justify-center'
                    onClick={closeHandler}
                  >
                    Okay
                  </button>
                </>
              )}

              {disposed && (
                <>
                  <ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />
                  <h2 className='mt-6 mb-2 text-red-600'>Disposed Chemical</h2>
                  <p>The chemical is already disposed.</p>
                  <button
                    className='button button-solid mt-6 w-32 justify-center'
                    onClick={closeHandler}
                  >
                    Okay
                  </button>
                </>
              )}

              {chemical && (
                <>
                  <div className='mb-4 flex justify-between border-b border-gray-200 pb-3'>
                    <h4>Add Record</h4>
                    <XIcon
                      className='h-5 w-5 cursor-pointer hover:text-indigo-600'
                      onClick={closeHandler}
                    />
                  </div>

                  <form
                    onSubmit={submitHandler}
                    spellCheck='false'
                    autoComplete='off'
                  >
                    <label htmlFor='chemical' className='mb-1'>
                      Chemical Info
                    </label>
                    <div className='mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                      <label htmlFor='CAS' className='mb-0.5 text-gray-400'>
                        CAS No.
                      </label>
                      <p className='mb-2 font-medium'>{chemical.CASNo}</p>

                      <label htmlFor='name' className='mb-0.5 text-gray-400'>
                        Name of Chemical
                      </label>
                      <p className='mb-2 font-medium'>{chemical.name}</p>

                      <label
                        htmlFor='location'
                        className='mb-0.5 text-gray-400'
                      >
                        Location
                      </label>
                      <p className='mb-2 font-medium'>{chemical.location}</p>

                      <label htmlFor='amount' className='mb-0.5 text-gray-400'>
                        Amount
                      </label>
                      <p className='font-medium'>
                        {FormatAmountWithUnit(
                          chemical.amountInDB,
                          chemical.unit
                        )}
                      </p>
                    </div>

                    {/* <label htmlFor='amount' className='required-input-label'>
                      Amount of Chemical
                    </label>
                    <NumberWithUnitField
                      id='amount'
                      placeholder='Enter amount'
                      required={true}
                      value={amount}
                      setValue={setAmount}
                      validated={amountValidated}
                      setValidated={setAmountValidated}
                      unit={chemical.unit}
                    /> */}

                    <div className='mt-9 flex items-center justify-end'>
                      <span
                        onClick={closeHandler}
                        className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                      >
                        Cancel
                      </span>
                      <button
                        className='ml-6 w-32'
                        type='submit'
                        // disabled={!amountValidated}
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default AddRecordModal
