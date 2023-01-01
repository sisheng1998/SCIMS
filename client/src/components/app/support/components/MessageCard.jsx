import React, { Fragment, useState, useEffect } from 'react'
import { Menu } from '@headlessui/react'
import dayjs from 'dayjs'
import {
  DotsHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'

import GetLetterPicture from '../../../utils/GetLetterPicture'
import { FromNow, DateTime } from '../../../utils/FormatDate'

import useMobile from '../../../../hooks/useMobile'
import useAuth from '../../../../hooks/useAuth'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ROLES_LIST from '../../../../config/roles_list'
import TICKET_STATUS from '../../../../config/ticket_status'

import MessageField from './MessageField'
import LoadingButtonText from '../../components/LoadingButtonText'

const MessageCard = ({
  ticketId,
  status,
  message,
  viewImage,
  attachmentPath,
  setRefresh,
}) => {
  const isMobile = useMobile()

  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <div
      className={`flex items-start space-x-3 transition-opacity ${
        isLoading ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      {!isMobile && <Avatar user={message.user} viewImage={viewImage} />}

      <div className='flex-1 space-y-2 rounded-lg bg-gray-50 p-4'>
        <div className='flex items-start justify-between space-x-2'>
          <Name user={message.user} />

          {!isEdit && status !== TICKET_STATUS.resolved && (
            <MessageMenu
              ticketId={ticketId}
              message={message}
              setIsEdit={setIsEdit}
              setIsLoading={setIsLoading}
              setRefresh={setRefresh}
              setErrorMessage={setErrorMessage}
            />
          )}
        </div>

        {isEdit ? (
          <EditMessage
            ticketId={ticketId}
            messageId={message._id}
            originalMessage={message.message}
            setIsEdit={setIsEdit}
            setRefresh={setRefresh}
            setErrorMessage={setErrorMessage}
          />
        ) : (
          <Message message={message.message} />
        )}

        {message.attachments.length !== 0 && (
          <Attachments
            attachments={message.attachments}
            attachmentPath={attachmentPath}
          />
        )}

        <Time createdAt={message.createdAt} lastUpdated={message.lastUpdated} />

        {errorMessage && (
          <p className='flex items-start text-sm font-medium text-red-600'>
            <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  )
}

const Avatar = ({ user, viewImage }) => {
  const { auth } = useAuth()

  const imageSrc = user.avatar
    ? auth.avatarPath + user.avatar
    : GetLetterPicture(user.name)

  return (
    <img
      onError={(event) => (event.target.src = GetLetterPicture(user.name))}
      src={imageSrc}
      alt='Avatar'
      className='h-10 w-10 cursor-pointer rounded-full object-cover'
      height='40'
      width='40'
      draggable={false}
      onClick={() => viewImage(user.name, imageSrc)}
    />
  )
}

const Name = ({ user }) => {
  const { auth } = useAuth()

  return (
    <p className='font-medium leading-5'>
      {user.name}
      {auth.id === user._id && (
        <span className='ml-1.5 text-sm text-indigo-600'>(You)</span>
      )}
    </p>
  )
}

const MessageMenu = ({
  ticketId,
  message,
  setIsEdit,
  setIsLoading,
  setRefresh,
  setErrorMessage,
}) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [isDelete, setIsDelete] = useState(false)

  const deleteMessage = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      await axiosPrivate.delete(
        `/api/support/ticket/${ticketId}/message/${message._id}`
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

  const FunctionOnClose = ({ open, children }) => {
    useEffect(() => {
      if (!isDelete || open) return
      setIsDelete(false)
    }, [open])

    return <>{children}</>
  }

  return auth.id === message.user._id ||
    auth.currentRole === ROLES_LIST.admin ? (
    <Menu as='div' className='relative flex items-center'>
      {({ open }) => (
        <FunctionOnClose open={open}>
          <Menu.Button className='text-gray-400 outline-gray-300 transition hover:text-indigo-600'>
            <DotsHorizontalIcon className='h-4 w-4 shrink-0 stroke-2' />
          </Menu.Button>

          <Menu.Items className='absolute right-0 top-full min-w-[120px] rounded-lg bg-white py-2 shadow-md outline-gray-300 ring-1 ring-gray-300'>
            <Menu.Item>
              <button
                onClick={() => setIsEdit(true)}
                className='group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 hover:bg-indigo-50 hover:text-indigo-600'
              >
                <PencilIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
                Edit
              </button>
            </Menu.Item>

            {auth.currentRole === ROLES_LIST.admin && (
              <Menu.Item>
                {({ close }) => (
                  <button
                    onClick={async (e) => {
                      if (!isDelete) {
                        e.preventDefault()
                        e.stopPropagation()

                        setIsDelete(true)
                      } else {
                        deleteMessage()
                        close()
                      }
                    }}
                    className='group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 hover:bg-red-50 hover:text-red-600'
                  >
                    <TrashIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-red-600' />
                    {isDelete ? 'Confirm?' : 'Delete'}
                  </button>
                )}
              </Menu.Item>
            )}
          </Menu.Items>
        </FunctionOnClose>
      )}
    </Menu>
  ) : null
}

const EditMessage = ({
  ticketId,
  messageId,
  originalMessage,
  setIsEdit,
  setRefresh,
  setErrorMessage,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const [message, setMessage] = useState(originalMessage)
  const [isLoading, setIsLoading] = useState(false)

  const editMessage = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      await axiosPrivate.patch(
        `/api/support/ticket/${ticketId}/message/${messageId}`,
        { message }
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
    <div>
      <MessageField
        placeholder='Enter your message here'
        message={message}
        setMessage={setMessage}
        required={true}
      />

      <div className='mt-2 mb-4 flex items-center text-sm'>
        <button
          onClick={editMessage}
          className='button button-outline mr-6 flex w-32 items-center justify-center'
          disabled={message === '' || message === originalMessage || isLoading}
        >
          {isLoading ? <LoadingButtonText /> : 'Update'}
        </button>

        <span
          onClick={() => {
            setErrorMessage('')
            setIsEdit(false)
          }}
          className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
        >
          Cancel
        </span>
      </div>
    </div>
  )
}

const Message = ({ message }) => (
  <p className='whitespace-pre-wrap'>{message}</p>
)

const Attachments = ({ attachments, attachmentPath }) => {
  const FormatFileName = (value) => value.substring(value.indexOf('-') + 1)

  return (
    <p className='text-sm'>
      {attachments.map((attachment, index) => (
        <Fragment key={index}>
          {index ? <span>, </span> : ''}

          <a
            href={attachmentPath + attachment}
            download={FormatFileName(attachment)}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
          >
            {FormatFileName(attachment)}
          </a>
        </Fragment>
      ))}
    </p>
  )
}

const Time = ({ createdAt, lastUpdated }) => {
  const isEdited = !dayjs(createdAt).isSame(lastUpdated)

  return (
    <p className='flex items-center text-xs italic text-gray-400'>
      <span className='tooltip' data-tooltip={DateTime(lastUpdated)}>
        {FromNow(lastUpdated)}
      </span>
      {isEdited && <span className='ml-1.5'>- edited</span>}
    </p>
  )
}

export default MessageCard
