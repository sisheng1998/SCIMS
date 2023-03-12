import React from 'react'
import GetRoleName from '../../utils/GetRoleName'
import useAuth from '../../../hooks/useAuth'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'

const LabCard = ({ role }) => {
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()

  const enableSwitch =
    role.lab._id !== auth.currentLabId &&
    role.lab.status === 'In Use' &&
    role.status === 'Active'

  let classes

  if (role.status === 'Active') {
    classes = 'bg-green-100 text-green-600'
  } else if (role.status === 'Pending') {
    classes = 'bg-yellow-100 text-yellow-600'
  } else {
    // Deactivated
    classes = 'bg-red-100 text-red-600'
  }

  const handleSwitchLab = () => {
    localStorage.setItem('currentLab', role.lab._id)
    setAuth((prev) => {
      return {
        ...prev,
        currentLabId: role.lab._id,
        currentLabName: role.lab.labName,
        currentRole: role.role,
      }
    })
    navigate('/')
  }

  return (
    <div className='mb-4 w-1/5 min-w-max 2xl:w-1/4 xl:w-1/3 lg:w-1/2 sm:w-full'>
      <div className='mr-4 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow'>
        <div className='flex flex-1 items-start justify-between'>
          <div>
            <label
              htmlFor='labName'
              className='mb-0.5 text-xs font-normal text-gray-400'
            >
              Name
            </label>
            <h4>{'Lab ' + role.lab.labName}</h4>
          </div>

          {enableSwitch && (
            <p
              className='flex cursor-pointer items-center text-sm font-medium text-gray-500 hover:text-indigo-600'
              onClick={handleSwitchLab}
            >
              <span
                className='tooltip inline-flex cursor-pointer items-center justify-center'
                data-tooltip={`Switch to Lab ${role.lab.labName}`}
              >
                Switch
                <SwitchHorizontalIcon className='ml-1 h-3.5 w-3.5' />
              </span>
            </p>
          )}

          {role.lab.status === 'Not In Use' && (
            <span className='text-sm font-medium text-red-600'>Not In Use</span>
          )}

          {role.lab._id === auth.currentLabId && (
            <span className='text-sm font-medium text-indigo-600'>
              Current Lab
            </span>
          )}
        </div>

        <hr className='-mx-6 mb-3 mt-6 border-gray-200' />

        <div className='flex items-end justify-between'>
          <div>
            <label
              htmlFor='role'
              className='mb-0.5 text-xs font-normal text-gray-400'
            >
              Role
            </label>
            <p className='font-medium capitalize'>{GetRoleName(role.role)}</p>
          </div>

          <p
            className={`rounded-full px-3 py-1 text-sm font-medium ${classes}`}
          >
            {role.status}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LabCard
