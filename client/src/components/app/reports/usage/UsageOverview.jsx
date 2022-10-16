import React from 'react'
import InfoCard from '../InfoCard'
import {
  ClockIcon,
  BeakerIcon,
  UsersIcon,
  ClipboardListIcon,
} from '@heroicons/react/outline'

const UsageOverview = ({ data, dateRanges, chemicals, users }) => {
  return (
    <div className='-mr-4 mb-2 flex flex-wrap'>
      <InfoCard
        icon={
          <ClockIcon className='h-14 w-14 rounded-full bg-purple-50 p-3 text-purple-500' />
        }
        value='Report Period'
        text={
          <>
            {dateRanges.start}
            <span className='mx-1.5 text-xs text-gray-400'>→</span>
            {dateRanges.end}
          </>
        }
      />

      <InfoCard
        icon={
          <BeakerIcon className='h-14 w-14 rounded-full bg-indigo-50 p-3 text-indigo-500' />
        }
        value={chemicals.length}
        text='Involved Chemical'
        haveLetterS={true}
      />

      <InfoCard
        icon={
          <UsersIcon className='h-14 w-14 rounded-full bg-emerald-50 p-3 text-emerald-500' />
        }
        value={users.length}
        text='Involved User'
        haveLetterS={true}
      />

      <InfoCard
        icon={
          <ClipboardListIcon className='h-14 w-14 rounded-full bg-blue-50 p-3 text-blue-500' />
        }
        value={data.length}
        text='Usage Record'
        haveLetterS={true}
      />
    </div>
  )
}

export default UsageOverview
