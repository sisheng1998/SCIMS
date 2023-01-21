import React from 'react'
import InfoCard from '../../components/InfoCard'
import {
  UsersIcon,
  BeakerIcon,
  CubeIcon,
  DatabaseIcon,
} from '@heroicons/react/outline'

const Overview = ({ info }) => {
  return (
    <div className='mb-2'>
      <p className='mb-2 font-medium text-gray-500'>
        Overview <span className='text-xs text-gray-400'>(Last 30 Days)</span>
      </p>

      <div className='-mr-4 flex flex-wrap'>
        <InfoCard
          info={info.totalLabs}
          icon={
            <BeakerIcon className='h-14 w-14 rounded-full bg-blue-50 p-3 text-blue-500' />
          }
          text='Total Lab'
          increment={info.newLabs === 0 ? false : info.newLabs}
          haveLetterS={true}
        />

        <InfoCard
          info={info.totalUsers}
          icon={
            <UsersIcon className='h-14 w-14 rounded-full bg-purple-50 p-3 text-purple-500' />
          }
          text='Total User'
          increment={info.newUsers === 0 ? false : info.newUsers}
          haveLetterS={true}
        />

        <InfoCard
          info={info.totalChemicals}
          icon={
            <CubeIcon className='h-14 w-14 rounded-full bg-pink-50 p-3 text-pink-500' />
          }
          text='Total Chemical'
          increment={info.newChemicals === 0 ? false : info.newChemicals}
          haveLetterS={true}
        />

        <InfoCard
          info={info.totalBackups}
          icon={
            <DatabaseIcon className='h-14 w-14 rounded-full bg-green-50 p-3 text-green-500' />
          }
          text='Total Backup'
          increment={false}
          haveLetterS={true}
        />
      </div>
    </div>
  )
}

export default Overview
