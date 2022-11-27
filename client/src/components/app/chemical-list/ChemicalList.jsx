import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import LoadingScreen from '../../utils/LoadingScreen'
import ListTable from './ListTable'
import DownloadChemicalList from './DownloadChemicalList'

const ChemicalList = () => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [chemicals, setChemicals] = useState([])
  const [disposedChemicals, setDisposedChemicals] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getChemicals = async () => {
      try {
        const { data } = await axiosPrivate.post(
          '/api/private/chemical-list',
          {
            labId: auth.currentLabId,
          },
          {
            signal: controller.signal,
          }
        )
        if (isMounted) {
          setChemicals(data.chemicals)
          setDisposedChemicals(data.disposedChemicals)
          setIsLoading(false)
        }
      } catch (error) {
        return
      }
    }

    getChemicals()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, auth.currentLabId])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title title='Chemical List'>
        {auth.currentRole >= ROLES_LIST.postgraduate && (
          <DownloadChemicalList
            chemicals={chemicals}
            disposedChemicals={disposedChemicals}
          />
        )}
      </Title>

      <ListTable chemicals={chemicals} disposedChemicals={disposedChemicals} />
    </>
  )
}

export default ChemicalList
