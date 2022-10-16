import React, { useState, useEffect } from 'react'
import AddUserModal from './AddUserModal'
import Title from '../components/Title'
import UsersTable from './UsersTable'
import AllUsersTable from './AllUsersTable'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import GetRoleName from '../../utils/GetRoleName'
import ROLES_LIST from '../../../config/roles_list'
import LoadingScreen from '../../utils/LoadingScreen'

const Users = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const isAllLabs = auth.currentLabId === 'All Labs'

  const [usersData, setUsersData] = useState('')
  const [otherUsers, setOtherUsers] = useState('')
  const [labsData, setLabsData] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [openAddUserModal, setOpenAddUserModal] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getUsers = async () => {
      try {
        const { data } = await axiosPrivate.post(
          '/api/private/users',
          {
            labId: auth.currentLabId,
          },
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          if (isAllLabs) {
            setLabsData(data.data.labs)

            const processedData = data.data.users.map((user, index) => {
              const userRoles = user.roles.filter((role) =>
                data.data.labs.some((lab) => lab._id === role.lab._id)
              )

              return {
                ...user,
                roles: userRoles,
                index,
              }
            })

            setUsersData(processedData)
          } else {
            data.data.labUsers.unshift(data.data.labOwner)
            const processedData = data.data.labUsers
              .reverse()
              .map((user, index) => {
                const currentRole = user.roles.find((role) => {
                  return role.lab === data.data._id
                })

                return {
                  ...user,
                  index,
                  role: GetRoleName(currentRole.role),
                  roleValue: currentRole.role,
                  status: currentRole.status,
                }
              })
            // LabUsers array
            setUsersData(processedData)

            // Get all existing users that are not in the current lab - for lab owner or admin to add existing user to their lab
            if (data.otherUsers) {
              setOtherUsers(data.otherUsers)
            }
          }

          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getUsers()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, auth.currentLabId, refresh, isAllLabs])

  return isLoading ? (
    <LoadingScreen />
  ) : isAllLabs ? (
    <>
      <Title
        title='All Users'
        hasButton={false}
        hasRefreshButton={true}
        setRefresh={setRefresh}
      />

      <AllUsersTable data={usersData} labs={labsData} />
    </>
  ) : (
    <>
      <Title
        title='All Users'
        hasButton={auth.currentRole >= ROLES_LIST.labOwner}
        hasRefreshButton={true}
        buttonText='Add User'
        buttonAction={() => setOpenAddUserModal(true)}
        setRefresh={setRefresh}
      />

      <UsersTable data={usersData} setEditUserSuccess={setRefresh} />

      {openAddUserModal &&
        otherUsers &&
        auth.currentRole >= ROLES_LIST.labOwner && (
          <AddUserModal
            otherUsers={otherUsers}
            openModal={openAddUserModal}
            setOpenModal={setOpenAddUserModal}
            setAddUserSuccess={setRefresh}
          />
        )}
    </>
  )
}

export default Users
