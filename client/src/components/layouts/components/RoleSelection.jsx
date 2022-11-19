import React, { Fragment } from 'react'
import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import GetRoleName from '../../utils/GetRoleName'

const RoleSelection = () => {
  const { auth, setAuth } = useAuth()

  const currentRole = auth.currentRole
  const isAdmin = auth.isAdmin

  const handleChange = (selectedRole) =>
    setAuth((prev) => ({ ...prev, currentRole: selectedRole }))

  return (
    <Listbox
      as='div'
      className='relative ml-3'
      value={currentRole}
      onChange={(selectedRole) => handleChange(selectedRole)}
    >
      <Listbox.Button className='flex items-center rounded-full bg-gray-100 py-1 px-3 text-sm font-medium capitalize text-gray-500 outline-gray-300 hover:bg-gray-200 hover:text-gray-600'>
        {GetRoleName(currentRole)}
        <svg width='6' height='3' className='ml-2 overflow-visible'>
          <path
            d='M0 0L3 3L6 0'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            strokeLinecap='round'
          ></path>
        </svg>
      </Listbox.Button>

      <Listbox.Options className='absolute top-full mt-2 max-h-80 w-36 overflow-y-auto rounded-lg bg-white py-2 text-sm font-medium leading-6 shadow-md outline-gray-300 ring-1 ring-gray-300'>
        {isAdmin && (
          <Listbox.Option value={ROLES_LIST.admin} as={Fragment}>
            <li
              className={`flex cursor-pointer items-center justify-between px-3 py-1 capitalize hover:bg-indigo-50 hover:text-indigo-600 ${
                currentRole === ROLES_LIST.admin
                  ? 'pointer-events-none font-semibold text-indigo-600'
                  : ''
              }`}
            >
              {GetRoleName(ROLES_LIST.admin)}
              {currentRole === ROLES_LIST.admin && (
                <CheckIcon className='ml-2 h-4 w-4 stroke-2' />
              )}
            </li>
          </Listbox.Option>
        )}

        {Object.values(ROLES_LIST).map(
          (role, index) =>
            index !== 0 && (
              <Listbox.Option key={index} value={role} as={Fragment}>
                <li
                  className={`flex cursor-pointer items-center justify-between px-3 py-1 capitalize hover:bg-indigo-50 hover:text-indigo-600 ${
                    currentRole === role
                      ? 'pointer-events-none font-semibold text-indigo-600'
                      : ''
                  }`}
                >
                  {GetRoleName(role)}
                  {currentRole === role && (
                    <CheckIcon className='ml-2 h-4 w-4 stroke-2' />
                  )}
                </li>
              </Listbox.Option>
            )
        )}
      </Listbox.Options>
    </Listbox>
  )
}

export default RoleSelection
