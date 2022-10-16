import React, { useState } from 'react'
import { CheckIcon, XIcon } from '@heroicons/react/outline'
import useAuth from '../../../hooks/useAuth'
import ConfirmationModal from './ConfirmationModal'

const ActionCard = ({ chemicals, setChemicals, setStarted }) => {
  const { auth } = useAuth()
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [action, setAction] = useState('')

  const actionHandler = (action) => {
    setAction(action)
    setOpenConfirmationModal(true)
  }

  return (
    <>
      <div className='mb-6 rounded-lg bg-white p-4 shadow'>
        <label
          htmlFor='labName'
          className='mb-0.5 text-xs font-normal text-gray-400'
        >
          Lab Name
        </label>
        <h4>{'Lab ' + auth.currentLabName}</h4>

        <label
          htmlFor='chemicals'
          className='mb-0.5 mt-4 text-xs font-normal text-gray-400'
        >
          Chemicals (Excluding Disposed)
        </label>
        <div className='flex items-baseline space-x-2'>
          <h4>{chemicals.length}</h4>
          <span className='text-gray-500'>/</span>
          <h4>{auth.stockCheck.chemicals.length}</h4>
          <p className='text-sm text-gray-500'>Recorded</p>
        </div>

        <label
          htmlFor='action'
          className='mt-4 text-xs font-normal text-gray-400'
        >
          Stock Check Action
        </label>
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => actionHandler('complete')}
            className={`button-green-outline flex h-10 items-center justify-center rounded-lg ${
              chemicals.length === 0 ? 'pointer-events-none opacity-50' : ''
            }`}
            disabled={chemicals.length === 0}
          >
            <CheckIcon className='mr-1 h-4 w-4 stroke-2' />
            Complete
          </button>

          <button
            onClick={() => actionHandler('cancel')}
            className='button-red-outline flex h-10 items-center justify-center rounded-lg'
          >
            <XIcon className='mr-1 h-4 w-4 stroke-2' />
            Cancel
          </button>
        </div>
      </div>

      {openConfirmationModal && action && (
        <ConfirmationModal
          action={action}
          chemicals={chemicals}
          setChemicals={setChemicals}
          setStarted={setStarted}
          openModal={openConfirmationModal}
          setOpenModal={setOpenConfirmationModal}
        />
      )}
    </>
  )
}

export default ActionCard
