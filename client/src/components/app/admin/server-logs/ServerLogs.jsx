import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import Title from '../../components/Title'
import ServerLogsTable from './components/ServerLogsTable'
import ServerLogModal from './components/ServerLogModal'
import DeleteServerLogModal from './components/DeleteServerLogModal'

const ServerLogs = () => {
  const axiosPrivate = useAxiosPrivate()

  const [serverLogs, setServerLogs] = useState([])
  const [filename, setFilename] = useState('')
  const [openServerLogModal, setOpenServerLogModal] = useState(false)
  const [openDeleteServerLogModal, setOpenDeleteServerLogModal] =
    useState(false)

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

    const getServerLogs = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/admin/server-logs', {
          signal: controller.signal,
        })
        if (isMounted) {
          setServerLogs(data.serverLogs)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getServerLogs()

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
        title='Server Logs'
        hasButton={false}
        hasRefreshButton={true}
        setRefresh={setRefresh}
      />

      <ServerLogsTable
        serverLogs={serverLogs}
        setFilename={setFilename}
        setOpenServerLogModal={setOpenServerLogModal}
        setOpenDeleteServerLogModal={setOpenDeleteServerLogModal}
      />

      {openServerLogModal && filename !== '' && (
        <ServerLogModal
          filename={filename}
          setFilename={setFilename}
          openModal={openServerLogModal}
          setOpenModal={setOpenServerLogModal}
          setRefresh={setRefresh}
        />
      )}

      {openDeleteServerLogModal && filename !== '' && (
        <DeleteServerLogModal
          filename={filename}
          setFilename={setFilename}
          openModal={openDeleteServerLogModal}
          setOpenModal={setOpenDeleteServerLogModal}
          setRefresh={setRefresh}
        />
      )}
    </>
  )
}

export default ServerLogs
