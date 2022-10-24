import React, { useState, useEffect } from 'react'
import STORAGE_CLASSES from '../../../../config/storage_classes'

const StorageInfoSection = ({
  lab,
  chemical,
  setChemicalData,
  setValidated,
}) => {
  let initialLocation = ''
  let initialLocationIndex = ''

  if (lab && chemical && chemical.locationId) {
    lab.locations.forEach((location, index) => {
      if (location._id === chemical.locationId) {
        initialLocation = location
        initialLocationIndex = index
      }
    })
  }

  const [location, setLocation] = useState(initialLocation)
  const [locationIndex, setLocationIndex] = useState(initialLocationIndex)
  const [storageClass, setStorageClass] = useState(
    chemical ? chemical.storageClass : ''
  )

  const today = new Date()
  const [dateIn, setDateIn] = useState(
    chemical && chemical.dateIn
      ? new Date(chemical.dateIn).toLocaleDateString('en-CA')
      : today.toLocaleDateString('en-CA')
  )
  const [dateOpen, setDateOpen] = useState(
    chemical && chemical.dateOpen
      ? new Date(chemical.dateOpen).toLocaleDateString('en-CA')
      : ''
  )
  const [expirationDate, setExpirationDate] = useState(
    chemical && chemical.expirationDate
      ? new Date(chemical.expirationDate).toLocaleDateString('en-CA')
      : ''
  )

  useEffect(() => {
    setChemicalData((prev) => {
      return {
        ...prev,
        locationId: location?._id,
        storageClass,
        dateIn,
        dateOpen,
        expirationDate,
      }
    })

    setValidated((prev) => {
      return {
        ...prev,
        locationValidated: location?._id ? true : false,
        dateInValidated: dateIn ? true : false,
        expirationDateValidated: expirationDate ? true : false,
        storageClassValidated:
          location === '' ||
          location.storageClasses.includes(storageClass) ||
          storageClass === ''
            ? true
            : false,
      }
    })
  }, [
    location,
    storageClass,
    setChemicalData,
    setValidated,
    dateIn,
    dateOpen,
    expirationDate,
  ])

  const locationChangeHandler = (e) => {
    setLocationIndex(e.target.value)

    if (e.target.value !== '') {
      setLocation(lab.locations[e.target.value])
    } else {
      setLocation('')
    }
  }

  return (
    <>
      <div className='mb-6 flex space-x-6'>
        <div className='w-1/3'>
          <label htmlFor='lab'>Lab</label>
          <input
            className='w-full'
            type='text'
            name='lab'
            id='lab'
            readOnly
            value={'Lab ' + lab.labName}
          />
          <p className='mt-2 text-xs text-gray-400'>
            Lab that storing the chemical.
          </p>
        </div>

        <div className='w-1/3'>
          <label htmlFor='locationSelection' className='required-input-label'>
            Location
          </label>
          <select
            className='w-full'
            id='locationSelection'
            required
            value={locationIndex}
            onChange={locationChangeHandler}
          >
            <option value=''>Select</option>
            {lab.locations
              .sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
              )
              .map((location, index) => (
                <option key={location._id} value={index}>
                  {location.name}
                </option>
              ))}
          </select>
          <p className='mt-2 text-xs text-gray-400'>
            Location for the chemical.
          </p>
        </div>

        <div className='w-1/3'>
          <label htmlFor='storageClassSelection'>Storage Class</label>
          <select
            className={`w-full ${
              location !== '' &&
              !location.storageClasses.includes(storageClass) &&
              storageClass !== ''
                ? 'input-invalid'
                : ''
            }`}
            id='storageClassSelection'
            value={storageClass}
            onChange={(e) => setStorageClass(e.target.value)}
          >
            <option value=''>Select</option>
            {STORAGE_CLASSES.filter(
              (storage_class) =>
                location === '' ||
                location.storageClasses.includes(storage_class.code) ||
                storage_class.code === storageClass
            ).map((storage_class, index) => (
              <option
                key={index}
                value={storage_class.code}
                disabled={
                  location !== '' &&
                  !location.storageClasses.includes(storage_class.code)
                }
              >
                {storage_class.code} - {storage_class.description}
              </option>
            ))}
          </select>
          <p
            className={`mt-2 text-xs ${
              location !== '' &&
              !location.storageClasses.includes(storageClass) &&
              storageClass !== ''
                ? 'text-red-600'
                : 'text-gray-400'
            }`}
          >
            {location !== '' &&
            !location.storageClasses.includes(storageClass) &&
            storageClass !== ''
              ? `Not allowed in ${lab.locations[locationIndex].name}.`
              : 'Based on TRGS-510 Standard.'}
          </p>
        </div>
      </div>

      <div className='flex space-x-6'>
        <div className='w-1/3'>
          <label htmlFor='dateIn' className='required-input-label'>
            Date In
          </label>
          <input
            className='w-full'
            type='date'
            name='dateIn'
            id='dateIn'
            required
            value={dateIn}
            onChange={(e) => setDateIn(e.target.value)}
          />
          <p className='mt-2 text-xs text-gray-400'>
            Date of chemical received.
          </p>
        </div>

        <div className='w-1/3'>
          <label htmlFor='dateOpen'>Date Open</label>
          <input
            className='w-full'
            type='date'
            name='dateOpen'
            id='dateOpen'
            value={dateOpen}
            onChange={(e) => setDateOpen(e.target.value)}
          />
          <p className='mt-2 text-xs text-gray-400'>Date of chemical opened.</p>
        </div>

        <div className='w-1/3'>
          <label htmlFor='expirationDate' className='required-input-label'>
            Expiration Date
          </label>
          <input
            className='w-full'
            type='date'
            name='expirationDate'
            id='expirationDate'
            required
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
          <p className='mt-2 text-xs text-gray-400'>
            Date of chemical expired.
          </p>
        </div>
      </div>
    </>
  )
}

export default StorageInfoSection
