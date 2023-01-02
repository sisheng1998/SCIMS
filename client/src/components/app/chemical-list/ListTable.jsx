import React, { useCallback, useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import SortData from '../components/SortData'
import SortButton from '../components/SortButton'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import { ExclamationIcon } from '@heroicons/react/outline'
import ViewSDSModal from '../sds/ViewSDSModal'

const ListTable = ({ chemicals, disposedChemicals }) => {
  const { auth } = useAuth()

  const [viewDisposedChemicals, setViewDisposedChemicals] = useState(false)

  const [openViewSDSModal, setOpenViewSDSModal] = useState(false)
  const [CAS, setCAS] = useState('')

  const tableHeaders = [
    {
      key: 'CASNo',
      label: 'CAS No.',
      sortable: true,
    },
    {
      key: 'chemicalName',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'state',
      label: 'State',
      sortable: true,
    },
    {
      key: 'storageClass',
      label: 'Storage Class',
      sortable: true,
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
    },
  ]

  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerms, setFilterTerms] = useState({
    state: '',
  })

  useEffect(() => {
    setSortKey('index')
    setSortOrder('asc')
  }, [auth])

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: viewDisposedChemicals ? disposedChemicals : chemicals,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: ['CASNo', 'chemicalName'],
        filterTerms,
      }),
    [
      viewDisposedChemicals,
      chemicals,
      disposedChemicals,
      sortKey,
      sortOrder,
      searchTerm,
      filterTerms,
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
  }, [itemsPerPage, searchTerm, filterTerms, viewDisposedChemicals])

  let indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const results = sortedData()

  if (indexOfLastItem > results.length) {
    indexOfLastItem = results.length
  }

  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const viewSDSHandler = (CAS) => {
    setCAS(CAS)
    setOpenViewSDSModal(true)
  }

  return (
    <>
      <Filters
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        results={results}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder='CAS No. / Name'
      >
        <div className='mx-6 flex items-center lg:ml-4 lg:mr-0'>
          <p>Filter</p>

          <select
            className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
            name='stateFilter'
            id='stateFilter'
            value={filterTerms.state}
            onChange={(e) =>
              setFilterTerms((prev) => ({ ...prev, state: e.target.value }))
            }
          >
            <option value=''>Any State</option>
            <option value='Solid'>Solid</option>
            <option value='Liquid'>Liquid</option>
            <option value='Gas'>Gas</option>
          </select>
        </div>

        {disposedChemicals.length !== 0 && (
          <label
            className='mb-0 mr-6 flex cursor-pointer items-center whitespace-nowrap font-normal lg:mr-0 lg:mt-4'
            htmlFor='showDisposedChemicals'
          >
            Disposed Chemicals
            <input
              type='checkbox'
              className='peer hidden'
              id='showDisposedChemicals'
              onChange={() => setViewDisposedChemicals((prev) => !prev)}
            />
            <span className='relative flex before:ml-2 before:h-5 before:w-9 before:rounded-full before:bg-gray-300 before:transition after:absolute after:top-1/2 after:left-0 after:ml-2.5 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition before:peer-checked:bg-indigo-600 after:peer-checked:translate-x-full'></span>
          </label>
        )}
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
                  currentItems.map((chemical) => {
                    let classes

                    if (chemical.state === 'Gas') {
                      classes = 'bg-green-100 text-green-600'
                    } else if (chemical.state === 'Liquid') {
                      classes = 'bg-blue-100 text-blue-600'
                    } else {
                      // Solid
                      classes = 'bg-yellow-100 text-yellow-600'
                    }

                    return (
                      <tr className='hover:bg-indigo-50/30' key={chemical._id}>
                        <td className='px-6 py-4'>
                          <p
                            onClick={() => viewSDSHandler(chemical.CASInfo)}
                            className='cursor-pointer transition hover:text-indigo-600'
                          >
                            {chemical.CASNo}
                            {chemical.COCs.length !== 0 && (
                              <span
                                className='tooltip ml-1.5 cursor-pointer'
                                data-tooltip='Chemical of Concerns'
                              >
                                <ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
                              </span>
                            )}
                          </p>
                        </td>

                        <td className='px-6 py-4'>{chemical.chemicalName}</td>

                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
                          >
                            {chemical.state}
                          </span>
                        </td>

                        <td className='px-6 py-4'>
                          {chemical.storageClass ? chemical.storageClass : '-'}
                        </td>

                        <td className='px-6 py-4'>{chemical.quantity}</td>
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

      {CAS && openViewSDSModal && (
        <ViewSDSModal
          CAS={CAS}
          fromInventory={true}
          openModal={openViewSDSModal}
          setOpenModal={setOpenViewSDSModal}
        />
      )}
    </>
  )
}

export default ListTable
