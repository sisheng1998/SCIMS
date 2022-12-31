import React, { useState } from 'react'
import { PencilAltIcon } from '@heroicons/react/outline'
import EditSubjectModal from './EditSubjectModal'

const Subject = ({ ticket, setRefresh }) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className='flex items-start justify-between space-x-2'>
      <h3>{ticket.subject}</h3>

      <button
        onClick={() => setOpenModal(true)}
        className='tooltip text-gray-400 transition hover:text-indigo-700 focus:outline-none'
        data-tooltip='Edit Subject'
      >
        <PencilAltIcon className='h-5 w-5' />
      </button>

      {openModal && (
        <EditSubjectModal
          ticket={ticket}
          openModal={openModal}
          setOpenModal={setOpenModal}
          setRefresh={setRefresh}
        />
      )}
    </div>
  )
}

export default Subject
