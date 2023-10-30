import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../../components/SortData'
import SortButton from '../../components/SortButton'
import Filters from '../../components/Filters'
import Pagination from '../../components/Pagination'
import { useNavigate } from 'react-router-dom'
import { NormalSorting } from './SortChemicals'
// import { ExclamationIcon } from '@heroicons/react/outline'
import FormatAmountWithUnit from '../../../utils/FormatAmountWithUnit'
import FILE_PATH from '../../../../config/file_path'
import GetLetterPicture from '../../../utils/GetLetterPicture'
import useAuth from '../../../../hooks/useAuth'
import ImageLightBox from '../../../utils/ImageLightBox'

const ReportTable = ({ chemicals, locations, type }) => {
  const { auth } = useAuth()
  const [avatarInfo, setAvatarInfo] = useState('')
  const [openViewImageModal, setOpenViewImageModal] = useState(false)

  // let processedData

  // if (type === 'Recorded') {
  //   processedData = SortChemicals(chemicals)
  // } else {
  //   processedData = NormalSorting(chemicals)
  // }

  const processedData = NormalSorting(chemicals)

  const navigate = useNavigate()

  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerms, setFilterTerms] = useState({
    location: '',
    amount: '',
  })

  const tableHeaders = [
    {
      key: 'CASNo',
      label: 'CAS No.',
      sortable: true,
      hide: false,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      hide: false,
    },
    {
      key: 'location',
      label: type === 'Disposed' ? 'Previous Location' : 'Location',
      sortable: true,
      hide: false,
    },
    // {
    //   key: 'amount',
    //   label: 'Recorded Amount',
    //   sortable: false,
    //   hide: type !== 'Recorded',
    // },
    {
      key: 'amountInDB',
      // label: type === 'Recorded' ? 'Actual Amount' : 'Amount',
      label: 'Amount',
      sortable: false,
      hide: false,
    },
    {
      key: 'recordedBy',
      label: 'Recorded By',
      sortable: false,
      hide: type !== 'Recorded',
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      hide: false,
    },
  ]

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: processedData,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: ['CASNo', 'name'],
        filterTerms,
      }),
    [processedData, sortKey, sortOrder, searchTerm, filterTerms]
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
        searchPlaceholder='CAS No. / Name'
      >
        <div className='mx-6 flex items-center'>
          <p>Filter</p>

          <select
            className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
            name='locationFilter'
            id='locationFilter'
            value={filterTerms.location}
            onChange={(e) =>
              setFilterTerms((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          >
            <option value=''>Any Location</option>
            {locations
              .filter((location) => location !== '-')
              .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
              .map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            <option value='-'>No Location</option>
          </select>

          {/* {type === 'Recorded' && (
            <select
              className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
              name='amountFilter'
              id='amountFilter'
              value={filterTerms.amount}
              onChange={(e) =>
                setFilterTerms((prev) => ({ ...prev, amount: e.target.value }))
              }
            >
              <option value=''>Any Condition</option>
              <option value='=='>Amount Matched</option>
              <option value='!='>Amount Mismatched</option>
            </select>
          )} */}
        </div>
      </Filters>

      <div className='mb-5 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 pb-3 shadow'>
        <div className='overflow-x-auto'>
          <div className='border-b border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
              <thead className='bg-gray-50'>
                <tr>
                  {tableHeaders.map(
                    (header) =>
                      !header.hide && (
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
                      )
                  )}
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 bg-white'>
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      className='px-6 py-4 text-center'
                      colSpan={
                        type === 'Recorded'
                          ? tableHeaders.length
                          : tableHeaders.length - 1
                      }
                    >
                      No record found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((chemical) => {
                    const imageSrc =
                      type === 'Recorded'
                        ? chemical.recordedBy.avatar
                          ? FILE_PATH.avatars + chemical.recordedBy.avatar
                          : GetLetterPicture(chemical.recordedBy.name)
                        : ''

                    return (
                      <tr
                        className='hover:bg-indigo-50/30'
                        key={chemical.chemicalId}
                      >
                        <td className='px-6 py-4'>{chemical.CASNo}</td>
                        <td className='px-6 py-4'>{chemical.name}</td>
                        <td className='px-6 py-4'>{chemical.location}</td>
                        {/* {type === 'Recorded' && (
                          <td className='px-6 py-4'>
                            {FormatAmountWithUnit(
                              chemical.amount,
                              chemical.unit
                            )}

                            {chemical.amount !== chemical.amountInDB && (
                              <span
                                className='tooltip ml-1.5'
                                data-tooltip={`The actual amount is ${FormatAmountWithUnit(
                                  chemical.amountInDB,
                                  chemical.unit
                                )}`}
                              >
                                <ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
                              </span>
                            )}
                          </td>
                        )} */}
                        <td className='px-6 py-4'>
                          {FormatAmountWithUnit(
                            chemical.amountInDB,
                            chemical.unit
                          )}
                        </td>

                        {type === 'Recorded' && (
                          <td className='px-6 py-4'>
                            <div className='flex w-max items-center space-x-3'>
                              <img
                                onError={(event) =>
                                  (event.target.src = GetLetterPicture(
                                    chemical.recordedBy.name
                                  ))
                                }
                                src={imageSrc}
                                alt='Avatar'
                                className='h-12 w-12 cursor-pointer rounded-full object-cover'
                                height='64'
                                width='64'
                                draggable={false}
                                onClick={() =>
                                  viewImageHandler(
                                    chemical.recordedBy.name,
                                    imageSrc
                                  )
                                }
                              />

                              <div>
                                <p className='font-medium leading-5'>
                                  {chemical.recordedBy.name}
                                  {auth.email.toLowerCase() ===
                                    chemical.recordedBy.email.toLowerCase() && (
                                    <span className='ml-1.5 text-sm text-indigo-600'>
                                      (You)
                                    </span>
                                  )}
                                </p>
                                <p className='text-sm leading-4 text-gray-400'>
                                  {chemical.recordedBy.email}
                                </p>
                              </div>
                            </div>
                          </td>
                        )}

                        <td className='px-6 py-4'>
                          <button
                            onClick={() =>
                              navigate(`/inventory/${chemical.chemicalId}`)
                            }
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

export default ReportTable
