import React, { useState, useEffect } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import SubjectField from './components/SubjectField'
import MessageField from './components/MessageField'
import AttachmentField from './components/AttachmentField'
import SuccessMessageModal from './components/SuccessMessageModal'

const NewTicket = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const [ticketId, setTicketId] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    setErrorMessage('')
  }, [subject, message])

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      const formData = new FormData()

      formData.append(
        'ticketInfo',
        JSON.stringify({
          labId: auth.currentLabId,
          role: auth.currentRole,
          subject,
          message,
        })
      )

      if (attachments.length !== 0) {
        for (let i = 0; i < attachments.length; i++) {
          formData.append('attachments', attachments[i])
        }
      }

      const { data } = await axiosPrivate.post(
        '/api/support/new-ticket',
        formData
      )

      setTicketId(data.ticketId)
      setIsLoading(false)
      setOpenModal(true)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }

      setIsLoading(false)
    }
  }

  return (
    <>
      <Title
        title='Open New Support Ticket'
        hasButton={false}
        hasRefreshButton={false}
      />

      <form onSubmit={submitHandler} spellCheck='false' autoComplete='off'>
        <div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
          <div className='w-full max-w-md 2xl:max-w-xs'>
            <h4>Ticket Details</h4>
            <p className='text-sm text-gray-500'>
              Issue that you faced or request for a feature.
            </p>
          </div>

          <div className='w-full max-w-4xl space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
            <SubjectField subject={subject} setSubject={setSubject} />

            <MessageField
              placeholder='Describe it as detailed as you can'
              message={message}
              setMessage={setMessage}
            />

            <AttachmentField
              attachments={attachments}
              setAttachments={setAttachments}
            />

            <div className='!mt-9 flex items-center justify-end space-x-6'>
              {errorMessage && (
                <p className='mr-auto flex items-center text-sm font-medium text-red-600'>
                  <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
                  {errorMessage}
                </p>
              )}
              <span
                onClick={() => navigate('/support')}
                className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
              >
                Cancel
              </span>

              <button
                className='ml-6 flex w-40 items-center justify-center'
                type='submit'
                disabled={subject === '' || message === '' || isLoading}
              >
                {isLoading ? (
                  <>
                    Loading
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                      className='ml-2 h-4 w-4 animate-spin stroke-2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                        className='origin-center -scale-x-100'
                      ></path>
                    </svg>
                  </>
                ) : (
                  'Open Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {openModal && ticketId && (
        <SuccessMessageModal
          ticketId={ticketId}
          type='Open'
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  )
}

export default NewTicket
