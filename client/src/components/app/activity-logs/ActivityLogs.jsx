import React, { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import Title from '../components/Title'
import ActivityLogsTable from './ActivityLogsTable'

const ActivityLogs = () => {
  const { auth } = useAuth()

  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const [info, setInfo] = useState([])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getInfo = async () => {
      try {
        const { data } = await axiosPrivate.put(
          '/api/private/activity-logs',
          { labId: auth.currentLabId },
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          const processedData = data.data
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((log, index) => {
              return {
                ...log,
                type: log.usage !== undefined ? 'Usage' : 'Activity',
                userName: log.user.name,
                userEmail: log.user.email,
                index,
              }
            })

          setInfo(processedData)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getInfo()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, auth.currentLabId])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title title='Activity Logs' hasButton={false} hasRefreshButton={false} />
      <ActivityLogsTable data={info} />
    </>
  )
}

export default ActivityLogs
