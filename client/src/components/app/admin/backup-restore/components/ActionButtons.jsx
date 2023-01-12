import React, { useState } from 'react'
import { RefreshIcon, PlusIcon, UploadIcon } from '@heroicons/react/outline'
import CreateBackupModal from './CreateBackupModal'
import UploadAndRestoreModal from './UploadAndRestoreModal'

const ActionButtons = ({ setRefresh }) => {
  const [openBackupModal, setOpenBackupModal] = useState(false)
  const [openUploadAndRestoreModal, setOpenUploadAndRestoreModal] =
    useState(false)

  return (
    <div className='flex items-center space-x-4'>
      <button
        onClick={() => setOpenBackupModal(true)}
        className='button button-outline'
      >
        <PlusIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
        Create Backup
      </button>

      <button
        onClick={() => setOpenUploadAndRestoreModal(true)}
        className='button button-outline'
      >
        <UploadIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
        Upload & Restore
      </button>

      <button
        onClick={() => setRefresh(true)}
        className='button button-outline lg:py-1.5'
      >
        <RefreshIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
        Refresh
      </button>

      {openBackupModal && (
        <CreateBackupModal
          openModal={openBackupModal}
          setOpenModal={setOpenBackupModal}
          setRefresh={setRefresh}
        />
      )}

      {openUploadAndRestoreModal && (
        <UploadAndRestoreModal
          openModal={openUploadAndRestoreModal}
          setOpenModal={setOpenUploadAndRestoreModal}
          setRefresh={setRefresh}
        />
      )}
    </div>
  )
}

export default ActionButtons
