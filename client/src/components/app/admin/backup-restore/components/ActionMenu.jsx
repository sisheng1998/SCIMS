import React, { useState, useEffect } from 'react'
import { Menu } from '@headlessui/react'
import {
  DownloadIcon,
  CloudUploadIcon,
  TrashIcon,
  DotsVerticalIcon,
} from '@heroicons/react/outline'

import FILE_PATH from '../../../../../config/file_path'

const ActionMenu = ({
  name,
  type,
  setBackup,
  setOpenDeleteBackupModal,
  setOpenRestoreBackupModal,
}) => {
  const [isDelete, setIsDelete] = useState(false)
  const [isRestore, setIsRestore] = useState(false)

  const FunctionOnClose = ({ open, children }) => {
    useEffect(() => {
      if ((!isDelete && !isRestore) || open) return

      setIsDelete(false)
      setIsRestore(false)
    }, [open])

    return <>{children}</>
  }

  const deleteBackup = () => {
    setBackup({
      name,
      type,
    })
    setOpenDeleteBackupModal(true)
  }

  const restoreBackup = () => {
    setBackup({
      name,
      type,
    })
    setOpenRestoreBackupModal(true)
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
              <a
                href={FILE_PATH.backups.manual + name}
                target='_blank'
                rel='noreferrer'
                download={name}
              >
                <button className='group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'>
                  <DownloadIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
                  Download
                </button>
              </a>
            </Menu.Item>

            <Menu.Item>
              {({ close }) => (
                <button
                  onClick={async (e) => {
                    if (isDelete) {
                      setIsDelete(false)
                    }

                    if (!isRestore) {
                      e.preventDefault()
                      e.stopPropagation()

                      setIsRestore(true)
                    } else {
                      restoreBackup()
                      close()
                    }
                  }}
                  className='group flex w-full items-center px-3 py-1 text-sm font-medium leading-6 hover:bg-indigo-50 hover:text-indigo-600'
                >
                  <CloudUploadIcon className='mr-2 h-5 w-5 text-gray-500 group-hover:text-indigo-600' />
                  {isRestore ? 'Confirm?' : 'Restore'}
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ close }) => (
                <button
                  onClick={async (e) => {
                    if (isRestore) {
                      setIsRestore(false)
                    }

                    if (!isDelete) {
                      e.preventDefault()
                      e.stopPropagation()

                      setIsDelete(true)
                    } else {
                      deleteBackup()
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
