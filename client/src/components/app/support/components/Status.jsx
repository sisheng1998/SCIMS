import React from 'react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import TICKET_STATUS from '../../../../config/ticket_status'
import { DateTime, FromNow } from '../../../utils/FormatDate'

const Status = ({ status, createdAt, lastUpdated }) => {
  let classes
  let text
  let time

  if (status === TICKET_STATUS.resolved) {
    classes = 'bg-green-50 text-green-600'
    text = 'This ticket was resolved '
    time = lastUpdated
  } else if (status === TICKET_STATUS.open) {
    classes = 'bg-blue-50 text-blue-600'
    text = 'This ticket was opened '
    time = createdAt
  } else {
    // In Progress
    classes = 'bg-yellow-50 text-yellow-600'
    text = 'This ticket is in progress. It was updated '
    time = lastUpdated
  }

  return (
    <div
      className={`mt-4 mb-6 flex items-start space-x-2 rounded-lg p-3 ${classes}`}
    >
      <InformationCircleIcon className='h-5 w-5 shrink-0' />
      <p className='text-sm font-medium'>
        {text}
        <span className='tooltip' data-tooltip={DateTime(time)}>
          {FromNow(time)}
        </span>
        .
      </p>
    </div>
  )
}

export default Status
