import React, { useState } from 'react'
import EditSystemConfigModal from './EditSystemConfigModal'

const SystemConfigSection = ({ settings, setEditSuccess }) => {
  const [openEditSystemConfigModal, setOpenEditSystemConfigModal] =
    useState(false)

  return (
    <div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
      <div className='flex space-x-6'>
        <div className='flex-1'>
          <label htmlFor='duration'>Duration Before Chemical Expired</label>
          <input
            className='w-full'
            type='text'
            name='duration'
            id='duration'
            readOnly
            value={settings.DAY_BEFORE_EXP + ' Days'}
          />
          <p className='mt-2 text-xs text-gray-400'>
            To get notified and change the status of the chemical to "Expiring
            Soon".
          </p>
        </div>

        <div className='flex-1'>
          <label htmlFor='backup-ttl'>Auto Backup Duration</label>
          <input
            className='w-full'
            type='text'
            name='backup-ttl'
            id='backup-ttl'
            readOnly
            value={settings.BACKUP_TTL + ' Days'}
          />
          <p className='mt-2 text-xs text-gray-400'>
            The maximum days for auto backup to be stored before deletion.
          </p>
        </div>
      </div>

      <button
        className='button button-outline mt-9 block w-60 justify-center px-4 py-3'
        onClick={() => setOpenEditSystemConfigModal(true)}
      >
        Edit System Configuration
      </button>

      {openEditSystemConfigModal && (
        <EditSystemConfigModal
          settings={settings}
          openModal={openEditSystemConfigModal}
          setOpenModal={setOpenEditSystemConfigModal}
          setEditSuccess={setEditSuccess}
        />
      )}
    </div>
  )
}

export default SystemConfigSection
