import React, { useState } from 'react'
import { ArrowLeftIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'

import GetLetterPicture from '../../../utils/GetLetterPicture'
import FormatDate, { FromNow } from '../../../utils/FormatDate'
import GetRoleName from '../../../utils/GetRoleName'

import useAuth from '../../../../hooks/useAuth'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ROLES_LIST from '../../../../config/roles_list'
import TICKET_STATUS from '../../../../config/ticket_status'

import LoadingButtonText from '../../components/LoadingButtonText'

const Sidebar = ({ ticket, setRefresh, viewImage }) => {
  const { auth } = useAuth()
  const navigate = useNavigate()

  const isAdmin = auth.currentRole === ROLES_LIST.admin

  const TAB_LABELS = ['Ticket', 'User']
  ticket.deviceInfo && TAB_LABELS.push('Device')

  const [tab, setTab] = useState(TAB_LABELS[0])

  return (
    <>
      <p
        onClick={() => navigate('/support')}
        className='inline-flex cursor-pointer items-center font-medium text-indigo-600 transition hover:text-indigo-700'
      >
        <ArrowLeftIcon className='mr-1 h-4 w-4' />
        Back to Support
      </p>

      <div className='space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        {isAdmin ? (
          <Tab TAB_LABELS={TAB_LABELS} tab={tab} setTab={setTab} />
        ) : (
          <Title />
        )}

        {tab === TAB_LABELS[1] ? (
          <>
            <OpenedBy user={ticket.user} viewImage={viewImage} />
            <Lab name={ticket.labName} />
            <Role role={ticket.role} />
          </>
        ) : tab === TAB_LABELS[2] ? (
          <>
            <DeviceInfo type='Operating System' info={ticket.deviceInfo} />
            <DeviceInfo type='Browser' info={ticket.deviceInfo} />
            <DeviceInfo type='Resolution' info={ticket.deviceInfo} />
          </>
        ) : (
          <>
            <TicketReference id={ticket._id} />
            <Status status={ticket.status} />
            <Time type='Opened' time={ticket.createdAt} />
            <Time type='Last Updated' time={ticket.lastUpdated} />
          </>
        )}

        <TicketAction ticket={ticket} setRefresh={setRefresh} />
      </div>
    </>
  )
}

const Tab = ({ TAB_LABELS, tab, setTab }) => (
  <div className='border-b border-gray-200 font-medium text-gray-500'>
    <ul className='-mb-px flex flex-wrap space-x-6'>
      {TAB_LABELS.map((label, index) => (
        <li
          key={index}
          className={`inline-block border-b-2 pb-2 ${
            tab === label
              ? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
              : 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-700'
          }`}
          onClick={() => setTab(label)}
        >
          {label}
        </li>
      ))}
    </ul>
  </div>
)

const Title = () => (
  <div>
    <h5 className='mb-2.5'>Ticket Details</h5>
    <hr className='-mt-px border-gray-200' />
  </div>
)

const TicketReference = ({ id }) => (
  <div>
    <label className='mb-0.5 text-gray-500'>Ticket Reference</label>
    <p className='font-medium'>#{id}</p>
  </div>
)

const Status = ({ status }) => {
  let classes

  if (status === TICKET_STATUS.resolved) {
    classes = 'bg-green-100 text-green-600'
  } else if (status === TICKET_STATUS.open) {
    classes = 'bg-blue-100 text-blue-600'
  } else {
    // In Progress
    classes = 'bg-yellow-100 text-yellow-600'
  }

  return (
    <div>
      <label className='mb-1 text-gray-500'>Status</label>
      <p
        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${classes}`}
      >
        {status}
      </p>
    </div>
  )
}

const Time = ({ type, time }) => (
  <div>
    <label className='mb-0.5 text-gray-500'>
      {type} - <span className='italic text-gray-400'>{FromNow(time)}</span>
    </label>
    <p className='font-medium'>{FormatDate(time)}</p>
  </div>
)

const OpenedBy = ({ user, viewImage }) => (
  <div>
    <label className='mb-1 text-gray-500'>Opened By</label>
    <User user={user} viewImage={viewImage} />
  </div>
)

const User = ({ user, viewImage }) => {
  const { auth } = useAuth()

  const imageSrc = user.avatar
    ? auth.avatarPath + user.avatar
    : GetLetterPicture(user.name)

  return (
    <div className='flex w-max items-center space-x-3'>
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

      <div>
        <p className='font-medium leading-5'>
          {user.name}
          {auth.email.toLowerCase() === user.email.toLowerCase() && (
            <span className='ml-1.5 text-sm text-indigo-600'>(You)</span>
          )}
        </p>
        <p className='text-sm leading-4 text-gray-400'>{user.email}</p>
      </div>
    </div>
  )
}

const Lab = ({ name }) => (
  <div>
    <label className='mb-0.5 text-gray-500'>Lab</label>
    <p className='font-medium'>{name}</p>
  </div>
)

const Role = ({ role }) => (
  <div>
    <label className='mb-0.5 text-gray-500'>Role</label>
    <p className='font-medium capitalize'>{GetRoleName(role)}</p>
  </div>
)

const DeviceInfo = ({ type, info }) => {
  let result = '-'

  if (type === 'Operating System') {
    if (info.hasOwnProperty('os') && info.os.hasOwnProperty('name')) {
      result = info.os.name

      if (info.os.hasOwnProperty('version')) {
        result += ` ${info.os.version}`
      }
    }
  } else if (type === 'Browser') {
    if (info.hasOwnProperty('browser') && info.browser.hasOwnProperty('name')) {
      result = info.browser.name

      if (info.browser.hasOwnProperty('version')) {
        result += ` ${info.browser.version}`
      }
    }
  } else if (type === 'Resolution') {
    if (
      info.hasOwnProperty('resolution') &&
      info.resolution.hasOwnProperty('width') &&
      info.resolution.hasOwnProperty('height')
    ) {
      result = `${info.resolution.width} x ${info.resolution.height}px`
    }
  }

  return (
    <div>
      <label className='mb-0.5 text-gray-500'>{type}</label>
      <p className='font-medium'>{result}</p>
    </div>
  )
}

const TicketAction = ({ ticket, setRefresh }) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const isAdmin = auth.currentRole === ROLES_LIST.admin

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateStatus = async (status) => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      await axiosPrivate.patch(`/api/support/ticket/${ticket._id}`, {
        status,
      })
      setRefresh(true)
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
    <div>
      <label className='mb-1.5 text-gray-500'>Ticket Action</label>
      {ticket.status !== 'Resolved' ? (
        <div className='space-y-2'>
          {isAdmin && ticket.status !== TICKET_STATUS.inProgress ? (
            <button
              onClick={() => updateStatus(TICKET_STATUS.inProgress)}
              className='button-yellow-outline flex h-10 w-full items-center justify-center rounded-lg lg:w-auto'
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingButtonText />
              ) : (
                `Mark as ${TICKET_STATUS.inProgress}`
              )}
            </button>
          ) : (
            <button
              onClick={() => updateStatus(TICKET_STATUS.resolved)}
              className='button-green-outline flex h-10 w-full items-center justify-center rounded-lg lg:w-auto'
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingButtonText />
              ) : (
                `Mark as ${TICKET_STATUS.resolved}`
              )}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => updateStatus(TICKET_STATUS.open)}
          className='button-blue-outline flex h-10 w-full items-center justify-center rounded-lg lg:w-auto'
          disabled={isLoading}
        >
          {isLoading ? <LoadingButtonText /> : 'Re-open Ticket'}
        </button>
      )}

      {errorMessage && (
        <p className='mt-3 flex items-center text-sm font-medium text-red-600'>
          <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Sidebar
