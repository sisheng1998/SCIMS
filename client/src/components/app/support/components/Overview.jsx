import React from 'react'
import { TicketIcon } from '@heroicons/react/outline'

import InfoCard from './InfoCard'
import UserManual from './UserManual'
import useAuth from '../../../../hooks/useAuth'
import useMobile from '../../../../hooks/useMobile'
import ROLES_LIST from '../../../../config/roles_list'

const Overview = ({ allTickets }) => {
  const { auth } = useAuth()
  const isMobile = useMobile()

  const isMasquerading = auth.isAdmin && auth.currentRole !== ROLES_LIST.admin

  const tickets = {
    open: 0,
    inProgress: 0,
    resolved: 0,
  }

  allTickets.forEach((ticket) => {
    if (isMasquerading && ticket.user._id !== auth.id) return

    if (ticket.status === 'Open') {
      tickets.open += 1
    } else if (ticket.status === 'Resolved') {
      tickets.resolved += 1
    } else {
      tickets.inProgress += 1
    }
  })

  return (
    <>
      {!isMobile && <p className='mb-2 font-medium text-gray-500'>Overview</p>}

      <div className='mb-6 grid grid-cols-4 gap-4 lg:grid-cols-1'>
        <UserManual />

        {!isMobile && (
          <>
            <InfoCard
              icon={
                <TicketIcon className='h-14 w-14 rounded-full bg-blue-50 p-3 text-blue-500' />
              }
              value={tickets.open}
              text='Open'
            />

            <InfoCard
              icon={
                <TicketIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
              }
              value={tickets.inProgress}
              text='In Progress'
            />

            <InfoCard
              icon={
                <TicketIcon className='h-14 w-14 rounded-full bg-green-50 p-3 text-green-500' />
              }
              value={tickets.resolved}
              text='Resolved'
            />
          </>
        )}
      </div>
    </>
  )
}

export default Overview
