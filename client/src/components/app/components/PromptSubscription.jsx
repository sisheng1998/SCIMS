import { useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import APPLICATION_KEY from '../../../config/mobile_push_notification'
import UrlB64ToUint8Array from '../../utils/UrlB64ToUnit8Array'

const PromptSubscription = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const subscriber = auth.subscriber
  const isUnsubscribed = auth.isUnsubscribed

  useEffect(() => {
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      isUnsubscribed
    ) {
      return
    }

    const controller = new AbortController()

    const subscribe = () => {
      const subscribeToPushNotification = () => {
        navigator.serviceWorker.ready.then((registration) => {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: UrlB64ToUint8Array(APPLICATION_KEY),
            })
            .then(async (subscription) => {
              await axiosPrivate.post('/api/subscribe', subscription, {
                signal: controller.signal,
              })
            })
            .catch(() => {})
        })
      }

      if (Notification.permission === 'granted') {
        subscribeToPushNotification()
      } else {
        if (Notification.permission === 'denied') {
          return
        }

        Notification.requestPermission().then((result) => {
          if (result === 'granted') {
            subscribeToPushNotification()
          }
        })
      }
    }

    if (subscriber) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          if (
            !(
              subscription &&
              subscriber &&
              subscription.endpoint === subscriber.endpoint
            )
          ) {
            subscribe()
          }
        })
      })
    } else {
      subscribe()
    }

    return () => controller.abort()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default PromptSubscription
