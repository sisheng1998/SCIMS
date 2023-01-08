import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../../../components/SortData'
import SortButton from '../../../components/SortButton'
import Filters from '../../../components/Filters'
import Pagination from '../../../components/Pagination'
import { FromNow, DateTime } from '../../../../utils/FormatDate'
import FormatBytes from '../../../../utils/FormatBytes'
import BACKUP_TYPE from '../../../../../config/backup_type'
import ActionMenu from './ActionMenu'

const tableHeaders = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
  },
  {
    key: 'type',
    label: 'Type',
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

const BackupsTable = ({ backups }) => {
  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerms, setFilterTerms] = useState({
    type: '',
  })

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: backups,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: ['name'],
        filterTerms,
      }),
    [backups, sortKey, sortOrder, searchTerm, filterTerms]
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
      >
        <div className='mx-6 flex items-center lg:ml-4 lg:mr-0'>
          <p>Type</p>

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
            <option value={BACKUP_TYPE.auto}>{BACKUP_TYPE.auto}</option>
            <option value={BACKUP_TYPE.manual}>{BACKUP_TYPE.manual}</option>
          </select>
        </div>
      </Filters>

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
                currentItems.map((backup, index) => {
                  let classes

                  if (backup.type === BACKUP_TYPE.auto) {
                    classes = 'bg-blue-100 text-blue-600'
                  } else {
                    // Manual
                    classes = 'bg-yellow-100 text-yellow-600'
                  }

                  return (
                    <tr key={index} className='hover:bg-indigo-50/30'>
                      <td className='px-6 py-4'>{backup.name}</td>

                      <td className='px-6 py-4'>
                        <span
                          className='tooltip'
                          data-tooltip={DateTime(backup.date)}
                        >
                          {FromNow(backup.date)}
                        </span>
                      </td>

                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
                        >
                          {backup.type}
                        </span>
                      </td>

                      <td className='px-6 py-4'>{FormatBytes(backup.size)}</td>

                      <td className='px-6 py-4 text-center align-middle'>
                        <ActionMenu name={backup.name} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
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
    </>
  )
}

export default BackupsTable
