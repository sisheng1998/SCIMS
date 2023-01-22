import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../../../components/SortData'
import SortButton from '../../../components/SortButton'
import Filters from '../../../components/Filters'
import Pagination from '../../../components/Pagination'
import FormatDate, { FromNow, DateTime } from '../../../../utils/FormatDate'
import FormatBytes from '../../../../utils/FormatBytes'
import ActionMenu from './ActionMenu'

const tableHeaders = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'createdAt',
    label: 'Created At',
    sortable: true,
  },
  {
    key: 'lastUpdated',
    label: 'Last Updated',
    sortable: true,
  },
  {
    key: 'size',
    label: 'Size',
    sortable: true,
  },
  {
    key: 'action',
    label: '',
    sortable: false,
  },
]

const ServerLogsTable = ({
  serverLogs,
  setFilename,
  setOpenServerLogModal,
  setOpenDeleteServerLogModal,
}) => {
  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: serverLogs,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: ['name'],
        filterTerms: {},
      }),
    [serverLogs, sortKey, sortOrder, searchTerm]
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
  }, [itemsPerPage, searchTerm])

  let indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const results = sortedData()

  if (indexOfLastItem > results.length) {
    indexOfLastItem = results.length
  }

  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <Filters
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        results={results}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder='Name'
      />

      <div className='mb-5 rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
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
                currentItems.map((log, index) => (
                  <tr key={index} className='hover:bg-indigo-50/30'>
                    <td className='px-6 py-4'>{log.name}</td>

                    <td className='px-6 py-4'>{FormatDate(log.createdAt)}</td>

                    <td className='px-6 py-4'>
                      <span
                        className='tooltip'
                        data-tooltip={DateTime(log.lastUpdated)}
                      >
                        {FromNow(log.lastUpdated)}
                      </span>
                    </td>

                    <td className='px-6 py-4'>{FormatBytes(log.size)}</td>

                    <td className='px-6 py-4 text-center align-middle'>
                      <ActionMenu
                        name={log.name}
                        setFilename={setFilename}
                        setOpenServerLogModal={setOpenServerLogModal}
                        setOpenDeleteServerLogModal={
                          setOpenDeleteServerLogModal
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        filterTerms={{}}
        searchTerm={searchTerm}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={results.length}
        paginate={paginate}
      />
    </>
  )
}

export default ServerLogsTable
