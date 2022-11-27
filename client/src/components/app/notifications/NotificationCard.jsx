import React from 'react'
import { BeakerIcon, CalendarIcon, ClockIcon } from '@heroicons/react/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: '1 day',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  },
})

const NotificationCard = ({ notification }) => {
  let title
  let description

  switch (notification.type) {
    case 'Expired':
      title = 'Chemical Expired'
      description = `${notification.chemical.name} expired.`
      break
    case 'Expiring Soon':
      title = 'Chemical Expiring Soon'
      description = `${notification.chemical.name} is expiring soon.`
      break
    case 'Low Amount':
      title = 'Chemical Low Amount'
      description = `${notification.chemical.name} has reached low amount.`
      break
    case 'Request Approval':
      title = 'User Request Approval'
      description = `${notification.requestor.name} requested access to your lab.`
      break
    case 'Request Approved':
      title = 'Lab Application Approved'
      description = `Your request for access Lab ${notification.lab.labName} have been approved.`
      break
    case 'Request Declined':
      title = 'Lab Application Declined'
      description = `Your request for access Lab ${notification.lab.labName} have been declined.`
      break
    case 'Lab Owner Role':
      title = 'User Role Changed'
      description = `You are now the Lab Owner of Lab ${notification.lab.labName}.`
      break
    case 'Postgraduate Role':
      title = 'User Role Changed'
      description = 'Your role have been changed to Postgraduate.'
      break
    case 'Undergraduate Role':
      title = 'User Role Changed'
      description = 'Your role have been changed to Undergraduate.'
      break
    case 'Guest Role':
      title = 'User Role Changed'
      description = 'Your role have been changed to Guest.'
      break
    case 'User Role Active':
      title = 'User Status Changed'
      description = `You are now able to access Lab ${notification.lab.labName}.`
      break
    case 'User Role Deactivated':
      title = 'User Status Changed'
      description = `You are temporarily unable to access Lab ${notification.lab.labName}.`
      break
    case 'New Lab Created':
      title = 'New Lab Created'
      description = 'A new lab have been created for you.'
      break
    case 'Removed From Lab':
      title = 'Lost Access To The Lab'
      description = `You have been removed from Lab ${notification.lab.labName}.`
      break
    default:
      title = notification.type
      description = '-'
  }

  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <p className='flex items-baseline justify-between text-lg font-medium'>
        {title}
        <span className='ml-2 shrink-0 text-sm font-normal text-gray-400 lg:text-xs'>
          {dayjs(notification.date).fromNow()}
        </span>
      </p>

      <p className='text-gray-500 lg:text-sm'>{description}</p>

      <div className='mt-2 flex flex-wrap items-center lg:text-sm'>
        <p className='mt-2 mr-6 flex items-center lg:mr-4'>
          <BeakerIcon className='mr-2 inline-block h-5 w-5 stroke-2 text-indigo-600 lg:mr-1.5 lg:h-4 lg:w-4' />
          Lab {notification.lab.labName}
        </p>

        <p className='mt-2 mr-6 flex items-center lg:mr-4'>
          <CalendarIcon className='mr-2 inline-block h-5 w-5 stroke-2 text-indigo-600 lg:mr-1.5 lg:h-4 lg:w-4' />
          {dayjs(notification.date).format('DD/MM/YYYY')}
        </p>

        <p className='mt-2 flex items-center'>
          <ClockIcon className='mr-2 inline-block h-5 w-5 stroke-2 text-indigo-600 lg:mr-1.5 lg:h-4 lg:w-4' />
          {dayjs(notification.date).format('h:mm A')}
        </p>
      </div>
    </div>
  )
}

export default NotificationCard
