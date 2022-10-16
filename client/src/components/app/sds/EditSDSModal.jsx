import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import PDFDropZone from '../components/PDFDropZone'
import RenderPDF from '../components/RenderPDF'
import {
  CLASSIFICATION_LIST,
  COC_LIST,
} from '../../../config/safety_security_list'
import SafetySecurityField from '../../validations/SafetySecurityField'
import FormatDate from '../../utils/FormatDate'
import NameField from '../../validations/NameField'

const EditSDSModal = ({ CAS, openModal, setOpenModal, setEditSDSSuccess }) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [chemicalName, setChemicalName] = useState(CAS.chemicalName)
  const [chemicalNameValidated, setChemicalNameValidated] = useState(false)

  const [SDS, setSDS] = useState(CAS.SDS)
  const [classifications, setClassifications] = useState(CAS.classifications)
  const [COCs, setCOCs] = useState(CAS.COCs)

  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [extractionResult, setExtractionResult] = useState('')
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(
      SDS !== '' &&
        chemicalNameValidated &&
        (SDS !== CAS.SDS ||
          chemicalName !== CAS.chemicalName ||
          [...classifications].sort().toString() !==
            [...CAS.classifications].sort().toString() ||
          [...COCs].sort().toString() !== [...CAS.COCs].sort().toString())
    )
  }, [CAS, SDS, classifications, COCs, chemicalName, chemicalNameValidated])

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append(
        'chemicalInfo',
        JSON.stringify({
          CASNo: CAS.CASNo,
          chemicalName,
          classifications,
          COCs,
        })
      )
      SDS !== CAS.SDS && formData.append('SDS', SDS)

      await axiosPrivate.post('/api/private/sds', formData)

      setSuccess(true)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }
  }

  const closeHandler = () => {
    setErrorMessage('')
    setSDS('')
    setClassifications([])
    setCOCs([])

    if (success) {
      setSuccess(false)
      setEditSDSSuccess(true)
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
            success ? 'max-w-sm text-center' : 'max-w-3xl'
          }`}
        >
          {success ? (
            <>
              <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
              <h2 className='mt-6 mb-2 text-green-600'>Info Updated!</h2>
              <p>The information have been updated.</p>
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
                <h4>Edit SDS Information</h4>
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
                <label htmlFor='CAS'>CAS No.</label>
                <input
                  className='w-full'
                  type='text'
                  name='CAS'
                  id='CAS'
                  readOnly
                  value={CAS.CASNo}
                />
                <p className='mt-2 mb-6 text-xs text-gray-400'>
                  CAS Number cannot be changed.
                </p>

                <label htmlFor='name' className='required-input-label'>
                  Name of Chemical
                </label>
                <NameField
                  id='chemicalName'
                  placeholder='Enter chemical name'
                  required={true}
                  value={chemicalName}
                  setValue={setChemicalName}
                  validated={chemicalNameValidated}
                  setValidated={setChemicalNameValidated}
                  withNumber={true}
                  showValidated={false}
                />

                {!SDS ? (
                  <>
                    <label htmlFor='SDS' className='required-input-label'>
                      Safety Data Sheet (SDS)
                    </label>
                    <PDFDropZone
                      setPDF={setSDS}
                      classifications={classifications}
                      setClassifications={setClassifications}
                      setExtractionResult={setExtractionResult}
                      setErrorMessage={setErrorMessage}
                    />
                    <p className='mt-2 text-xs text-gray-400'>
                      Only PDF is supported. Max file size: 10 MB.
                    </p>
                  </>
                ) : (
                  <>
                    <div className='flex items-baseline justify-between'>
                      <label
                        htmlFor='SDS'
                        className={
                          SDS.toString().toLowerCase().endsWith('.pdf')
                            ? ''
                            : 'required-input-label'
                        }
                      >
                        Safety Data Sheet (SDS)
                      </label>

                      {(SDS.toString().toLowerCase().endsWith('.pdf') ||
                        SDS === 'No SDS') && (
                        <span
                          onClick={() => setSDS('')}
                          className='mb-2 cursor-pointer text-xs font-medium text-indigo-600 transition hover:text-indigo-700'
                        >
                          {SDS === 'No SDS' ? 'Upload SDS' : 'Upload New SDS'}
                        </span>
                      )}
                    </div>
                    <RenderPDF
                      PDF={SDS}
                      setPDF={setSDS}
                      extractionResult={extractionResult}
                    />
                  </>
                )}

                <label htmlFor='classification' className='mt-6'>
                  GHS Classifications
                </label>
                <SafetySecurityField
                  lists={CLASSIFICATION_LIST}
                  value={classifications}
                  setValue={setClassifications}
                />

                <label htmlFor='coc' className='mt-6'>
                  Chemical of Concerns
                </label>
                <SafetySecurityField
                  lists={COC_LIST}
                  value={COCs}
                  setValue={setCOCs}
                  isCOC={true}
                />

                <div className='mb-9 mt-6 flex items-center justify-between space-x-6 text-sm text-gray-500'>
                  <p>
                    Added At:{' '}
                    <span className='font-semibold'>
                      {FormatDate(CAS.createdAt)}
                    </span>
                  </p>
                  <p>
                    Last Updated:{' '}
                    <span className='font-semibold'>
                      {FormatDate(CAS.lastUpdated)}
                    </span>
                  </p>
                </div>

                <div className='flex items-center justify-end'>
                  <span
                    onClick={closeHandler}
                    className='mr-6 cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
                  >
                    Cancel
                  </span>
                  <button className='w-40' type='submit' disabled={!allowed}>
                    Update
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

export default EditSDSModal
