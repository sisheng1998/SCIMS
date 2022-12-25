import React, { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import SubjectField from './components/SubjectField'
import MessageField from './components/MessageField'
import AttachmentField from './components/AttachmentField'

const NewTicket = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])

  const [errorMessage, setErrorMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    console.log(subject)
    console.log(message)
    console.log(attachments)

    try {
      // const formData = new FormData()
      // formData.append('chemicalInfo', JSON.stringify(chemicalData))
      // !chemicalData.SDSLink && formData.append('SDS', SDS)

      // const { data } = await axiosPrivate.post(
      //   '/api/private/chemical',
      //   formData
      // )
      // setChemicalId(data.chemicalId)
      setOpenModal(true)
    } catch (error) {
      if (error.response?.status === 500) {
        setErrorMessage('Server not responding. Please try again later.')
      } else {
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    }
  }

  return (
    <>
      <Title
        title='Open New Ticket'
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
                className='ml-6 w-40'
                type='submit'
                disabled={subject === '' || message === ''}
              >
                Open Ticket
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default NewTicket
