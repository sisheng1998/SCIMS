import React from 'react'
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline'
import FILE_PATH from '../../../../config/file_path'

const UserManual = () => {
  return (
    <div className='flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:p-4'>
      <DocumentTextIcon className='h-14 w-14 shrink-0 rounded-full bg-indigo-50 p-3 text-indigo-500' />

      <div className='flex flex-col items-start'>
        <h4 className='flex min-h-[2rem] items-center text-gray-700'>
          User Manual
        </h4>

        <a
          className='inline-flex items-center text-sm font-medium text-gray-500'
          href={FILE_PATH.userManual}
          target='_blank'
          rel='noopener noreferrer'
        >
          Download <DownloadIcon className='ml-1 h-4 w-4' />
        </a>
      </div>
    </div>
  )
}

export default UserManual
