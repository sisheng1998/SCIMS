import React, { useState, useEffect } from 'react'
import { Menu } from '@headlessui/react'
import {
  DocumentSearchIcon,
  TrashIcon,
  DotsVerticalIcon,
} from '@heroicons/react/outline'

const ActionMenu = ({
  name,
  setFilename,
  setOpenServerLogModal,
  setOpenDeleteServerLogModal,
}) => {
  const [isDelete, setIsDelete] = useState(false)

  const FunctionOnClose = ({ open, children }) => {
    useEffect(() => {
      if (!isDelete || open) return

      setIsDelete(false)
    }, [open])

    return <>{children}</>
  }

  const readServerLog = () => {
    setFilename(name)
    setOpenServerLogModal(true)
  }

  const deleteServerLog = () => {
    setFilename(name)
    setOpenDeleteServerLogModal(true)
  }

  return (
    <Menu as='div' className='relative inline-flex items-center align-middle'>
      {({ open }) => (
        <FunctionOnClose open={open}>
          <Menu.Button
            className={`outline-gray-300 transition hover:text-indigo-600 ${
              open ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <DotsVerticalIcon className='h-5 w-5 shrink-0' />
          </Menu.Button>

          <Menu.Items className='absolute right-0 top-[150%] z-[1] min-w-[140px] rounded-lg bg-white py-2 shadow-md outline-gray-300 ring-1 ring-gray-300'>
            <Menu.Item>
              <button
                onClick={readServerLog}
                className='group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 hover:bg-indigo-50 hover:text-indigo-600'
              >
                <DocumentSearchIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
                View
              </button>
            </Menu.Item>

            <Menu.Item>
              {({ close }) => (
                <button
                  onClick={async (e) => {
                    if (!isDelete) {
                      e.preventDefault()
                      e.stopPropagation()

                      setIsDelete(true)
                    } else {
                      deleteServerLog()
                      close()
                    }
                  }}
                  className='group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 hover:bg-red-50 hover:text-red-600'
                >
                  <TrashIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-red-600' />
                  {isDelete ? 'Confirm?' : 'Delete'}
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </FunctionOnClose>
      )}
    </Menu>
  )
}

export default ActionMenu
