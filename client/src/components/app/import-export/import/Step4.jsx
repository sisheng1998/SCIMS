import React from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/outline'
import ImportLog from './components/ImportLog'

const Step4 = ({ results }) => {
  return (
    <>
      <div className='mb-6 flex items-center space-x-2 rounded-lg bg-green-100 p-3'>
        <CheckIcon className='h-8 w-8 stroke-2 text-green-600' />
        <h4 className='text-green-600'>Import Completed!</h4>
      </div>

      <ImportLog results={results} />

      <p className='mt-2 text-xs text-gray-400'>
        The import log is saved and available to view under Activity Logs.
      </p>

      <div className='mt-6 flex items-center justify-end'>
        <Link
          to='/inventory'
          className='button button-solid w-40 justify-center hover:text-white'
        >
          View Chemicals
        </Link>
      </div>
    </>
  )
}

export default Step4
