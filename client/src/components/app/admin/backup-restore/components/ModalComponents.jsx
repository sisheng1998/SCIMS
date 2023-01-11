import React, { useState, useEffect } from 'react'
import { CheckIcon, XIcon } from '@heroicons/react/outline'

const Loading = ({ text, closeHandler }) => {
  const [isXIconVisible, setIsXIconVisible] = useState(false)

  useEffect(() => {
    const showXIcon = setTimeout(() => setIsXIconVisible(true), 10000)

    return () => clearTimeout(showXIcon)
  }, [])

  return (
    <div className='relative flex flex-col items-center p-6'>
      {isXIconVisible && (
        <button
          className='absolute top-0 right-0 cursor-pointer hover:text-indigo-600 focus:outline-none'
          onClick={closeHandler}
        >
          <XIcon className='h-5 w-5' />
        </button>
      )}

      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        aria-hidden='true'
        className='h-16 w-16 animate-spin lg:h-12 lg:w-12'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
          className='origin-center -scale-x-100'
        ></path>
      </svg>
      <p className='mt-4 text-xl font-medium lg:text-lg'>{text}</p>
    </div>
  )
}

const Success = ({ title, description, closeHandler }) => (
  <>
    <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />

    <h2 className='mt-6 mb-2 text-green-600'>{title}</h2>
    <p>{description}</p>

    <button
      className='button button-solid mt-6 w-32 justify-center'
      onClick={closeHandler}
    >
      Okay
    </button>
  </>
)

const Failed = ({ title, description, closeHandler }) => (
  <>
    <XIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />

    <h2 className='mt-6 mb-2 text-red-600'>{title}</h2>
    <p>{description}</p>

    <button
      className='button button-solid mt-6 w-32 justify-center'
      onClick={closeHandler}
    >
      Okay
    </button>
  </>
)

export { Loading, Success, Failed }
