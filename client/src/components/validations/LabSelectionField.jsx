import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { LabSearchableSelect } from '../utils/SearchableSelect'

const LabSelectionField = (props) => {
  const [labs, setLabs] = useState([])

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchLabs = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }

      try {
        const { data } = await axios.get('/api/auth/labs', config)
        isMounted && setLabs(data.labs)
      } catch (error) {
        setLabs([])
      }
    }

    fetchLabs()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    props.setValidated(props.value !== '')
  }, [props])

  return (
    <div className='mb-6'>
      <LabSearchableSelect
        selectedId={props.value}
        setSelectedId={props.setValue}
        options={labs}
        validated={props.validated}
        checkExist={props.checkExist}
        userRoles={props.userRoles}
      />

      <p className='mt-2 text-xs text-gray-400'>
        {!props.value ? (
          `The ${
            props.checkExist ? '' : 'registration '
          }request will be sent to the lab owner.`
        ) : (
          <span className='text-green-600'>
            The owner of this lab will receive your{' '}
            {props.checkExist ? '' : 'registration '}request
            {props.checkExist
              ? ''
              : ' after your email verified and profile completed'}
            .
          </span>
        )}
      </p>
    </div>
  )
}

export default LabSelectionField
