import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import useAuth from '../../../hooks/useAuth'
import NotificationsLoop from './NotificationsLoop'
import NoNotification from './NoNotification'

const Notifications = () => {
  const axiosPrivate = useAxiosPrivate()
  const { setAuth } = useAuth()

  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getNotifications = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/private/notifications', {
          signal: controller.signal,
        })

        if (isMounted) {
          setNotifications(data.data)

          setAuth((prev) => {
            return {
              ...prev,
              notification: false,
            }
          })
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getNotifications()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, setAuth])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <div className='mb-6 w-full max-w-2xl self-center'>
      <Title title='Notifications' hasButton={false} hasRefreshButton={false} />

      {notifications.length === 0 ? (
        <NoNotification />
      ) : (
        <NotificationsLoop notifications={notifications} />
      )}
    </div>
  )
}

export default Notifications
