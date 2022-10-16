import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import dayjs from 'dayjs'

const CalendarHeader = ({ monthIndex, setMonthIndex, dayBeforeExp }) => {
  const currentMonth = dayjs().month()

  const handleReset = () => setMonthIndex(currentMonth)
  const handlePrevMonth = () => setMonthIndex(monthIndex - 1)
  const handleNextMonth = () => setMonthIndex(monthIndex + 1)

  return (
    <div className='mb-4 flex items-center'>
      <button
        onClick={handleReset}
        className='button button-outline mr-4'
        disabled={monthIndex === currentMonth}
      >
        Today
      </button>

      <div className='tooltip' data-tooltip='Previous Month'>
        <ChevronLeftIcon
          onClick={handlePrevMonth}
          className='h-8 w-8 cursor-pointer rounded-full stroke-2 p-1.5 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600'
        />
      </div>

      <div className='tooltip' data-tooltip='Next Month'>
        <ChevronRightIcon
          onClick={handleNextMonth}
          className='h-8 w-8 cursor-pointer rounded-full stroke-2 p-1.5 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600'
        />
      </div>

      <h4 className='ml-2.5 mr-6 text-gray-700 xl:mr-4'>
        {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
      </h4>

      <div className='ml-auto flex items-center space-x-6 text-sm font-medium text-gray-500 xl:space-x-4 xl:text-xs'>
        <p className='flex items-center'>
          <span className='mr-2 inline-block h-5 w-5 rounded-full bg-yellow-100 xl:h-4 xl:w-4'></span>
          {dayBeforeExp} Days Before Expiration Date
        </p>

        <p className='flex items-center'>
          <span className='mr-2 inline-block h-5 w-5 rounded-full bg-red-100 xl:h-4 xl:w-4'></span>
          Expiration Date
        </p>
      </div>
    </div>
  )
}

export default CalendarHeader
