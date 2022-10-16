import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import ChemicalsTable from './ChemicalsTable'

const Inventory = () => {
  const axiosPrivate = useAxiosPrivate()

  const [chemicals, setChemicals] = useState([])
  const [disposedChemicals, setDisposedChemicals] = useState([])
  const [labs, setLabs] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      return
    }

    let isMounted = true
    const controller = new AbortController()

    setIsLoading(true)

    const getChemicals = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/admin/chemicals', {
          signal: controller.signal,
        })
        if (isMounted) {
          setLabs(data.labs)

          let locations = []
          data.labs.forEach(
            (lab) => (locations = [...locations, ...lab.locations])
          )

          const processedChemicals = data.chemicals.map((chemical, index) => {
            const location = locations.find(
              (location) => location._id === chemical.locationId
            )

            return {
              ...chemical,
              labName: chemical.lab.labName,
              CAS: chemical.CASId.CASNo,
              location: location ? location.name : '-',
              index,
            }
          })
          setChemicals(processedChemicals)

          const processedDisposedChemicals = data.disposedChemicals.map(
            (chemical, index) => {
              const location = locations.find(
                (location) => location._id === chemical.locationId
              )

              return {
                ...chemical,
                labName: chemical.lab.labName,
                CAS: chemical.CASId.CASNo,
                location: location ? location.name : '-',
                index,
              }
            }
          )
          setDisposedChemicals(processedDisposedChemicals)

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
  }, [axiosPrivate, refresh])

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title
        title='All Chemicals'
        hasButton={false}
        hasRefreshButton={true}
        setRefresh={setRefresh}
      />

      <ChemicalsTable
        labs={labs}
        chemicals={chemicals}
        disposedChemicals={disposedChemicals}
        setUpdateAmountSuccess={setRefresh}
      />
    </>
  )
}

export default Inventory
