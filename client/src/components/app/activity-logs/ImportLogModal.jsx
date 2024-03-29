import React, { useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import ImportLog from '../import-export/import/components/ImportLog'

const ImportLogModal = ({ info, openModal, setOpenModal }) => {
  const divRef = useRef(null)
  const closeHandler = () => setOpenModal(false)

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
        <div className='relative m-4 w-full max-w-4xl rounded-lg bg-white p-6 shadow'>
          <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
            <h4>Import Log ({info.date})</h4>
            <XIcon
              className='h-5 w-5 cursor-pointer hover:text-indigo-600'
              onClick={closeHandler}
            />
          </div>

          <ImportLog results={info.results} />

          <div className='mt-9 flex items-center justify-end'>
            <button
              onClick={closeHandler}
              className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600 focus:outline-none'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ImportLogModal
