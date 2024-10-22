import React from 'react'
import {
  BeakerIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
  XCircleIcon,
} from '@heroicons/react/outline'

const StockCheckOverview = ({ report }) => {
  return (
    <div className='flex items-center space-x-4 text-sm text-gray-500'>
      <p className='flex items-baseline'>
        <BeakerIcon className='mr-2 inline-block h-5 w-5 self-center stroke-2 text-indigo-600' />
        Total
        <span className='mx-1.5 text-xl font-medium text-gray-700'>
          {report.totalNo}
        </span>
        Chemical{report.totalNo > 1 ? 's' : ''}
      </p>

      <span className='text-gray-200'>|</span>

      <p className='flex items-baseline'>
        <CheckCircleIcon className='mr-2 inline-block h-5 w-5 self-center stroke-2 text-green-600' />
        <span className='mr-1.5 text-xl font-medium text-gray-700'>
          {report.recordedNo}
        </span>
        Recorded
      </p>

      <span className='text-gray-200'>|</span>

      <p className='flex items-baseline'>
        <QuestionMarkCircleIcon className='mr-2 inline-block h-5 w-5 self-center stroke-2 text-yellow-600' />
        <span className='mr-1.5 text-xl font-medium text-gray-700'>
          {report.missingNo}
        </span>
        Missing
      </p>

      <span className='text-gray-200'>|</span>

      <p className='flex items-baseline'>
        <EyeIcon className='mr-2 inline-block h-5 w-5 self-center stroke-2 text-blue-600' />
        <span className='mr-1.5 text-xl font-medium text-gray-700'>
          {report.kivNo}
        </span>
        KIV
      </p>

      <span className='text-gray-200'>|</span>

      <p className='flex items-baseline'>
        <XCircleIcon className='mr-2 inline-block h-5 w-5 self-center stroke-2 text-red-600' />
        <span className='mr-1.5 text-xl font-medium text-gray-700'>
          {report.disposedNo}
        </span>
        Disposed
      </p>
    </div>
  )
}

export default StockCheckOverview
