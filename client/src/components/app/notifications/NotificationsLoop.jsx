import React, { useState } from 'react'
import NotificationCard from './NotificationCard'
import NoNotification from './NoNotification'

const numberOfNotifications = 5

const NotificationsLoop = ({ notifications }) => {
  const [amount, setAmount] = useState(numberOfNotifications)

  return (
    <>
      {notifications.length !== 0 ? (
        <div className='space-y-4'>
          {notifications.slice(0, amount).map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      ) : (
        <NoNotification />
      )}

      {notifications.length > amount && (
        <button
          onClick={() => setAmount((prev) => prev + numberOfNotifications)}
          className='button button-outline mt-6 w-40 justify-center py-3'
        >
          Load More
        </button>
      )}
    </>
  )
}

export default NotificationsLoop
