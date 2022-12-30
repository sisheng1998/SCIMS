import React from 'react'
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline'
import UserManualPDF from '../../../../images/img-1.jpg'

const UserManual = () => {
  const isUserManualReady = false

  return (
    <div className='flex h-full items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:p-4'>
      <DocumentTextIcon className='h-14 w-14 shrink-0 rounded-full bg-indigo-50 p-3 text-indigo-500' />

      <div className='flex flex-col items-start'>
        <h4 className='flex min-h-[2rem] items-center text-gray-700'>
          User Manual
        </h4>

        {isUserManualReady ? (
          <a
            className='inline-flex items-center text-sm font-medium text-gray-500'
            href={UserManualPDF}
            target='_blank'
            rel='noopener noreferrer'
            download='scims_user_manual'
          >
            Download <DownloadIcon className='ml-1 h-4 w-4' />
          </a>
        ) : (
          <p className='text-sm font-medium text-gray-500'>Coming Soon</p>
        )}
      </div>
    </div>
  )
}

export default UserManual
