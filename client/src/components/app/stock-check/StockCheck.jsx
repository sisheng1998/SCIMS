import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import {
  ExclamationIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import Procedure from './Procedure'
import ProcedureModal from './ProcedureModal'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import ActionCard from './ActionCard'
import ScanQRCodeModal from '../components/ScanQRCodeModal'
import AddRecordModal from './AddRecordModal'
import ChemicalsLoop from './ChemicalsLoop'
import ROLES_LIST from '../../../config/roles_list'
import ConfirmationModal from '../reports/stock-check/ConfirmationModal'
import StartStockCheckButton from './StartStockCheckButton'

const StockCheck = () => {
  const { auth, setAuth } = useAuth()
  const isPostgraduate = auth.currentRole === ROLES_LIST.postgraduate
  const axiosPrivate = useAxiosPrivate()

  const [isLoading, setIsLoading] = useState(true)
  const [reportId, setReportId] = useState('')
  const [refresh, setRefresh] = useState(false)

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const storageName = auth.currentLabId + '_chemicals'

  const recordedChemicals = JSON.parse(localStorage.getItem(storageName))

  const [started, setStarted] = useState(recordedChemicals !== null)
  const [chemicals, setChemicals] = useState(
    recordedChemicals !== null ? recordedChemicals : []
  )

  const [openProcedureModal, setOpenProcedureModal] = useState(false)
  const [openScanQRCodeModal, setOpenScanQRCodeModal] = useState(false)
  const [scannedChemicalId, setScannedChemicalId] = useState('')

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)
    setReportId('')

    const getActiveStockCheck = async () => {
      try {
        const { data } = await axiosPrivate.post(
          `/api/private/stock-check/active`,
          {
            labId: auth.currentLabId,
          },
          {
            signal: controller.signal,
          }
        )

        if (isMounted) {
          setReportId(data.reportId)
          setAuth((prev) => ({
            ...prev,
            stockCheck: {
              chemicals: data.chemicals,
              disposedChemicals: data.disposedChemicals,
            },
          }))
          setIsLoading(false)
        }
      } catch (error) {
        if (error.response.status === 404) {
          setChemicals([])
          localStorage.removeItem(storageName)
          setStarted(false)
          setReportId('')
          setAuth((prev) => ({
            ...prev,
            stockCheck: {
              chemicals: [],
              disposedChemicals: [],
            },
          }))
          setIsLoading(false)
        }

        return
      }
    }

    getActiveStockCheck()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, auth.currentLabId, setAuth, refresh, storageName])

  const joinStockCheck = () => {
    localStorage.setItem(storageName, JSON.stringify([]))
    setStarted(true)
  }

  return isLoading ? (
    <LoadingScreen />
  ) : !started ? (
    <div className='auth-card mb-6 self-center'>
      <h4 className='mb-2'>Stock Check Procedure</h4>
      <Procedure
        showFirstStep={true}
        isHavingActiveStockCheck={reportId !== ''}
      />
      <div className='mt-6 flex flex-col gap-3'>
        {!isPostgraduate && !reportId ? (
          <StartStockCheckButton setRefresh={setRefresh} />
        ) : (
          <button
            className='button button-solid w-full justify-center'
            onClick={joinStockCheck}
            disabled={!reportId}
          >
            Join Stock Check
          </button>
        )}

        {!isPostgraduate && reportId && (
          <button
            className='button button-green-outline w-full justify-center py-3 px-4'
            onClick={() => setOpenConfirmationModal(true)}
          >
            Mark as Completed
          </button>
        )}
      </div>

      {isPostgraduate && !reportId && (
        <p className='mt-3 flex items-center text-sm font-medium text-yellow-600'>
          <ExclamationIcon className='mr-2 h-5 w-5 shrink-0' /> No ongoing stock
          check process. Kindly contact the lab owner to start the stock check
          process.
        </p>
      )}

      {openConfirmationModal && reportId && (
        <ConfirmationModal
          reportId={reportId}
          openModal={openConfirmationModal}
          setOpenModal={setOpenConfirmationModal}
          setRefresh={setRefresh}
        />
      )}
    </div>
  ) : (
    <>
      <Title title='Stock Check' hasButton={false} hasRefreshButton={false}>
        <div className='ml-2 flex flex-1 justify-start'>
          <QuestionMarkCircleIcon
            onClick={() => setOpenProcedureModal(true)}
            className='h-4 w-4 stroke-2 text-gray-400'
          />
        </div>
      </Title>

      <p className='mb-2 text-sm font-medium text-gray-500'>Stock Check Info</p>
      <ActionCard
        reportId={reportId}
        chemicals={chemicals}
        setChemicals={setChemicals}
        setStarted={setStarted}
        setRefresh={setRefresh}
      />

      <p className='mb-2 text-sm font-medium text-gray-500'>
        Recorded Chemicals
      </p>
      {chemicals.length === 0 ? (
        <div className='mb-4 rounded-lg bg-white p-4 text-center shadow'>
          No record added.
        </div>
      ) : (
        <ChemicalsLoop chemicals={chemicals} setChemicals={setChemicals} />
      )}

      <button
        className='button button-solid fixed bottom-2 right-2 z-10 -translate-y-12 justify-center py-2 shadow-md'
        onClick={() => setOpenScanQRCodeModal(true)}
      >
        <PlusIcon className='-ml-1 mr-1.5 h-4 w-4 stroke-2' />
        Add Record
      </button>

      {openProcedureModal && (
        <ProcedureModal
          openModal={openProcedureModal}
          setOpenModal={setOpenProcedureModal}
        />
      )}

      {openScanQRCodeModal && (
        <ScanQRCodeModal
          openModal={openScanQRCodeModal}
          setOpenModal={setOpenScanQRCodeModal}
          isStockCheck={true}
          setScannedChemicalId={setScannedChemicalId}
        />
      )}

      {scannedChemicalId && (
        <AddRecordModal
          scannedChemicalId={scannedChemicalId}
          setScannedChemicalId={setScannedChemicalId}
          chemicals={chemicals}
          setChemicals={setChemicals}
        />
      )}
    </>
  )
}

export default StockCheck
