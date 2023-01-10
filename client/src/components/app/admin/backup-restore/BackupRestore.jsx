import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import Title from '../../components/Title'
import ActionButtons from './components/ActionButtons'
import BackupsTable from './components/BackupsTable'
import DeleteBackupModal from './components/DeleteBackupModal'

const BackupRestore = () => {
  const axiosPrivate = useAxiosPrivate()

  const [backups, setBackups] = useState([])
  const [backup, setBackup] = useState({
    name: '',
    type: '',
  })
  const [openDeleteBackupModal, setOpenDeleteBackupModal] = useState(false)

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

    const getBackups = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/admin/backups', {
          signal: controller.signal,
        })
        if (isMounted) {
          setBackups(data.backups)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getBackups()

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
        title='Backup / Restore'
        hasButton={false}
        hasRefreshButton={false}
      >
        <ActionButtons setRefresh={setRefresh} />
      </Title>

      <BackupsTable
        backups={backups}
        setBackup={setBackup}
        setOpenDeleteBackupModal={setOpenDeleteBackupModal}
      />

      {openDeleteBackupModal && backup.name !== '' && backup.type !== '' && (
        <DeleteBackupModal
          backup={backup}
          setBackup={setBackup}
          openModal={openDeleteBackupModal}
          setOpenModal={setOpenDeleteBackupModal}
          setRefresh={setRefresh}
        />
      )}
    </>
  )
}

export default BackupRestore
