import React, { useState } from 'react'
import { PencilAltIcon } from '@heroicons/react/outline'
import EditSubjectModal from './EditSubjectModal'
import TICKET_STATUS from '../../../../config/ticket_status'

const Subject = ({ ticket, status, setRefresh }) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className='flex items-start justify-between space-x-2'>
      <h3>{ticket.subject}</h3>

      {status !== TICKET_STATUS.resolved && (
        <button
          onClick={() => setOpenModal(true)}
          className='tooltip cursor-pointer text-gray-400 transition hover:text-indigo-700 focus:outline-none'
          data-tooltip='Edit Subject'
        >
          <PencilAltIcon className='h-5 w-5' />
        </button>
      )}

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
