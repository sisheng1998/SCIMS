import React, { useRef, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
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
        <div
          className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
            !isLoading && success ? 'max-w-3xl' : 'max-w-sm text-center'
          }`}
        >
          {isLoading ? (
            <Loading
              text='Retrieving Server Log...'
              closeHandler={closeHandler}
            />
          ) : success ? (
            <>
              <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
                <h4>{filename}</h4>
                <XIcon
                  className='h-5 w-5 cursor-pointer hover:text-indigo-600'
                  onClick={closeHandler}
                />
              </div>

              <p className='h-full max-h-96 overflow-auto whitespace-pre-line'>
                {content}
              </p>

              <div className='mt-6 flex items-center justify-end'>
                <button
                  onClick={closeHandler}
                  className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600 focus:outline-none'
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <Failed
              title='Failed To Retrieve!'
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
