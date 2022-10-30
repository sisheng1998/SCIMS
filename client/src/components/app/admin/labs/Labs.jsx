import React, { useState, useEffect } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import Title from '../../components/Title'
import LabsTable from './LabsTable'
import AddLabModal from './AddLabModal'

const Labs = () => {
  const axiosPrivate = useAxiosPrivate()
  const [labsData, setLabsData] = useState('')
  const [users, setUsers] = useState([])
  const [openAddLabModal, setOpenAddLabModal] = useState(false)

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

    const getLabs = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/admin/labs', {
          signal: controller.signal,
        })
        if (isMounted) {
          const processedLabData = data.labs.reverse().map((lab, index) => ({
            ...lab,
            index,
            ownerName: lab.labOwner.name,
            ownerEmail: lab.labOwner.email,
            admins: data.admins,
          }))
          setLabsData(processedLabData)

          const processedUserData = data.users.filter(
            (user) => !user.email.includes('@student.usm.my')
          )
          setUsers(processedUserData)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getLabs()

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
        title='All Labs'
        hasButton={true}
        hasRefreshButton={true}
        buttonText='Add Lab'
        buttonAction={() => setOpenAddLabModal(true)}
        setRefresh={setRefresh}
      />
      <LabsTable data={labsData} users={users} />
      {openAddLabModal && users && (
        <AddLabModal
          users={users}
          openModal={openAddLabModal}
          setOpenModal={setOpenAddLabModal}
        />
      )}
    </>
  )
}

export default Labs
