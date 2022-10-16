import React from 'react'

const InfoCard = ({ icon, value, text, haveLetterS }) => {
  return (
    <div className='mb-4 w-1/5 min-w-max 2xl:w-1/4 xl:w-1/3'>
      <div className='mr-4 flex h-full items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        {icon}

        <div>
          {haveLetterS ? (
            <h3 className='text-gray-700'>{value}</h3>
          ) : (
            <h4 className='leading-8 text-gray-700'>{value}</h4>
          )}

          <p className='text-sm font-medium text-gray-500'>
            {text}
            {haveLetterS && value > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InfoCard
