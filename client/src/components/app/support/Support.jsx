import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TicketIcon } from '@heroicons/react/outline'

import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useMobile from '../../../hooks/useMobile'
import LoadingScreen from '../../utils/LoadingScreen'

import Title from '../components/Title'
import Overview from './components/Overview'
import TicketsTable from './components/TicketsTable'

const Support = () => {
  const isMobile = useMobile()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const TabLabels = !isMobile
    ? ['Active Tickets', 'Resolved Tickets']
    : ['Active', 'Resolved']

  const [activeTickets, setActiveTickets] = useState([])
  const [resolvedTickets, setResolvedTickets] = useState([])

  const [isResolved, setIsResolved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getTickets = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/support/tickets', {
          signal: controller.signal,
        })
        if (isMounted) {
          setActiveTickets(data.tickets.active)
          setResolvedTickets(data.tickets.resolved)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getTickets()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, refresh])

  const openNewTicket = () => navigate('/support/new-ticket')

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title
        title='Support'
        hasButton={!isMobile}
        hasRefreshButton={true}
        buttonText='Open New Ticket'
        buttonAction={openNewTicket}
        setRefresh={setRefresh}
      />

      <Overview allTickets={[...activeTickets, ...resolvedTickets]} />

      <div className='mb-6 border-b border-gray-200 font-medium text-gray-500 lg:mb-4'>
        <ul className='-mb-px flex flex-wrap space-x-6'>
          {TabLabels.map((label, index) => (
            <li
              key={index}
              className={`inline-block border-b-2 pb-2 ${
                !!index === isResolved
                  ? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
                  : 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsResolved((prev) => !prev)}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      <TicketsTable
        tickets={isResolved ? resolvedTickets : activeTickets}
        isResolved={isResolved}
      />

      {isMobile && (
        <button
          className='button button-solid fixed bottom-2 right-2 z-10 -translate-y-12 justify-center py-2 shadow-md'
          onClick={openNewTicket}
        >
          <TicketIcon className='-ml-1 mr-1.5 h-5 w-5' />
          New Ticket
        </button>
      )}
    </>
  )
}

export default Support
