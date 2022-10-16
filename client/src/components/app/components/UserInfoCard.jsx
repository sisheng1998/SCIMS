import React from 'react'
import useAuth from '../../../hooks/useAuth'
import GetRoleName from '../../utils/GetRoleName'

const UserInfoCard = () => {
  const { auth } = useAuth()

  return (
    <div className='mb-6'>
      <p className='mb-2 font-medium text-gray-500'>Welcome!</p>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mb-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold capitalize text-indigo-600'>
          {GetRoleName(auth.currentRole)}
        </p>
        <p className='text-xl font-medium'>{auth.name}</p>
        <p className='break-words text-sm text-gray-500'>{auth.email}</p>
      </div>
    </div>
  )
}

export default UserInfoCard
