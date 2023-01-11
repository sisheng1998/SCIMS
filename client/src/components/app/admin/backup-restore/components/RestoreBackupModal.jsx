import React, { useRef, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import { Loading, Success, Failed } from './ModalComponents'

const RestoreBackupModal = ({
  backup,
  setBackup,
  openModal,
  setOpenModal,
  setRefresh,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const restoreBackup = async () => {
      try {
        await axiosPrivate.post(
          '/api/admin/backup/restore',
          {
            backup,
          },
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          setSuccess(true)
          setIsLoading(false)
        }
      } catch (error) {
        setSuccess(false)
        setIsLoading(false)
      }
    }

    restoreBackup()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, backup])

  const closeHandler = () => {
    if (success) {
      setRefresh(true)
    }

    setBackup({
      name: '',
      type: '',
    })
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
        <div className='relative m-4 w-full max-w-sm rounded-lg bg-white p-6 text-center shadow'>
          {isLoading ? (
            <Loading text='Restoring Backup...' closeHandler={closeHandler} />
          ) : success ? (
            <Success
              title='Restore Completed!'
              description='The data have been restored.'
              closeHandler={closeHandler}
            />
          ) : (
            <Failed
              title='Restoration Failed!'
              description='Please try again later.'
              closeHandler={closeHandler}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default RestoreBackupModal
