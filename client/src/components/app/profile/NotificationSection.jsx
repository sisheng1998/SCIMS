import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import APPLICATION_KEY from '../../../config/mobile_push_notification'
import UrlB64ToUint8Array from '../../utils/UrlB64ToUnit8Array'

const NotificationSection = ({ subscriber }) => {
  const axiosPrivate = useAxiosPrivate()
  const [subscribed, setSubscribed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isNavigatorSupported, setIsNavigatorSupported] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return
    }

    setIsNavigatorSupported(true)

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager
        .getSubscription()
        .then(
          (subscription) =>
            subscription &&
            subscriber &&
            setSubscribed(subscription.endpoint === subscriber.endpoint)
        )
    })
  }, [subscriber])

  const subscribe = () => {
    setErrorMessage('')

    const subscribeToPushNotification = () => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: UrlB64ToUint8Array(APPLICATION_KEY),
          })
          .then(async (subscription) => {
            const { data } = await axiosPrivate.post(
              '/api/subscribe',
              subscription
            )
            setSubscribed(data.success)
          })
          .catch(() =>
            setErrorMessage('Something went wrong. Please try again later.')
          )
      })
    }

    if (Notification.permission === 'granted') {
      subscribeToPushNotification()
    } else {
      if (Notification.permission === 'denied') {
        setErrorMessage('Kindly allow the permission to receive notifications.')
        return
      }

      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          subscribeToPushNotification()
        } else {
          setErrorMessage(
            'Kindly allow the permission to receive notifications.'
          )
        }
      })
    }
  }

  const unsubscribe = () => {
    setErrorMessage('')

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        subscription
          .unsubscribe()
          .then(async () => {
            const { data } = await axiosPrivate.delete('/api/subscribe')
            setSubscribed(!data.success)
          })
          .catch(() =>
            setErrorMessage('Something went wrong. Please try again later.')
          )
      })
    })
  }

  return (
    <>
      {isNavigatorSupported && (
        <div className='mt-6 flex items-center justify-between space-x-4 border-t border-gray-200 pt-4'>
          <p className='text-sm font-medium'>Mobile Push Notification</p>
          <label className='mb-0 inline-block' htmlFor='subscribe'>
            <input
              type='checkbox'
              className='peer hidden'
              id='subscribe'
              onChange={() => (subscribed ? unsubscribe() : subscribe())}
              checked={subscribed}
            />
            <span className='relative flex before:h-5 before:w-9 before:rounded-full before:bg-gray-300 before:transition after:absolute after:top-1/2 after:left-0 after:ml-0.5 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition before:peer-checked:bg-indigo-600 after:peer-checked:translate-x-full'></span>
          </label>
        </div>
      )}

      {errorMessage && (
        <p className='mt-2 flex items-center text-xs font-medium text-red-600'>
          <ExclamationCircleIcon className='mr-1.5 h-4 w-4 shrink-0 stroke-2' />{' '}
          {errorMessage}
        </p>
      )}
    </>
  )
}

export default NotificationSection
