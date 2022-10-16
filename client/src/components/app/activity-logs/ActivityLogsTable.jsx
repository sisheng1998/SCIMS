import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../components/SortData'
import SortButton from '../components/SortButton'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import ImageLightBox from '../../utils/ImageLightBox'
import useAuth from '../../../hooks/useAuth'
import GetLetterPicture from '../../utils/GetLetterPicture'
import FormatDate from '../../utils/FormatDate'
import FormatAmountWithUnit from '../../utils/FormatAmountWithUnit'
import { useNavigate } from 'react-router-dom'
import ChangelogModal from './ChangelogModal'
import ImportLogModal from './ImportLogModal'

const tableHeaders = [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
  },
  {
    key: 'userName',
    label: 'User',
    sortable: true,
  },
  {
    key: 'description',
    label: 'Description',
    sortable: false,
  },
]

const ActivityLogsTable = (props) => {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [avatarInfo, setAvatarInfo] = useState('')
  const [openViewImageModal, setOpenViewImageModal] = useState(false)

  const [changelogInfo, setChangelogInfo] = useState('')
  const [openChangelogModal, setOpenChangelogModal] = useState(false)

  const [importLogInfo, setImportLogInfo] = useState('')
  const [openImportLogModal, setOpenImportLogModal] = useState(false)

  const today = new Date()
  const past = new Date(new Date().setDate(today.getDate() - 30))

  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerms, setFilterTerms] = useState({
    period: {
      option: '',
      startDate: past.toLocaleDateString('en-CA'),
      endDate: today.toLocaleDateString('en-CA'),
    },
    type: '',
  })

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: props.data,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: ['userName', 'userEmail'],
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

  const viewImageHandler = (name, imageSrc) => {
    setAvatarInfo({ name, imageSrc })
    setOpenViewImageModal(true)
  }

  const viewChangelogHandler = (changelog, date) => {
    setChangelogInfo({ changelog, date })
    setOpenChangelogModal(true)
  }

  const viewImportLogHandler = (results, date) => {
    setImportLogInfo({ results, date })
    setOpenImportLogModal(true)
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
          <p>Period</p>
          <select
            className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
            name='periodFilter'
            id='periodFilter'
            value={filterTerms.period.option}
            onChange={(e) =>
              setFilterTerms((prev) => ({
                ...prev,
                period: { ...prev.period, option: e.target.value },
              }))
            }
          >
            <option value=''>Any</option>
            <option value='thisMonth'>This Month</option>
            <option value='lastMonth'>Last Month</option>
            <option value='custom'>Custom</option>
          </select>

          {filterTerms.period.option === 'custom' && (
            <>
              <p className='ml-4 mr-2'>Range</p>
              <input
                className='p-1 px-2 text-sm text-gray-700'
                type='date'
                name='startDate'
                id='startDate'
                max={today.toLocaleDateString('en-CA')}
                value={filterTerms.period.startDate}
                onChange={(e) =>
                  setFilterTerms((prev) => ({
                    ...prev,
                    period: { ...prev.period, startDate: e.target.value },
                  }))
                }
              />
              <p className='mx-2'>→</p>
              <input
                className='p-1 px-2 text-sm text-gray-700'
                type='date'
                name='endDate'
                id='endDate'
                max={today.toLocaleDateString('en-CA')}
                value={filterTerms.period.endDate}
                onChange={(e) =>
                  setFilterTerms((prev) => ({
                    ...prev,
                    period: { ...prev.period, endDate: e.target.value },
                  }))
                }
              />
            </>
          )}

          <p className='ml-6'>Type</p>
          <select
            className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
            name='typeFilter'
            id='typeFilter'
            value={filterTerms.type}
            onChange={(e) =>
              setFilterTerms((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
          >
            <option value=''>Any</option>
            <option value='Usage'>Usage</option>
            <option value='Activity'>Others</option>
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
                  currentItems.map((log) => {
                    const imageSrc = log.user.avatar
                      ? auth.avatarPath + log.user.avatar
                      : GetLetterPicture(log.userName)

                    return (
                      <tr className='hover:bg-indigo-50/30' key={log._id}>
                        <td className='px-6 py-4'>{FormatDate(log.date)}</td>

                        <td className='px-6 py-4'>
                          <div className='flex w-max items-center space-x-3'>
                            <img
                              onError={(event) =>
                                (event.target.src = GetLetterPicture(
                                  log.userName
                                ))
                              }
                              src={imageSrc}
                              alt='Avatar'
                              className='h-12 w-12 cursor-pointer rounded-full object-cover'
                              height='64'
                              width='64'
                              draggable={false}
                              onClick={() =>
                                viewImageHandler(log.userName, imageSrc)
                              }
                            />

                            <div>
                              <p className='font-medium leading-5'>
                                {log.userName}
                                {auth.email.toLowerCase() ===
                                  log.userEmail.toLowerCase() && (
                                  <span className='ml-1.5 text-sm text-indigo-600'>
                                    (You)
                                  </span>
                                )}
                              </p>
                              <p className='text-sm leading-4 text-gray-400'>
                                {log.userEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className='px-6 py-4'>
                          {log.type === 'Usage' ? (
                            <p>
                              Amount of chemical used
                              <span className='ml-1.5 text-sm'>
                                (
                                <span
                                  onClick={() =>
                                    navigate(`/inventory/${log.chemical._id}`)
                                  }
                                  className='inline cursor-pointer font-medium text-indigo-600 transition hover:text-indigo-700'
                                >
                                  {log.chemical.name}
                                </span>
                                )
                              </span>
                              :
                              <span className='ml-1.5 font-medium'>
                                {FormatAmountWithUnit(log.usage, log.unit)}
                              </span>
                              <span className='ml-1.5 text-sm text-gray-500'>
                                ({log.originalAmount} →{' '}
                                {FormatAmountWithUnit(
                                  log.originalAmount - log.usage,
                                  log.unit
                                )}
                                )
                              </span>
                              {log.remark && (
                                <span className='block text-sm leading-4 text-gray-400'>
                                  *{log.remark}
                                </span>
                              )}
                            </p>
                          ) : (
                            <p>
                              {log.description}

                              {log.chemical && (
                                <span className='ml-1.5 text-sm'>
                                  (
                                  <span
                                    onClick={() =>
                                      navigate(`/inventory/${log.chemical._id}`)
                                    }
                                    className='inline cursor-pointer font-medium text-indigo-600 transition hover:text-indigo-700'
                                  >
                                    {log.chemical.name}
                                  </span>
                                  )
                                </span>
                              )}

                              {log.changes && (
                                <span className='ml-1.5 text-sm'>
                                  -
                                  <span
                                    onClick={() =>
                                      viewChangelogHandler(
                                        log.changes,
                                        FormatDate(log.date)
                                      )
                                    }
                                    className='ml-1.5 inline cursor-pointer font-medium text-indigo-600 transition hover:text-indigo-700'
                                  >
                                    View Changelog
                                  </span>
                                </span>
                              )}

                              {log.importLog && (
                                <span className='ml-1.5 text-sm'>
                                  -
                                  <span
                                    onClick={() =>
                                      viewImportLogHandler(
                                        log.importLog,
                                        FormatDate(log.date)
                                      )
                                    }
                                    className='ml-1.5 inline cursor-pointer font-medium text-indigo-600 transition hover:text-indigo-700'
                                  >
                                    View Import Log
                                  </span>
                                </span>
                              )}
                            </p>
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

      {openViewImageModal && avatarInfo && (
        <ImageLightBox
          object={avatarInfo}
          type='Avatar'
          openModal={openViewImageModal}
          setOpenModal={setOpenViewImageModal}
        />
      )}

      {openChangelogModal && changelogInfo && (
        <ChangelogModal
          info={changelogInfo}
          openModal={openChangelogModal}
          setOpenModal={setOpenChangelogModal}
        />
      )}

      {openImportLogModal && importLogInfo && (
        <ImportLogModal
          info={importLogInfo}
          openModal={openImportLogModal}
          setOpenModal={setOpenImportLogModal}
        />
      )}
    </>
  )
}

export default ActivityLogsTable
