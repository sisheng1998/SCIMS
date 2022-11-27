import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'
import { ArrowLeftIcon, LogoutIcon } from '@heroicons/react/outline'
import LoadingScreen from '../utils/LoadingScreen'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import PersonalSection from './profile/PersonalSection'

const ProfileUpdate = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const logout = useLogout()

  const axiosPrivate = useAxiosPrivate()
  const [user, setUser] = useState('')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getUserProfile = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/private/profile', {
          signal: controller.signal,
        })
        if (isMounted) {
          setUser(data.user)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getUserProfile()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, refresh])

  return isLoading ? (
    <div className='auth-card mt-8'>
      <LoadingScreen />
    </div>
  ) : (
    <>
      <h1 className='my-6 text-center'>Update Your Profile</h1>

      <div className='auth-card'>
        <div className='mb-6'>
          <p
            onClick={() => navigate('/pending-approval')}
            className='inline-flex cursor-pointer items-center font-semibold text-indigo-600 transition hover:text-indigo-700'
          >
            <ArrowLeftIcon className='mr-1 h-4 w-4' />
            Return
          </p>
        </div>

        <PersonalSection user={user} setRefresh={setRefresh} />
      </div>

      <p className='mt-6 text-center'>
        <span
          onClick={logout}
          className='inline-flex cursor-pointer items-center font-semibold text-indigo-600 transition hover:text-indigo-700'
        >
          <LogoutIcon className='mr-1 h-5 w-5' />
          Logout
        </span>
      </p>
    </>
  )
}

export default ProfileUpdate
