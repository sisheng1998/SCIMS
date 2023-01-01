import React, { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import MessageField from './MessageField'
import AttachmentField from './AttachmentField'
import LoadingButtonText from '../../components/LoadingButtonText'

const NewMessage = ({ ticketId, setRefresh }) => {
  const axiosPrivate = useAxiosPrivate()

  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    try {
      const formData = new FormData()

      formData.append(
        'message',
        JSON.stringify({
          message,
        })
      )

      if (attachments.length !== 0) {
        for (let i = 0; i < attachments.length; i++) {
          formData.append('attachments', attachments[i])
        }
      }

      await axiosPrivate.post(
        `/api/support/ticket/${ticketId}/new-message`,
        formData
      )

      setIsLoading(false)
      setRefresh(true)
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
    <form onSubmit={submitHandler} spellCheck='false' autoComplete='off'>
      <div className='w-full space-y-6'>
        <MessageField
          placeholder='Enter your message here'
          message={message}
          setMessage={setMessage}
          required={false}
        />

        <AttachmentField
          attachments={attachments}
          setAttachments={setAttachments}
        />

        <div className='!mt-9 flex items-center justify-end space-x-6 lg:flex-col lg:justify-center lg:space-x-0 lg:space-y-4'>
          {errorMessage && (
            <p className='mr-auto flex items-center text-sm font-medium text-red-600 lg:mx-auto'>
              <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
              {errorMessage}
            </p>
          )}

          <button
            className='ml-6 flex w-40 items-center justify-center lg:ml-0 lg:w-full'
            type='submit'
            disabled={(message === '' && attachments.length === 0) || isLoading}
          >
            {isLoading ? <LoadingButtonText /> : 'Send'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default NewMessage
