import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import SystemConfigSection from './SystemConfigSection'
import EmailConfigSection from './EmailConfigSection'

const Settings = () => {
  const axiosPrivate = useAxiosPrivate()
  const [settings, setSettings] = useState('')

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

    const getSettings = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/admin/settings', {
          signal: controller.signal,
        })
        if (isMounted) {
          setSettings(data.settings)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getSettings()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, refresh])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title title='Settings' hasButton={false} hasRefreshButton={false} />

      <div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
        <div className='w-full max-w-md 2xl:max-w-xs xl:max-w-full'>
          <h4>System Configuration</h4>
          <p className='text-sm text-gray-500'>
            Settings that applied to the whole system.
          </p>
        </div>

        <SystemConfigSection settings={settings} setEditSuccess={setRefresh} />
      </div>

      <hr className='mb-6 mt-9 border-gray-200' />

      <div className='mb-6 flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
        <div className='w-full max-w-md 2xl:max-w-xs xl:max-w-full'>
          <h4>Email Configuration</h4>
          <p className='text-sm text-gray-500'>
            Settings for sending email with gmail.
          </p>
        </div>

        <EmailConfigSection settings={settings} setEditSuccess={setRefresh} />
      </div>
    </>
  )
}

export default Settings
