import React, { useState } from 'react'
import ChangeEmailModal from './ChangeEmailModal'
import ChangePasswordModal from './ChangePasswordModal'
import NotificationSection from './NotificationSection'
import useMobile from '../../../hooks/useMobile'
import LogoutModal from './LogoutModal'

const AccountSection = ({ user, subscriber }) => {
  const isMobile = useMobile()

  const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false)
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)
  const [openLogoutModal, setOpenLogoutModal] = useState(false)

  return (
    <>
      <div className='w-full max-w-lg'>
        <div className='flex items-end justify-between'>
          <label htmlFor='email'>
            Email Address
            <span
              className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                user.isEmailVerified
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {user.isEmailVerified ? 'Verified' : 'Not Verified'}
            </span>
          </label>
          <button
            className='mb-2 text-right text-sm font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
            onClick={() => setOpenChangeEmailModal(true)}
          >
            Change Email
          </button>
        </div>
        <input
          className='mb-6 w-full'
          type='text'
          name='email'
          id='email'
          readOnly
          value={user.email}
        />
      </div>

      <label htmlFor='password' className='mb-1'>
        Password
      </label>
      <button
        className='button button-outline w-60 justify-center px-4 py-3'
        onClick={() => setOpenChangePasswordModal(true)}
      >
        Change Password
      </button>

      <label htmlFor='sessions' className='mt-6 mb-1'>
        Sessions
      </label>
      <button
        className='button button-outline w-60 justify-center px-4 py-3'
        onClick={() => setOpenLogoutModal(true)}
      >
        Logout On All Devices
      </button>
      <p className='mt-2 text-xs text-gray-400'>
        Force logout your account on all devices that are currently logged in.
      </p>

      {isMobile && <NotificationSection subscriber={subscriber} />}

      {openChangePasswordModal && (
        <ChangePasswordModal
          openModal={openChangePasswordModal}
          setOpenModal={setOpenChangePasswordModal}
        />
      )}

      {openChangeEmailModal && (
        <ChangeEmailModal
          user={user}
          openModal={openChangeEmailModal}
          setOpenModal={setOpenChangeEmailModal}
        />
      )}

      {openLogoutModal && (
        <LogoutModal
          openModal={openLogoutModal}
          setOpenModal={setOpenLogoutModal}
        />
      )}
    </>
  )
}

export default AccountSection
