import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import LoadingButtonText from '../app/components/LoadingButtonText'
import { CASNoSearchableSelect } from '../utils/SearchableSelect'

const CASNoSelectionField = ({ CASId, setCASId }) => {
  const axiosPrivate = useAxiosPrivate()

  const [allCASNo, setAllCASNo] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchAllCASNo = async () => {
      setIsLoading(true)

      try {
        const { data } = await axiosPrivate.get('/api/private/cas', {
          signal: controller.signal,
        })

        if (isMounted) {
          setAllCASNo(data.allCASNo)
        }
      } catch (error) {
        setAllCASNo([])
      }

      setIsLoading(false)
    }

    fetchAllCASNo()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate])

  return isLoading || allCASNo.length === 0 ? (
    <div className='-mb-0.5 flex items-center justify-center rounded-md bg-gray-50 py-9 px-4'>
      {isLoading ? (
        <LoadingButtonText />
      ) : (
        'Failed to load, please try again later.'
      )}
    </div>
  ) : (
    <div>
      <label htmlFor='CASNoSelection' className='required-input-label'>
        CAS No.
      </label>

      <CASNoSearchableSelect
        selectedId={CASId}
        setSelectedId={setCASId}
        options={allCASNo}
      />

      <p className='mt-2 text-xs text-gray-400'>
        Select the correct CAS No. from the list.
      </p>
    </div>
  )
}

export default CASNoSelectionField
