import React, { Fragment } from 'react'
import { Menu } from '@headlessui/react'
import dayjs from 'dayjs'
import { DotsHorizontalIcon, LogoutIcon } from '@heroicons/react/outline'

import GetLetterPicture from '../../../utils/GetLetterPicture'
import { FromNow, DateTime } from '../../../utils/FormatDate'

import useAuth from '../../../../hooks/useAuth'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ROLES_LIST from '../../../../config/roles_list'

const MessageCard = ({ message, viewImage, attachmentPath }) => {
  const { auth } = useAuth()

  return (
    <div className='flex items-start space-x-3'>
      <Avatar user={message.user} viewImage={viewImage} />

      <div className='flex-1 space-y-2 rounded-lg bg-gray-50 p-4'>
        <div className='flex items-start justify-between space-x-2'>
          <Name user={message.user} />

          {(auth.id === message.user._id ||
            auth.currentRole === ROLES_LIST.admin) && (
            <MessageMenu message={message} />
          )}
        </div>

        <Message message={message.message} />

        {message.attachments.length !== 0 && (
          <Attachments
            attachments={message.attachments}
            attachmentPath={attachmentPath}
          />
        )}

        <Time createdAt={message.createdAt} lastUpdated={message.lastUpdated} />
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
      className='h-12 w-12 cursor-pointer rounded-full object-cover'
      height='64'
      width='64'
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

const MessageMenu = ({ message }) => {
  return (
    <Menu as='div' className='relative flex items-center'>
      <Menu.Button className='text-gray-400 outline-gray-300 transition hover:text-indigo-600'>
        <DotsHorizontalIcon className='inline-block h-4 w-4 stroke-2 ' />
      </Menu.Button>

      <Menu.Items className='absolute right-0 top-full mt-2 w-auto min-w-[200px] rounded-lg bg-white py-2 shadow-md outline-gray-300 ring-1 ring-gray-300'>
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => {}}
              className={`group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 hover:bg-indigo-50 ${
                active ? 'text-indigo-600' : ''
              }`}
            >
              <LogoutIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
              Edit
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
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
