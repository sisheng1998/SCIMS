import React, { Fragment, useEffect, useState } from 'react'
import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import { useNavigate } from 'react-router-dom'
import useMobile from '../../../hooks/useMobile'

const admin = {
  lab: { _id: ROLES_LIST.admin.toString(), labName: 'Admin' },
  role: ROLES_LIST.admin,
}

const allLabs = {
  lab: { _id: 'All Labs', labName: 'All Labs' },
  role: ROLES_LIST.guest,
}

const LabSelection = ({ searchRef }) => {
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const [redirect, setRedirect] = useState(false)
  const isMobile = useMobile()

  // Check whether user is admin
  const isAdmin = !isMobile && auth.isAdmin

  const currentLab = localStorage.getItem('currentLab')
  if (!currentLab) {
    window.location.reload(false)
  }

  const isAllLabs = currentLab === allLabs.lab._id

  const index = auth.roles.findIndex(
    (role) => role.lab._id === currentLab && role.lab.status === 'In Use'
  )

  if (!isAdmin && !isAllLabs && index === -1) {
    window.location.reload(false)
  }

  const [selected, setSelected] = useState(
    isAdmin && currentLab === admin.lab._id
      ? admin
      : isAllLabs && currentLab === allLabs.lab._id
      ? allLabs
      : auth.roles[index]
  )

  useEffect(() => {
    setSelected(
      isAdmin && currentLab === admin.lab._id
        ? admin
        : isAllLabs && currentLab === allLabs.lab._id
        ? allLabs
        : auth.roles[index]
    )
  }, [isAdmin, isAllLabs, currentLab, auth.roles, index])

  useEffect(() => {
    const getAuth = () => {
      if (redirect) {
        localStorage.setItem('currentLab', selected.lab._id)
        setAuth((prev) => ({
          ...prev,
          currentLabId: selected.lab._id,
          currentLabName: selected.lab.labName,
          currentRole: selected.role,
        }))

        navigate(
          selected.lab._id !== ROLES_LIST.admin.toString() ? '/' : '/admin'
        )
        setRedirect(!redirect)
      }
    }

    getAuth()

    if (searchRef.current) {
      searchRef.current.value = ''
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <Listbox
      as='div'
      className='relative'
      value={selected}
      onChange={setSelected}
    >
      <Listbox.Button className='flex items-center rounded-full bg-gray-100 py-1 px-3 text-sm font-medium text-gray-500 outline-gray-300 hover:bg-gray-200 hover:text-gray-600'>
        {selected.lab.labName === 'Admin' || selected.lab.labName === 'All Labs'
          ? selected.lab.labName
          : 'Lab ' + selected.lab.labName}
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
        {isAdmin ? (
          <Listbox.Option value={admin} as={Fragment}>
            <li
              className={`flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 ${
                auth.currentLabId === ROLES_LIST.admin.toString()
                  ? 'pointer-events-none font-semibold text-indigo-600'
                  : ''
              }`}
              onClick={() => setRedirect(true)}
            >
              Admin
              {auth.currentLabId === ROLES_LIST.admin.toString() && (
                <CheckIcon className='ml-2 h-4 w-4 stroke-2' />
              )}
            </li>
          </Listbox.Option>
        ) : null}

        <Listbox.Option value={allLabs} as={Fragment}>
          <li
            className={`flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 ${
              auth.currentLabId === 'All Labs'
                ? 'pointer-events-none font-semibold text-indigo-600'
                : ''
            }`}
            onClick={() => setRedirect(true)}
          >
            All Labs
            {auth.currentLabId === 'All Labs' && (
              <CheckIcon className='ml-2 h-4 w-4 stroke-2' />
            )}
          </li>
        </Listbox.Option>

        {auth.roles
          .sort((a, b) =>
            a.lab.labName.toLowerCase() > b.lab.labName.toLowerCase() ? 1 : -1
          )
          .map((role) =>
            role.status === 'Active' && role.lab.status === 'In Use' ? (
              <Listbox.Option key={role._id} value={role} as={Fragment}>
                <li
                  className={`flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 ${
                    auth.currentLabId === role.lab._id
                      ? 'pointer-events-none font-semibold text-indigo-600'
                      : ''
                  }`}
                  onClick={() => setRedirect(true)}
                >
                  {'Lab ' + role.lab.labName}
                  {auth.currentLabId === role.lab._id && (
                    <CheckIcon className='ml-2 h-4 w-4 stroke-2' />
                  )}
                </li>
              </Listbox.Option>
            ) : null
          )}
      </Listbox.Options>
    </Listbox>
  )
}

export default LabSelection
