import React, { useCallback, useState, useEffect } from 'react'
import ROLES_LIST from '../../../config/roles_list'
import useAuth from '../../../hooks/useAuth'
import SortData from '../components/SortData'
import SortButton from '../components/SortButton'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import EditUserModal from './EditUserModal'
import UserApprovalModal from './UserApprovalModal'
import GetLetterPicture from '../../utils/GetLetterPicture'
import ImageLightBox from '../../utils/ImageLightBox'
import FILE_PATH from '../../../config/file_path'

const tableHeaders = [
  {
    key: 'matricNo',
    label: 'Matric/Staff No.',
    sortable: true,
  },
  {
    key: 'name',
    label: 'User',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
  },
  {
    key: 'action',
    label: 'Action',
    sortable: false,
  },
]

const UsersTable = (props) => {
  const { auth } = useAuth()

  const [userData, setUserData] = useState('')
  const [avatarInfo, setAvatarInfo] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [openEditUserModal, setOpenEditUserModal] = useState(false)
  const [openUserApprovalModal, setOpenUserApprovalModal] = useState(false)
  const [openViewImageModal, setOpenViewImageModal] = useState(false)

  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerms, setFilterTerms] = useState({
    status: '',
    role: '',
  })

  useEffect(() => {
    setSortKey('index')
    setSortOrder('asc')
  }, [auth])

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: props.data,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: ['name', 'email'],
        filterTerms,
      }),
    [props.data, sortKey, sortOrder, searchTerm, filterTerms]
  )

  const changeSortOrder = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')

      if (sortOrder === 'desc') {
        return setSortKey('index')
      }
    }
    setSortKey(key)
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  let indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const results = sortedData()

  if (indexOfLastItem > results.length) {
    indexOfLastItem = results.length
  }

  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage, searchTerm, filterTerms])

  const editUserHandler = (userData, isEdit) => {
    setUserData(userData)
    setIsEdit(isEdit)

    if (isEdit && userData.status === 'Pending') {
      setOpenUserApprovalModal(true)
    } else {
      setOpenEditUserModal(true)
    }
  }

  const viewImageHandler = (name, imageSrc) => {
    setAvatarInfo({ name, imageSrc })
    setOpenViewImageModal(true)
  }

  return (
    <>
      <Filters
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        results={results}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder='Name / Email'
      >
        <div className='mx-6 flex items-center'>
          <p>Filter</p>

          <select
            className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
            name='statusFilter'
            id='statusFilter'
            value={filterTerms.status}
            onChange={(e) =>
              setFilterTerms((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value=''>Any Status</option>
            <option value='active'>Active</option>
            <option value='pending'>Pending</option>
            <option value='deactivated'>Deactivated</option>
          </select>

          <select
            className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
            name='roleFilter'
            id='roleFilter'
            value={filterTerms.role}
            onChange={(e) =>
              setFilterTerms((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            <option value=''>Any Role</option>
            <option value='admin'>Admin</option>
            <option value='lab owner'>Lab Owner</option>
            <option value='postgraduate'>Postgraduate</option>
            <option value='undergraduate'>Undergraduate</option>
            <option value='guest'>Guest</option>
          </select>
        </div>
      </Filters>

      <div className='mb-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
        <div className='overflow-x-auto'>
          <div className='border-b border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
              <thead className='bg-gray-50'>
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      scope='col'
                      key={header.key}
                      className='px-6 py-3 text-left font-medium text-gray-500'
                    >
                      {header.sortable ? (
                        <SortButton
                          columnKey={header.key}
                          onClick={() => changeSortOrder(header.key)}
                          {...{ sortOrder, sortKey }}
                        >
                          {header.label}
                        </SortButton>
                      ) : (
                        header.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 bg-white'>
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      className='px-6 py-4 text-center'
                      colSpan={tableHeaders.length}
                    >
                      No record found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((user) => {
                    const imageSrc = user.avatar
                      ? FILE_PATH.avatars + user.avatar
                      : GetLetterPicture(user.name)

                    let classes

                    if (user.status === 'Active') {
                      classes = 'bg-green-100 text-green-600'
                    } else if (user.status === 'Pending') {
                      classes = 'bg-yellow-100 text-yellow-600'
                    } else {
                      // Deactivated
                      classes = 'bg-red-100 text-red-600'
                    }

                    return (
                      <tr className='hover:bg-indigo-50/30' key={user._id}>
                        <td className='px-6 py-4'>{user.matricNo}</td>

                        <td className='px-6 py-4'>
                          <div className='flex w-max items-center space-x-3'>
                            <img
                              onError={(event) =>
                                (event.target.src = GetLetterPicture(user.name))
                              }
                              src={imageSrc}
                              alt='Avatar'
                              className='h-12 w-12 cursor-pointer rounded-full object-cover'
                              height='64'
                              width='64'
                              draggable={false}
                              onClick={() =>
                                viewImageHandler(user.name, imageSrc)
                              }
                            />

                            <div>
                              <p className='font-medium leading-5'>
                                {user.name}
                                {auth.email.toLowerCase() ===
                                  user.email.toLowerCase() && (
                                  <span className='ml-1.5 text-sm text-indigo-600'>
                                    (You)
                                  </span>
                                )}
                              </p>
                              <p className='text-sm leading-4 text-gray-400'>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 capitalize'>{user.role}</td>
                        <td className='px-6 py-4 text-center'>
                          {auth.currentRole >= ROLES_LIST.labOwner ? (
                            auth.email === user.email ||
                            user.roleValue >= ROLES_LIST.labOwner ||
                            user.isProfileNotCompleted ? (
                              <button
                                onClick={() => editUserHandler(user, false)}
                                className='flex font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                              >
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => editUserHandler(user, true)}
                                className='flex font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                              >
                                Edit
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => editUserHandler(user, false)}
                              className='flex font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination
        filterTerms={filterTerms}
        searchTerm={searchTerm}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={results.length}
        paginate={paginate}
      />

      {openEditUserModal && userData && (
        <EditUserModal
          user={userData}
          isEdit={isEdit}
          openModal={openEditUserModal}
          setOpenModal={setOpenEditUserModal}
          setEditUserSuccess={props.setEditUserSuccess}
        />
      )}

      {openUserApprovalModal && userData && (
        <UserApprovalModal
          user={userData}
          openModal={openUserApprovalModal}
          setOpenModal={setOpenUserApprovalModal}
          setUserApprovalSuccess={props.setEditUserSuccess}
        />
      )}

      {openViewImageModal && avatarInfo && (
        <ImageLightBox
          object={avatarInfo}
          type='Avatar'
          openModal={openViewImageModal}
          setOpenModal={setOpenViewImageModal}
        />
      )}
    </>
  )
}

export default UsersTable
