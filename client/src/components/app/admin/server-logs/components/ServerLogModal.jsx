import React, { useRef, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import {
  Loading,
  Failed,
} from '../../backup-restore/components/ModalComponents'

const ServerLogModal = ({ filename, setFilename, openModal, setOpenModal }) => {
  const axiosPrivate = useAxiosPrivate()
  const divRef = useRef(null)

  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getServerLog = async () => {
      try {
        const { data } = await axiosPrivate.get(
          `/api/admin/server-log/${filename}`,
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          setContent(data.content)
          setSuccess(true)
          setIsLoading(false)
        }
      } catch (error) {
        setSuccess(false)
        setIsLoading(false)
      }
    }

    getServerLog()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, filename])

  const closeHandler = () => {
    setFilename('')
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
            <Loading
              text='Retrieving Server Log...'
              closeHandler={closeHandler}
            />
          ) : success ? (
            <div>{content}</div>
          ) : (
            <Failed
              title='Failed To Retrieve Data!'
              description='Please try again later.'
              closeHandler={closeHandler}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default ServerLogModal
