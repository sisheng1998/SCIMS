import React, { useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/outline'

const SuccessMessageModal = ({ ticketId, openModal, setOpenModal }) => {
  const navigate = useNavigate()
  const divRef = useRef(null)

  const closeHandler = () => {
    setOpenModal(false)
    navigate(`/support/${ticketId}`)
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
          <CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />

          <h2 className='mt-6 mb-2 text-green-600'>New Ticket Opened!</h2>
          <p>We will get back to you as soon as possible.</p>

          <button
            className='button button-solid mt-6 w-32 justify-center'
            onClick={closeHandler}
          >
            Okay
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default SuccessMessageModal
