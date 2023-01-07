import React, { useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import {
  CLASSIFICATION_LIST,
  CLASSIFICATION_ICON,
  COC_LIST,
  COC_DESCRIPTION,
} from '../../../config/safety_security_list'
import RenderPDF from '../components/RenderPDF'
import FormatDate from '../../utils/FormatDate'

const ViewSDSModal = ({ CAS, fromInventory, openModal, setOpenModal }) => {
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
        <div className='relative m-4 w-full max-w-3xl rounded-lg bg-white p-6 shadow'>
          <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
            <h4>{fromInventory ? 'CAS No. Information' : 'SDS Information'}</h4>
            <XIcon
              className='h-5 w-5 cursor-pointer hover:text-indigo-600'
              onClick={closeHandler}
            />
          </div>

          <div className='mb-6 grid grid-cols-2 gap-6 lg:grid-cols-1'>
            <div>
              <label htmlFor='CAS' className='mb-0.5'>
                CAS No.
              </label>
              <p className='font-medium'>{CAS.CASNo}</p>
            </div>

            <div>
              <label htmlFor='chemicalName' className='mb-0.5'>
                Name of Chemical
              </label>
              <p className='font-medium'>{CAS.chemicalName}</p>
            </div>
          </div>

          <label htmlFor='SDS' className='mb-1'>
            Safety Data Sheet (SDS)
          </label>
          <div
            className={
              CAS.SDSs.en === 'No SDS' || CAS.SDSs.bm === 'No SDS'
                ? 'space-y-2'
                : 'space-y-1'
            }
          >
            <RenderPDF PDF={CAS.SDSs.en} language='en' />
            <RenderPDF PDF={CAS.SDSs.bm} language='bm' />
          </div>

          <div className='mb-4 mt-6'>
            <label htmlFor='classification'>GHS Classifications</label>
            {CAS.classifications.length !== 0
              ? CLASSIFICATION_LIST.map(
                  (classification, index) =>
                    CAS.classifications.includes(classification) && (
                      <span
                        key={index}
                        className='tooltip mb-2 mr-2 inline-flex h-16 w-16'
                        data-tooltip={classification}
                      >
                        <img
                          className='flex-1'
                          src={CLASSIFICATION_ICON[index]}
                          alt='GHS Classifications'
                        />
                      </span>
                    )
                )
              : '-'}
          </div>

          <div>
            <label htmlFor='coc'>Chemical of Concerns</label>
            {CAS.COCs.length !== 0
              ? COC_LIST.map(
                  (security, index) =>
                    CAS.COCs.includes(security) && (
                      <span
                        key={index}
                        className={`mb-2 mr-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600 ${
                          security !== 'Other' ? 'tooltip' : ''
                        }`}
                        data-tooltip={COC_DESCRIPTION[index]}
                      >
                        {security}
                      </span>
                    )
                )
              : '-'}
          </div>

          <div className='mb-9 mt-6 flex items-center justify-between space-x-6 text-sm text-gray-500 lg:block lg:space-x-0 lg:space-y-1'>
            <p>
              Added At:{' '}
              <span className='font-semibold'>{FormatDate(CAS.createdAt)}</span>
            </p>
            <p>
              Last Updated:{' '}
              <span className='font-semibold'>
                {FormatDate(CAS.lastUpdated)}
              </span>
            </p>
          </div>

          <div className='flex items-center justify-end'>
            <span
              onClick={closeHandler}
              className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
            >
              Close
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ViewSDSModal
