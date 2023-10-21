import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import Title from '../components/Title'
import Usage from './usage/Usage'
import StockCheckTable from './stock-check/StockCheckTable'
import ROLES_LIST from '../../../config/roles_list'

const Reports = () => {
  const { auth } = useAuth()
  const isPostgraduate = auth.currentRole === ROLES_LIST.postgraduate

  const axiosPrivate = useAxiosPrivate()

  const [isLoading, setIsLoading] = useState(true)

  const [reportType, setReportType] = useState(
    isPostgraduate ? 'Stock Check' : 'Chemical Usage'
  )
  const [dateRanges, setDateRanges] = useState({
    start: dayjs().startOf('month').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
  })

  const [usage, setUsage] = useState([])
  const [stockCheck, setStockCheck] = useState([])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getInfo = async () => {
      try {
        if (reportType === 'Chemical Usage') {
          const { data } = await axiosPrivate.put(
            '/api/private/usage-reports',
            { labId: auth.currentLabId, dateRanges },
            {
              signal: controller.signal,
            }
          )
          if (isMounted) {
            const processedData = data.data
              .sort((a, b) => (a.date < b.date ? 1 : -1))
              .map((log, index) => ({
                ...log,
                CASNo: log.chemical.CASId.CASNo,
                chemicalName: log.chemical.name,
                userName: log.user.name,
                userEmail: log.user.email,
                index,
              }))

            setUsage(processedData)
            setIsLoading(false)
          }
        } else {
          const { data } = await axiosPrivate.put(
            '/api/private/stock-check-reports',
            { labId: auth.currentLabId },
            {
              signal: controller.signal,
            }
          )
          if (isMounted) {
            setStockCheck(data.data)
            setIsLoading(false)
          }
        }
      } catch (error) {
        return
      }
    }

    getInfo()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, auth.currentLabId, reportType, dateRanges])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title
        title={reportType + ' Reports'}
        hasButton={false}
        hasRefreshButton={false}
      >
        {!isPostgraduate && (
          <div className='flex items-baseline self-end text-sm text-gray-500'>
            <select
              className='cursor-pointer border-none bg-transparent py-0 pr-8 pl-2 font-medium text-gray-700 shadow-none outline-none focus:border-none focus:ring-0'
              name='type'
              id='type'
              style={{ textAlignLast: 'right' }}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value='Chemical Usage'>Chemical Usage</option>
              <option value='Stock Check'>Stock Check</option>
            </select>
          </div>
        )}
      </Title>

      {reportType === 'Chemical Usage' ? (
        <Usage
          data={usage}
          dateRanges={dateRanges}
          setDateRanges={setDateRanges}
        />
      ) : (
        <StockCheckTable data={stockCheck} />
      )}
    </>
  )
}

export default Reports
