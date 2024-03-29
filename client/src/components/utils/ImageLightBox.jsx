import React, { useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import GetLetterPicture from './GetLetterPicture'

const ImageLightBox = ({ object, type, openModal, setOpenModal }) => {
  const divRef = useRef(null)
  const closeHandler = () => setOpenModal(false)

  return (
    <Dialog
      open={openModal}
      onClose={() => {}}
      initialFocus={divRef}
      className='fixed inset-0 z-20 overflow-y-auto'
    >
      <div
        ref={divRef}
        className='flex min-h-screen items-center justify-center'
      >
        <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
        <div className='relative m-4 w-full max-w-md'>
          <div className='mb-2 flex justify-between space-x-6 text-white'>
            <h4 className='text-white'>{object.name}</h4>
            <button
              className='cursor-pointer opacity-75 hover:opacity-100 focus:outline-none'
              onClick={closeHandler}
            >
              <XIcon className='h-5 w-5 stroke-2' />
            </button>
          </div>

          <div className='rounded-lg bg-white p-6 shadow'>
            <img
              onError={(event) =>
                (event.target.src = GetLetterPicture(object.name))
              }
              src={object.imageSrc}
              alt={type}
              className={`aspect-square object-cover ${
                type === 'QRCode' ? 'border border-gray-200 bg-gray-50 p-8' : ''
              }`}
              width='500'
              height='500'
            />
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ImageLightBox
