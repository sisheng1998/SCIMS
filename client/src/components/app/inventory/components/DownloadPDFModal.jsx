import React, { useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { DownloadIcon, XIcon, DocumentTextIcon } from '@heroicons/react/outline'
import { BlobProvider } from '@react-pdf/renderer'
import { FormatChemicalDate } from '../../../utils/FormatDate'
import QRCodesPDF from './QRCodesPDF'
import useAuth from '../../../../hooks/useAuth'

const DownloadPDFModal = ({ chemicals, selected, openModal, setOpenModal }) => {
  const { auth } = useAuth()
  const divRef = useRef(null)

  const closeHandler = () => setOpenModal(false)

  const fileName = 'chemical_qr_codes'
  const labName = auth.currentLabName

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
        <div className='relative m-4 w-full max-w-xs rounded-lg bg-white p-6 text-center shadow'>
          <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
            <h5>Download PDF</h5>
            <button
              className='cursor-pointer hover:text-indigo-600 focus:outline-none'
              onClick={closeHandler}
            >
              <XIcon className='h-5 w-5' />
            </button>
          </div>

          <div className='flex items-center space-x-2'>
            <DocumentTextIcon className='h-12 w-12 text-gray-400' />
            <div className='text-left'>
              <p className='font-medium text-gray-900'>{fileName}.pdf</p>
              <p className='text-xs text-gray-500'>
                {FormatChemicalDate(new Date())}
              </p>
            </div>
          </div>

          <BlobProvider
            document={
              <QRCodesPDF
                chemicals={chemicals}
                selected={selected}
                labName={labName}
              />
            }
          >
            {({ loading, url }) =>
              loading ? (
                <button
                  className='button button-solid mt-6 w-full justify-center'
                  disabled={true}
                >
                  Generating...
                </button>
              ) : (
                <a
                  href={url}
                  target='_blank'
                  rel='noreferrer'
                  download={fileName}
                >
                  <button className='button button-solid mt-6 w-full justify-center'>
                    <DownloadIcon className='mr-2 h-5 w-5 stroke-2' />
                    Download
                  </button>
                </a>
              )
            }
          </BlobProvider>
        </div>
      </div>
    </Dialog>
  )
}

export default DownloadPDFModal
