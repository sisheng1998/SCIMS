import React, { useRef, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import { Loading, Success, Failed } from './ModalComponents'

const DeleteBackupModal = ({
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

    const deleteBackup = async () => {
      try {
        await axiosPrivate.delete(
          '/api/admin/backup',
          {
            data: {
              backup,
            },
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

    deleteBackup()

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
            <Loading text='Deleting Backup...' />
          ) : success ? (
            <Success
              title='Backup Deleted!'
              description='The backup have been deleted.'
              closeHandler={closeHandler}
            />
          ) : (
            <Failed
              title='Deletion Failed!'
              description='Please try again later.'
              closeHandler={closeHandler}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default DeleteBackupModal
