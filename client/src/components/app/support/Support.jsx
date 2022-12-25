import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import LoadingScreen from '../../utils/LoadingScreen'

const Support = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

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
        // const { data } = await axiosPrivate.post(
        //   '/api/private/users',
        //   {
        //     labId: auth.currentLabId,
        //   },
        //   {
        //     signal: controller.signal,
        //   }
        // )
        if (isMounted) {
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

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title
        title='Support'
        hasButton={true}
        hasRefreshButton={true}
        buttonText='Open New Ticket'
        buttonAction={() => navigate('/support/new-ticket')}
        setRefresh={setRefresh}
      />
    </>
  )
}

export default Support
