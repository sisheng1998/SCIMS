import React, { useEffect, useRef, useState } from 'react'
import axiosPrivate from '../../../../api/axiosPrivate'
import LoadingButtonText from '../../components/LoadingButtonText'
import SuccessMessageModal from './SuccessMessageModal'

const KIVButton = ({
  chemical,
  lab,
  setErrorMessage,
  setEditSuccess,
  isButton,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const isMounted = useRef(true)
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const isStatusKIV = chemical.status === 'Keep In View'

  const onClick = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      await axiosPrivate.post(
        isStatusKIV
          ? '/api/private/chemical/remove-from-kiv'
          : '/api/private/chemical/mark-as-kiv',
        {
          chemicalId: chemical._id,
          labId: lab._id,
        }
      )
      if (isMounted.current) {
        setOpenModal(true)
        setSuccess(true)
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }

    setIsLoading(false)
  }

  return (
    <>
      {isButton ? (
        <button
          className='button button-outline justify-center px-4 py-2'
          onClick={onClick}
        >
          {isLoading ? (
            <LoadingButtonText />
          ) : !isStatusKIV ? (
            'Mark as KIV'
          ) : (
            'Remove from KIV'
          )}
        </button>
      ) : (
        <span
          onClick={onClick}
          className={`text-sm font-medium transition ${
            isLoading
              ? 'inline-flex cursor-not-allowed opacity-50'
              : 'cursor-pointer text-indigo-600 hover:text-indigo-700'
          }`}
        >
          {isLoading ? (
            <LoadingButtonText />
          ) : !isStatusKIV ? (
            'Mark as KIV'
          ) : (
            'Remove from KIV'
          )}
        </span>
      )}

      {success && openModal && (
        <SuccessMessageModal
          type={!isStatusKIV ? 'Mark as KIV' : 'Remove from KIV'}
          openModal={openModal}
          setOpenModal={setOpenModal}
          setEditSuccess={setEditSuccess}
        />
      )}
    </>
  )
}

export default KIVButton
