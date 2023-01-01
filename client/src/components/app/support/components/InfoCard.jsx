import React from 'react'

const InfoCard = ({ icon, value, text, haveLetterS }) => {
  return (
    <div className='flex h-full items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      {icon}

      <div>
        <h4 className='leading-8 text-gray-700'>{value}</h4>

        <p className='text-sm font-medium text-gray-500'>
          {text}
          {haveLetterS && value > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

export default InfoCard
