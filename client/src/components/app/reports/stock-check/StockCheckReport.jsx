import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../hooks/useAuth'
import LoadingScreen from '../../../utils/LoadingScreen'
import { useParams, Link } from 'react-router-dom'
import {
  XIcon,
  ExclamationIcon,
  RefreshIcon,
  CheckIcon,
} from '@heroicons/react/outline'
import ReportDetails from './ReportDetails'
import ReportTable from './ReportTable'
import ConfirmationModal from './ConfirmationModal'
import ROLES_LIST from '../../../../config/roles_list'

const ID_REGEX = /^[a-f\d]{24}$/i

const TabLabels = [
  'Recorded Chemicals',
  'Missing Chemicals',
  'KIV Chemicals',
  'Disposed Chemicals',
]

const StockCheckReport = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const params = useParams()

  const [activeTab, setActiveTab] = useState('Tab0')
  const [report, setReport] = useState([])
  const [locations, setLocations] = useState('')

  const [success, setSuccess] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      return
    }

    if (!ID_REGEX.test(params.reportId)) {
      setSuccess(false)
      setInvalid(true)
      setNotFound(false)
      setIsLoading(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getReport = async () => {
      try {
        const { data } = await axiosPrivate.put(
          `/api/private/reports/${params.reportId}`,
          {
            labId: auth.currentLabId,
          },
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          const allChemicals = [
            ...data.data.recordedChemicals,
            ...data.data.missingChemicals,
            ...data.data.kivChemicals,
            ...data.data.disposedChemicals,
          ]

          const locations = [
            ...new Set(allChemicals.map((chemical) => chemical.location)),
          ]

          setLocations(locations)
          setReport(data.data)

          setSuccess(true)
          setIsLoading(false)
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setInvalid(false)
          setNotFound(true)
          setSuccess(false)
          setIsLoading(false)
        }
      }
    }

    getReport()

    return () => {
      isMounted = false
      controller.abort()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, axiosPrivate, refresh])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      {success ? (
        <>
          <Title
            title='Stock Check Report'
            titleTag={
              <span
                className={`ml-2 inline-flex self-start rounded-full px-3 py-1 text-sm font-medium ${
                  report.status === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {report.status}
              </span>
            }
          >
            {report.status !== 'Completed' && (
              <div className='flex items-center space-x-4'>
                {auth.currentRole >= ROLES_LIST.labOwner && (
                  <button
                    onClick={() => setOpenConfirmationModal(true)}
                    className='button button-green-outline'
                  >
                    <CheckIcon className='-ml-0.5 mr-1 h-4 w-4 stroke-2' />
                    Mark as Completed
                  </button>
                )}

                <button
                  onClick={() => setRefresh(true)}
                  className='button button-outline lg:py-1.5'
                >
                  <RefreshIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
                  Refresh
                </button>
              </div>
            )}
          </Title>

          <p className='mb-2 font-medium text-gray-500'>Report Overview</p>
          <ReportDetails report={report} />

          <div className='mb-6 border-b border-gray-200 font-medium text-gray-500'>
            <ul className='-mb-px flex flex-wrap space-x-6'>
              {TabLabels.map((label, index) => (
                <li
                  key={index}
                  className={`inline-block border-b-2 pb-2 ${
                    activeTab === 'Tab' + index
                      ? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
                      : 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('Tab' + index)}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {activeTab === 'Tab0' && (
            <ReportTable
              chemicals={report.recordedChemicals}
              locations={locations}
              type='Recorded'
            />
          )}

          {activeTab === 'Tab1' && (
            <ReportTable
              chemicals={report.missingChemicals}
              locations={locations}
              type='Missing'
            />
          )}

          {activeTab === 'Tab2' && (
            <ReportTable
              chemicals={report.kivChemicals}
              locations={locations}
              type='KIV'
            />
          )}

          {activeTab === 'Tab3' && (
            <ReportTable
              chemicals={report.disposedChemicals}
              locations={locations}
              type='Disposed'
            />
          )}

          {openConfirmationModal && (
            <ConfirmationModal
              reportId={params.reportId}
              openModal={openConfirmationModal}
              setOpenModal={setOpenConfirmationModal}
              setRefresh={setRefresh}
            />
          )}
        </>
      ) : (
        <>
          {invalid && (
            <div className='auth-card mt-6 self-center text-center'>
              <XIcon className='mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600' />
              <h2 className='mt-6 mb-2 text-red-600'>Invalid Link</h2>
              <p>The link is invalid.</p>
              <p className='mt-6 text-sm'>
                Back to <Link to='/reports'>Reports</Link>
              </p>
            </div>
          )}

          {notFound && (
            <div className='auth-card mt-6 self-center text-center'>
              <ExclamationIcon className='mx-auto h-16 w-16 rounded-full bg-yellow-100 p-2 text-yellow-600' />
              <h2 className='mt-6 mb-2 text-yellow-600'>Report Not Found</h2>
              <p>The report does not exist in this lab.</p>
              <p className='mt-6 text-sm'>
                Back to <Link to='/reports'>Reports</Link>
              </p>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default StockCheckReport
