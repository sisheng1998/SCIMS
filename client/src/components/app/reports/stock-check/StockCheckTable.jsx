import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../../components/SortData'
import SortButton from '../../components/SortButton'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import FormatDate from '../../../utils/FormatDate'
import { useNavigate } from 'react-router-dom'
import StockCheckOverview from './StockCheckOverview'

const tableHeaders = [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
  },
  {
    key: 'overview',
    label: 'Stock Check Overview',
    sortable: false,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'action',
    label: 'Action',
    sortable: false,
  },
]

const StockCheckTable = (props) => {
  const navigate = useNavigate()

  const today = new Date()
  const past = new Date(new Date().setDate(today.getDate() - 30))

  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterTerms, setFilterTerms] = useState({
    status: '',
    period: {
      option: '',
      startDate: past.toLocaleDateString('en-CA'),
      endDate: today.toLocaleDateString('en-CA'),
    },
  })

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: props.data,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm: '',
        searchCols: ['date'],
        filterTerms,
      }),
    [props.data, sortKey, sortOrder, filterTerms]
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
  }, [itemsPerPage, filterTerms])

  return (
    <>
      <Filters
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        results={results}
        searchTerm=''
        hideSearch={true}
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

          <p className='ml-6'>Status</p>
          <select
            className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
            name='statusFilter'
            id='statusFilter'
            value={filterTerms.status}
            onChange={(e) =>
              setFilterTerms((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value=''>Any</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
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
                  currentItems.map((report) => {
                    let classes

                    if (report.status === 'Completed') {
                      classes = 'bg-green-100 text-green-600'
                    } else {
                      // In Progress
                      classes = 'bg-yellow-100 text-yellow-600'
                    }

                    return (
                      <tr className='hover:bg-indigo-50/30' key={report._id}>
                        <td className='px-6 py-4'>{FormatDate(report.date)}</td>

                        <td className='px-6 py-4'>
                          <StockCheckOverview report={report} />
                        </td>

                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
                          >
                            {report.status}
                          </span>
                        </td>

                        <td className='px-6 py-4'>
                          <button
                            onClick={() => navigate(`/reports/${report._id}`)}
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

export default StockCheckTable
