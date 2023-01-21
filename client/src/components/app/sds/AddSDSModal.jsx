import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import {
  CheckIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import CASField from '../../validations/CASField'
import NameField from '../../validations/NameField'
import {
  CLASSIFICATION_LIST,
  COC_LIST,
} from '../../../config/safety_security_list'
import SafetySecurityField from '../../validations/SafetySecurityField'
import SDSsField from '../components/SDSsField'
import LoadingButtonText from '../components/LoadingButtonText'

const AddSDSModal = ({
  existedSDS,
  openModal,
  setOpenModal,
  setAddSDSSuccess,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [CASNo, setCASNo] = useState('')
  const [CASNoValidated, setCASNoValidated] = useState(false)

  const [chemicalName, setChemicalName] = useState('')
  const [chemicalNameValidated, setChemicalNameValidated] = useState(false)

  const [enSDS, setEnSDS] = useState('')
  const [bmSDS, setBmSDS] = useState('')
  const [classifications, setClassifications] = useState([])
  const [COCs, setCOCs] = useState([])

  const [allowNextStep, setAllowNextStep] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [enExtractionResult, setEnExtractionResult] = useState('')
  const [bmExtractionResult, setBmExtractionResult] = useState('')
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    resetField()

    if (CASNo && CASNoValidated) {
      const existed = existedSDS.some((SDS) => SDS.CASNo === CASNo)

      if (existed) {
        setErrorMessage(
          'A safety data sheet already existed with this CAS number.'
        )
      } else {
        let isMounted = true
        const controller = new AbortController()

        const getCASInfo = async () => {
          try {
            const { data } = await axiosPrivate.put(
              '/api/private/cas',
              {
                CASNo,
              },
              {
                signal: controller.signal,
              }
            )
            if (isMounted) {
              setClassifications(data.data.classifications)
              setCOCs(data.data.COCs)
              setAllowNextStep(true)
            }
          } catch (error) {
            return
          }
        }

        getCASInfo()

        return () => {
          isMounted = false
          controller.abort()
        }
      }
    }
  }, [axiosPrivate, CASNo, CASNoValidated, existedSDS])

  useEffect(() => {
    setAllowed(
      enSDS !== '' && bmSDS !== '' && CASNoValidated && chemicalNameValidated
    )
  }, [enSDS, bmSDS, CASNoValidated, chemicalNameValidated])

  const submitHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append(
        'chemicalInfo',
        JSON.stringify({ CASNo, chemicalName, classifications, COCs })
      )

      formData.append('SDS_EN', enSDS)
      formData.append('SDS_BM', bmSDS)

      await axiosPrivate.post('/api/private/sds/new-sds', formData)
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

  const closeHandler = () => {
    resetField()

    if (success) {
      setSuccess(false)
      setAddSDSSuccess(true)
    }

    setOpenModal(false)
  }

  const resetField = () => {
    setErrorMessage('')
    setEnSDS('')
    setBmSDS('')
    setClassifications([])
    setCOCs([])
    setAllowNextStep(false)
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
              <h2 className='mt-6 mb-2 text-green-600'>New SDS Added!</h2>
              <p>The new safety data sheet have been added.</p>
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
                <h4>Add New Safety Data Sheet</h4>
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
                <label htmlFor='CAS' className='required-input-label'>
                  CAS No.
                </label>
                <CASField
                  value={CASNo}
                  setValue={setCASNo}
                  validated={CASNoValidated}
                  setValidated={setCASNoValidated}
                  showValidated={true}
                />

                <div
                  className={`transition ${
                    allowNextStep ? '' : 'pointer-events-none opacity-50'
                  }`}
                >
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
                    showValidated={true}
                  />

                  <SDSsField
                    enSDS={enSDS}
                    setEnSDS={setEnSDS}
                    enExtractionResult={enExtractionResult}
                    setEnExtractionResult={setEnExtractionResult}
                    bmSDS={bmSDS}
                    setBmSDS={setBmSDS}
                    bmExtractionResult={bmExtractionResult}
                    setBmExtractionResult={setBmExtractionResult}
                    classifications={classifications}
                    setClassifications={setClassifications}
                    setErrorMessage={setErrorMessage}
                  />

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
                </div>

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
                    {isLoading ? <LoadingButtonText /> : 'Add SDS'}
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

export default AddSDSModal
