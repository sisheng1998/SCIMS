import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { XIcon, ExclamationIcon } from '@heroicons/react/outline'

import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import useMobile from '../../../hooks/useMobile'

import LoadingScreen from '../../utils/LoadingScreen'
import ROLES_LIST from '../../../config/roles_list'

import TicketDetails from './components/TicketDetails'

const ID_REGEX = /^[a-f\d]{24}$/i

const Ticket = () => {
  const isMobile = useMobile()
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const params = useParams()

  const [ticket, setTicket] = useState('')

  const [success, setSuccess] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const isMasquerading = auth.isAdmin && auth.currentRole !== ROLES_LIST.admin

  useEffect(() => {
    if (!ID_REGEX.test(params.ticketId)) {
      setSuccess(false)
      setInvalid(true)
      setNotFound(false)
      setUnauthorized(false)
      setIsLoading(false)
      return
    }

    if (refresh) {
      setRefresh(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getTicketDetails = async () => {
      try {
        const { data } = await axiosPrivate.get(
          `/api/support/ticket/${params.ticketId}`,
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          const ticket = data.ticket

          if (isMasquerading && ticket.user._id !== auth.id) {
            setInvalid(false)
            setUnauthorized(true)
            setNotFound(false)
            setSuccess(false)
          } else {
            setTicket(ticket)
            setSuccess(true)
          }

          setIsLoading(false)
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setInvalid(false)
          setUnauthorized(false)
          setNotFound(true)
          setSuccess(false)
          setIsLoading(false)
        } else if (error.response?.status === 401) {
          setInvalid(false)
          setUnauthorized(true)
          setNotFound(false)
          setSuccess(false)
          setIsLoading(false)
        }
      }
    }

    getTicketDetails()

    return () => {
      isMounted = false
      controller.abort()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, axiosPrivate, refresh, isMasquerading])

  return isLoading ? (
    <LoadingScreen />
  ) : success && ticket !== '' ? (
    <TicketDetails ticket={ticket} setRefresh={setRefresh} />
  ) : (
    <>
      {invalid && (
        <div
          className={`auth-card self-center text-center ${
            isMobile ? 'mb-6' : 'mt-6'
          }`}
        >
          <XIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />
          <h2 className='mt-6 mb-2 text-red-600'>Invalid Link</h2>
          <p>The link of the ticket is invalid.</p>
          <p className='mt-6 text-sm'>
            Back to <Link to='/support'>Support</Link>
          </p>
        </div>
      )}

      {notFound && (
        <div
          className={`auth-card self-center text-center ${
            isMobile ? 'mb-6' : 'mt-6'
          }`}
        >
          <ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
          <h2 className='mt-6 mb-2 text-yellow-600'>Ticket Not Found</h2>
          <p>The ticket does not exist.</p>
          <p className='mt-6 text-sm'>
            Back to <Link to='/support'>Support</Link>
          </p>
        </div>
      )}

      {unauthorized && (
        <div
          className={`auth-card self-center text-center ${
            isMobile ? 'mb-6' : 'mt-6'
          }`}
        >
          <ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
          <h2 className='mt-6 mb-2 text-yellow-600'>Unauthorized</h2>
          <p>You are not allowed to view the details of the ticket.</p>
          <p className='mt-6 text-sm'>
            Back to <Link to='/support'>Support</Link>
          </p>
        </div>
      )}
    </>
  )
}

export default Ticket
