import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

const applicationKey =
	'BANL8KjFuxD9hS61IIwI9GSbsVR-_3mhCXGyfuYi54BX-VGKePa7sFRdkI3MrUkmnAZbisIwKqF5gtkwlQQASZo'

// Url encryption
const urlB64ToUint8Array = (base64String) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

const NotificationSection = ({ subscriber }) => {
	const axiosPrivate = useAxiosPrivate()
	const [subscribed, setSubscribed] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
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

		Notification.requestPermission().then((result) => {
			if (result === 'granted') {
				navigator.serviceWorker.ready.then((registration) => {
					registration.pushManager
						.subscribe({
							userVisibleOnly: true,
							applicationServerKey: urlB64ToUint8Array(applicationKey),
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
			} else {
				setErrorMessage('Kindly allow the permission to receive notifications.')
			}
		})
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
