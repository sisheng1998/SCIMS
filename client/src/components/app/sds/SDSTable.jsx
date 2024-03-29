import React, { useCallback, useState, useEffect } from 'react'
import SortData from '../components/SortData'
import SortButton from '../components/SortButton'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import {
  CLASSIFICATION_LIST,
  CLASSIFICATION_ICON,
  COC_LIST,
  COC_DESCRIPTION,
} from '../../../config/safety_security_list'
import EditSDSModal from './EditSDSModal'
import ViewSDSModal from './ViewSDSModal'
import DeleteSDSModal from './DeleteSDSModal'
import { FromNow, DateTime } from '../../utils/FormatDate'
import useMobile from '../../../hooks/useMobile'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import FILE_PATH from '../../../config/file_path'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'

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
    key: 'classifications',
    label: 'Classifications',
    sortable: false,
  },
  {
    key: 'COCs',
    label: 'Chemical of Concerns',
    sortable: false,
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

const SDSTable = ({ SDS, setRefresh }) => {
  const { auth } = useAuth()
  const isMobile = useMobile()

  const [openEditSDSModal, setOpenEditSDSModal] = useState(false)
  const [openViewSDSModal, setOpenViewSDSModal] = useState(false)
  const [openDeleteSDSModal, setOpenDeleteSDSModal] = useState(false)
  const [CAS, setCAS] = useState('')

  const [sortKey, setSortKey] = useState('index')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTerms, setFilterTerms] = useState({
    classifications: '',
    COCs: '',
  })

  const sortedData = useCallback(
    () =>
      SortData({
        tableData: SDS,
        sortKey,
        reverse: sortOrder === 'desc',
        searchTerm,
        searchCols: ['CASNo', 'chemicalName'],
        filterTerms,
      }),
    [SDS, sortKey, sortOrder, searchTerm, filterTerms]
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

  const editSDSHandler = (CAS) => {
    setCAS(CAS)
    setOpenEditSDSModal(true)
  }

  const viewSDSHandler = (CAS) => {
    setCAS(CAS)
    setOpenViewSDSModal(true)
  }

  const deleteSDSHandler = (CAS) => {
    setCAS(CAS)
    setOpenDeleteSDSModal(true)
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
        {!isMobile && (
          <div className='mx-6 flex items-center lg:ml-4 lg:mr-0'>
            <p>Filter</p>

            <select
              className='ml-2 p-1 pl-2 pr-8 text-sm text-gray-700'
              name='classificationFilter'
              id='classificationFilter'
              value={filterTerms.classifications}
              onChange={(e) =>
                setFilterTerms((prev) => ({
                  ...prev,
                  classifications: e.target.value,
                }))
              }
            >
              <option value=''>Any Classification</option>
              {CLASSIFICATION_LIST.map((classification, index) => (
                <option key={index} value={classification}>
                  {classification}
                </option>
              ))}
              <option value='-'>No Classification</option>
            </select>

            <select
              className='ml-2 max-w-xs p-1 pl-2 pr-8 text-sm text-gray-700'
              name='COCFilter'
              id='COCFilter'
              value={filterTerms.COCs}
              onChange={(e) =>
                setFilterTerms((prev) => ({ ...prev, COCs: e.target.value }))
              }
            >
              <option value=''>Any Chemical of Concern</option>
              {COC_LIST.map((COC, index) => (
                <option key={index} value={COC}>
                  {index !== COC_DESCRIPTION.length - 1
                    ? `${COC_DESCRIPTION[index]} (${COC})`
                    : COC}
                </option>
              ))}
              <option value='-'>No Chemical of Concern</option>
            </select>
          </div>
        )}
      </Filters>

      {isMobile ? (
        <>
          {currentItems.length === 0 ? (
            <div className='mb-4 rounded-lg bg-white p-4 text-center shadow'>
              No record found.
            </div>
          ) : (
            currentItems.map((CAS) => (
              <div
                key={CAS._id}
                className='mb-4 rounded-lg bg-white p-4 text-sm shadow'
              >
                {(CAS.SDSs.en === 'No SDS' || CAS.SDSs.bm === 'No SDS') && (
                  <p className='mb-2 flex items-center text-xs font-medium text-red-600'>
                    <ExclamationCircleIcon className='mr-1.5 inline-block h-4 w-4 shrink-0 stroke-2' />{' '}
                    {CAS.SDSs.en === 'No SDS' && CAS.SDSs.bm === 'No SDS'
                      ? 'SDS - EN / BM not found'
                      : CAS.SDSs.en === 'No SDS'
                      ? 'SDS - EN not found'
                      : 'SDS - BM not found'}
                  </p>
                )}

                <div className='flex items-start justify-between space-x-4'>
                  <div>
                    <p className='text-lg font-medium leading-6 text-gray-900'>
                      {CAS.CASNo}
                    </p>
                    <p className='text-gray-500'>{CAS.chemicalName}</p>
                  </div>

                  <div className='shrink-0 space-x-1.5'>
                    {CAS.SDSs.en !== 'No SDS' && (
                      <a
                        href={FILE_PATH.SDSs.en + CAS.SDSs.en}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                      >
                        EN
                      </a>
                    )}

                    {CAS.SDSs.en !== 'No SDS' && CAS.SDSs.bm !== 'No SDS' && (
                      <span>|</span>
                    )}

                    {CAS.SDSs.bm !== 'No SDS' && (
                      <a
                        href={FILE_PATH.SDSs.bm + CAS.SDSs.bm}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                      >
                        BM
                      </a>
                    )}
                  </div>
                </div>

                {CAS.classifications.length === 0 &&
                CAS.COCs.length === 0 ? null : (
                  <div className='-mb-2 mt-4 space-y-2 text-xs'>
                    <div className='empty:hidden'>
                      {CAS.classifications.length !== 0
                        ? CLASSIFICATION_LIST.map(
                            (classification, index) =>
                              CAS.classifications.includes(classification) && (
                                <span
                                  key={index}
                                  className='tooltip mb-2 mr-2 inline-flex h-12 w-12'
                                  data-tooltip={classification}
                                >
                                  <img
                                    className='flex-1'
                                    src={CLASSIFICATION_ICON[index]}
                                    alt='GHS Classifications'
                                  />
                                </span>
                              )
                          )
                        : null}
                    </div>

                    <div className='empty:hidden'>
                      {CAS.COCs.length !== 0
                        ? COC_LIST.map(
                            (security, index) =>
                              CAS.COCs.includes(security) && (
                                <span
                                  key={index}
                                  className={`mb-2 mr-2 inline-flex rounded-full bg-red-100 px-3 py-1 font-medium text-red-600 ${
                                    security !== 'Other' ? 'tooltip' : ''
                                  }`}
                                  data-tooltip={COC_DESCRIPTION[index]}
                                >
                                  {security}
                                </span>
                              )
                          )
                        : null}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </>
      ) : (
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
                        colSpan={tableHeaders.length}
                      >
                        No record found.
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((CAS) => (
                      <tr className='hover:bg-indigo-50/30' key={CAS._id}>
                        <td className='px-6 py-4'>
                          {CAS.CASNo}
                          {(CAS.SDSs.en === 'No SDS' ||
                            CAS.SDSs.bm === 'No SDS') && (
                            <span
                              className='tooltip ml-1.5'
                              data-tooltip={
                                CAS.SDSs.en === 'No SDS' &&
                                CAS.SDSs.bm === 'No SDS'
                                  ? 'SDS - EN / BM not found'
                                  : CAS.SDSs.en === 'No SDS'
                                  ? 'SDS - EN not found'
                                  : 'SDS - BM not found'
                              }
                            >
                              <ExclamationCircleIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
                            </span>
                          )}
                        </td>

                        <td className='px-6 py-4'>{CAS.chemicalName}</td>

                        <td className='flex items-center space-x-2 px-6 py-4'>
                          {CAS.classifications.length !== 0
                            ? CLASSIFICATION_LIST.map(
                                (classification, index) =>
                                  CAS.classifications.includes(
                                    classification
                                  ) && (
                                    <span
                                      key={index}
                                      className='tooltip inline-flex h-14 w-14'
                                      data-tooltip={classification}
                                    >
                                      <img
                                        className='flex-1'
                                        src={CLASSIFICATION_ICON[index]}
                                        alt='GHS Classifications'
                                      />
                                    </span>
                                  )
                              )
                            : '-'}
                        </td>

                        <td className='space-x-2 px-6 py-4'>
                          {CAS.COCs.length !== 0
                            ? COC_LIST.map(
                                (security, index) =>
                                  CAS.COCs.includes(security) && (
                                    <span
                                      key={index}
                                      className={`inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600 ${
                                        security !== 'Other' ? 'tooltip' : ''
                                      }`}
                                      data-tooltip={COC_DESCRIPTION[index]}
                                    >
                                      {security}
                                    </span>
                                  )
                              )
                            : '-'}
                        </td>

                        <td className='px-6 py-4'>
                          <span
                            className='tooltip'
                            data-tooltip={DateTime(CAS.lastUpdated)}
                          >
                            {FromNow(CAS.lastUpdated)}
                          </span>
                        </td>

                        <td className='space-x-1 px-6 py-4'>
                          <button
                            onClick={() => viewSDSHandler(CAS)}
                            className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                          >
                            View
                          </button>
                          <span>/</span>
                          <button
                            onClick={() => editSDSHandler(CAS)}
                            className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                          >
                            Edit
                          </button>

                          {auth.currentRole === ROLES_LIST.admin && (
                            <>
                              <span>/</span>
                              <button
                                onClick={() => deleteSDSHandler(CAS)}
                                className='inline font-medium text-red-600 transition hover:text-red-700 focus:outline-none'
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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

      {CAS && openEditSDSModal && (
        <EditSDSModal
          CAS={CAS}
          openModal={openEditSDSModal}
          setOpenModal={setOpenEditSDSModal}
          setEditSDSSuccess={setRefresh}
        />
      )}

      {CAS && openViewSDSModal && (
        <ViewSDSModal
          CAS={CAS}
          openModal={openViewSDSModal}
          setOpenModal={setOpenViewSDSModal}
        />
      )}

      {CAS && openDeleteSDSModal && (
        <DeleteSDSModal
          CAS={CAS}
          openModal={openDeleteSDSModal}
          setOpenModal={setOpenDeleteSDSModal}
          setDeleteSDSSuccess={setRefresh}
        />
      )}
    </>
  )
}

export default SDSTable
