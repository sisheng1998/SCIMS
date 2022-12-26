import React, { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import useMobile from '../../../../hooks/useMobile'
import SortData from '../../components/SortData'
import SortButton from '../../components/SortButton'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import { FromNow, DateTime } from '../../../utils/FormatDate'
import GetLetterPicture from '../../../utils/GetLetterPicture'
import ImageLightBox from '../../../utils/ImageLightBox'
import ROLES_LIST from '../../../../config/roles_list'

const tableHeaders = [
  {
    key: 'subject',
    label: 'Subject',
    sortable: true,
  },
  {
    key: 'userName',
    label: 'User',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'lastUpdated',
    label: 'Last Updated',
    sortable: true,
  },
  {
    key: 'action',
    label: 'Action',
    sortable: false,
  },
]

const TicketsTable = ({ tickets, isResolved }) => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMobile()

  const [avatarInfo, setAvatarInfo] = useState('')
  const [openViewImageModal, setOpenViewImageModal] = useState(false)

  const isAdmin = auth.currentRole === ROLES_LIST.admin
  const isMasquerading = auth.isAdmin && auth.currentRole !== ROLES_LIST.admin

  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerms, setFilterTerms] = useState({
    status: '',
  })

  useEffect(() => {
    setSortKey('index')
    setSortOrder('asc')
  }, [auth])

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: isMasquerading
          ? tickets.filter((ticket) => ticket.user._id === auth.id)
          : tickets,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: isAdmin
          ? ['_id', 'subject', 'userName', 'userEmail']
          : ['_id', 'subject'],
        filterTerms,
      }),
    [
      tickets,
      sortKey,
      sortOrder,
      searchTerm,
      filterTerms,
      isAdmin,
      isMasquerading,
      auth.id,
    ]
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

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage, searchTerm, filterTerms])

  useEffect(() => {
    setItemsPerPage(10)
    setSortKey('index')
    setSortOrder('asc')
    setSearchTerm('')
    setFilterTerms({
      status: '',
    })
  }, [isResolved, isAdmin])

  let indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const results = sortedData()

  if (indexOfLastItem > results.length) {
    indexOfLastItem = results.length
  }

  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
        searchPlaceholder={`Subject${isAdmin ? ' / User' : ''}`}
      >
        {!isMobile && !isResolved && (
          <div className='mx-6 flex items-center lg:ml-4 lg:mr-0'>
            <p>Status</p>

            <select
              className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
              name='statusFilter'
              id='statusFilter'
              value={filterTerms.status}
              onChange={(e) =>
                setFilterTerms((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option value=''>Any</option>
              <option value='Open'>Open</option>
              <option value='In Progress'>In Progress</option>
            </select>
          </div>
        )}
      </Filters>

      <div className='mb-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
        <div className='overflow-x-auto'>
          <div className='border-b border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
              <thead className='bg-gray-50'>
                <tr>
                  {tableHeaders.map((header) =>
                    header.label !== 'User' || isAdmin ? (
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
                    ) : null
                  )}
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
                  currentItems.map((ticket) => {
                    const imageSrc = ticket.user.avatar
                      ? auth.avatarPath + ticket.user.avatar
                      : GetLetterPicture(ticket.userName)

                    let classes

                    if (ticket.status === 'Resolved') {
                      classes = 'bg-green-100 text-green-600'
                    } else if (ticket.status === 'Open') {
                      classes = 'bg-blue-100 text-blue-600'
                    } else {
                      // In Progress
                      classes = 'bg-yellow-100 text-yellow-600'
                    }

                    return (
                      <tr className='hover:bg-indigo-50/30' key={ticket._id}>
                        <td
                          className={`max-w-[32rem] px-6 py-4 ${
                            isAdmin ? '2xl:max-w-sm xl:max-w-[12rem]' : ''
                          }`}
                        >
                          <p className='truncate font-medium'>
                            {ticket.subject}
                          </p>
                          <p className='truncate text-sm text-gray-400'>
                            {ticket._id}
                          </p>
                        </td>

                        {isAdmin && (
                          <td className='px-6 py-4'>
                            <div className='flex w-max items-center space-x-3'>
                              <img
                                onError={(event) =>
                                  (event.target.src = GetLetterPicture(
                                    ticket.userName
                                  ))
                                }
                                src={imageSrc}
                                alt='Avatar'
                                className='h-12 w-12 cursor-pointer rounded-full object-cover'
                                height='64'
                                width='64'
                                draggable={false}
                                onClick={() =>
                                  viewImageHandler(ticket.userName, imageSrc)
                                }
                              />

                              <div>
                                <p className='font-medium leading-5'>
                                  {ticket.userName}
                                  {auth.email.toLowerCase() ===
                                    ticket.userEmail.toLowerCase() && (
                                    <span className='ml-1.5 text-sm text-indigo-600'>
                                      (You)
                                    </span>
                                  )}
                                </p>
                                <p className='text-sm leading-4 text-gray-400'>
                                  {ticket.userEmail}
                                </p>
                              </div>
                            </div>
                          </td>
                        )}

                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
                          >
                            {ticket.status}
                          </span>
                        </td>

                        <td className='px-6 py-4'>
                          <span
                            className='tooltip'
                            data-tooltip={DateTime(ticket.lastUpdated)}
                          >
                            {FromNow(ticket.lastUpdated)}
                          </span>
                        </td>

                        <td className='px-6 py-4'>
                          <button
                            onClick={() => navigate(`/support/${ticket._id}`)}
                            className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                          >
                            View
                          </button>
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

export default TicketsTable
