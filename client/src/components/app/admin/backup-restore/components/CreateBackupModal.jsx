import React, { useRef, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { DownloadIcon, XIcon, DocumentTextIcon } from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import FormatDate from '../../../../utils/FormatDate'
import FormatBytes from '../../../../utils/FormatBytes'
import FILE_PATH from '../../../../../config/file_path'
import LoadingButtonText from '../../../components/LoadingButtonText'

const CreateBackupModal = ({ openModal, setOpenModal, setRefresh }) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [backup, setBackup] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getBackups = async () => {
      try {
        const { data } = await axiosPrivate.post(
          '/api/admin/backup',
          {},
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          setBackup(data.backup)
          setSuccess(true)
          setIsLoading(false)
        }
      } catch (error) {
        setBackup('')
        setSuccess(false)
        setIsLoading(false)
      }
    }

    getBackups()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate])

  const closeHandler = () => {
    if (success) {
      setRefresh(true)
    }

    setOpenModal(false)
  }

  return (
    <Dialog
      open={openModal}
      onClose={() => {}}
      initialFocus={divRef}
      className='fixed inset-0 z-10 overflow-y-auto'
    >
      <div
        ref={divRef}
        className='flex min-h-screen items-center justify-center'
      >
        <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
        <div className='relative m-4 w-full max-w-md rounded-lg bg-white p-6 text-center shadow'>
          <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
            <h5>Backup</h5>
            <button
              className='cursor-pointer hover:text-indigo-600 focus:outline-none'
              onClick={closeHandler}
            >
              <XIcon className='h-5 w-5' />
            </button>
          </div>

          {isLoading || !success || backup === '' ? (
            <div
              className={`-mb-0.5 flex items-center justify-center rounded-md bg-gray-50 px-4 ${
                isLoading ? 'py-12' : 'py-9'
              }`}
            >
              {isLoading ? (
                <LoadingButtonText />
              ) : (
                <p>
                  Unable to create backup.
                  <br />
                  Please try again later.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className='flex items-center space-x-2'>
                <DocumentTextIcon className='h-12 w-12 text-gray-400' />
                <div className='text-left'>
                  <p className='font-medium text-gray-900'>{backup.name}</p>
                  <p className='text-xs text-gray-500'>
                    {backup.hasOwnProperty('size')
                      ? FormatBytes(backup.size)
                      : ''}
                    {backup.hasOwnProperty('size') &&
                      backup.hasOwnProperty('time') &&
                      ` - `}
                    {backup.hasOwnProperty('time')
                      ? FormatDate(new Date(backup.time))
                      : ''}
                  </p>
                </div>
              </div>

              <a
                href={FILE_PATH.backups.manual + backup.name}
                target='_blank'
                rel='noreferrer'
                download={backup.name}
              >
                <button className='button button-solid mt-6 w-full justify-center'>
                  <DownloadIcon className='mr-2 h-5 w-5 stroke-2' />
                  Download
                </button>
              </a>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default CreateBackupModal
