import React, { useState } from 'react'

import ImageLightBox from '../../../utils/ImageLightBox'
import TICKET_STATUS from '../../../../config/ticket_status'

import Title from '../../components/Title'
import Sidebar from './Sidebar'
import Subject from './Subject'
import Status from './Status'
import MessageCard from './MessageCard'
import NewMessage from './NewMessage'

const TicketDetails = ({ ticket, setRefresh }) => {
  const [avatarInfo, setAvatarInfo] = useState('')
  const [openViewImageModal, setOpenViewImageModal] = useState(false)

  const viewImage = (name, imageSrc) => {
    setAvatarInfo({ name, imageSrc })
    setOpenViewImageModal(true)
  }

  return (
    <>
      <Title
        title='Support Ticket'
        hasButton={false}
        hasRefreshButton={false}
      />

      <div className='mb-6 flex items-start justify-center space-x-6 lg:block lg:space-x-0 lg:space-y-4'>
        <div className='sticky top-[5.5rem] w-full max-w-xs space-y-2 lg:static lg:max-w-none'>
          <Sidebar
            ticket={ticket}
            setRefresh={setRefresh}
            viewImage={viewImage}
          />
        </div>

        <div className='max-w-4xl flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:max-w-none'>
          <Subject ticket={ticket} setRefresh={setRefresh} />

          <Status
            status={ticket.status}
            createdAt={ticket.createdAt}
            lastUpdated={ticket.lastUpdated}
          />

          {ticket.messages.length !== 0 && (
            <div className='space-y-4'>
              {ticket.messages.map((message) => (
                <MessageCard
                  key={message._id}
                  ticketId={ticket._id}
                  message={message}
                  viewImage={viewImage}
                  attachmentPath={ticket.attachmentPath}
                />
              ))}
            </div>
          )}

          {ticket.status !== TICKET_STATUS.resolved && (
            <>
              <hr className='mb-6 mt-8 border-gray-200' />
              <NewMessage ticketId={ticket._id} setRefresh={setRefresh} />
            </>
          )}
        </div>
      </div>

      {openViewImageModal && avatarInfo && (
        <ImageLightBox
          object={avatarInfo}
          type='Avatar'
          openModal={openViewImageModal}
          setOpenModal={setOpenViewImageModal}
        />
      )}
    </>
  )
}

export default TicketDetails
