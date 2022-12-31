import React from 'react'

import useAuth from '../../../../hooks/useAuth'
import useMobile from '../../../../hooks/useMobile'

import FormatDate, { FromNow } from '../../../utils/FormatDate'
import ROLES_LIST from '../../../../config/roles_list'

import Title from '../../components/Title'
import Sidebar from './Sidebar'

const TicketDetails = ({ ticket, setRefresh }) => {
  const { auth } = useAuth()
  const isMobile = useMobile()

  const isAdmin = auth.currentRole === ROLES_LIST.admin

  return (
    <>
      <Title
        title='Support Ticket'
        hasButton={false}
        hasRefreshButton={false}
      />

      <div className='mb-6 flex items-start justify-center space-x-6 lg:block lg:space-x-0 lg:space-y-4'>
        <div className='sticky top-[5.5rem] w-full max-w-xs space-y-2 lg:static lg:max-w-none'>
          <Sidebar ticket={ticket} setRefresh={setRefresh} />
        </div>

        <div className='max-w-4xl flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:max-w-none'>
          <h3>{ticket.subject}</h3>
        </div>
      </div>
    </>
  )
}

export default TicketDetails
