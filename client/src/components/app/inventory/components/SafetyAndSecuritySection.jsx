import React, { useState, useEffect } from 'react'
import {
  CLASSIFICATION_LIST,
  CLASSIFICATION_ICON,
  COC_LIST,
} from '../../../../config/safety_security_list'
import SafetySecurityField from '../../../validations/SafetySecurityField'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import SDSsField from '../../components/SDSsField'

const SafetyAndSecuritySection = ({
  enSDS,
  setEnSDS,
  bmSDS,
  setBmSDS,
  classifications,
  setClassifications,
  COCs,
  setCOCs,
  setChemicalData,
  validated,
  setValidated,
}) => {
  const isViewOnly =
    enSDS.toString().toLowerCase().endsWith('.pdf') ||
    enSDS === 'No SDS' ||
    bmSDS.toString().toLowerCase().endsWith('.pdf') ||
    bmSDS === 'No SDS'

  const [errorMessage, setErrorMessage] = useState('')
  const [enExtractionResult, setEnExtractionResult] = useState('')
  const [bmExtractionResult, setBmExtractionResult] = useState('')

  useEffect(() => {
    if (
      enSDS.toString().toLowerCase().endsWith('.pdf') ||
      enSDS === 'No SDS' ||
      bmSDS.toString().toLowerCase().endsWith('.pdf') ||
      bmSDS === 'No SDS'
    ) {
      setValidated &&
        setValidated((prev) => ({
          ...prev,
          enSDSValidated: true,
          bmSDSValidated: true,
        }))

      return
    }

    setChemicalData((prev) => ({
      ...prev,
      classifications,
      COCs,
    }))

    setValidated((prev) => ({
      ...prev,
      enSDSValidated: enSDS ? true : false,
      bmSDSValidated: bmSDS ? true : false,
    }))
  }, [classifications, COCs, setChemicalData, setValidated, enSDS, bmSDS])

  return isViewOnly ? (
    <>
      <SDSsField enSDS={enSDS} bmSDS={bmSDS} viewOnly={true} />

      <div className='mb-4 mt-6'>
        <label htmlFor='classification'>GHS Classifications</label>
        {classifications.length !== 0
          ? CLASSIFICATION_LIST.map(
              (classification, index) =>
                classifications.includes(classification) && (
                  <span
                    key={index}
                    className='tooltip mb-2 mr-2 inline-flex'
                    data-tooltip={classification}
                  >
                    <img
                      className='h-16 w-16 flex-1'
                      src={CLASSIFICATION_ICON[index]}
                      alt='GHS Classifications'
                    />
                  </span>
                )
            )
          : '-'}
      </div>

      <div>
        <label htmlFor='coc'>Chemical of Concerns</label>
        {COCs.length !== 0
          ? COC_LIST.filter((security) => COCs.includes(security)).map(
              (security, index) => (
                <span
                  key={index}
                  className='mb-2 mr-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600'
                >
                  {security}
                </span>
              )
            )
          : '-'}
      </div>
    </>
  ) : (
    <div
      className={`transition ${
        validated.CASNoValidated ? '' : 'pointer-events-none opacity-50'
      }`}
    >
      {errorMessage && (
        <p className='mb-6 flex items-center text-sm font-medium text-red-600'>
          <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
          {errorMessage}
        </p>
      )}

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
  )
}

export default SafetyAndSecuritySection
