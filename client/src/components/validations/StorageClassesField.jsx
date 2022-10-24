import React, { useState } from 'react'
import STORAGE_CLASSES from '../../config/storage_classes'

const getAllowedOptions = (checkedState, value) => {
  let allowedOptions = []

  value.length === 0
    ? (allowedOptions = '')
    : checkedState.forEach((checked, index) => {
        if (
          checked &&
          allowedOptions.join('') !== STORAGE_CLASSES[index].allowed.join('')
        ) {
          if (allowedOptions.length === 0) {
            allowedOptions = STORAGE_CLASSES[index].allowed
          } else {
            allowedOptions = [
              ...allowedOptions,
              ...STORAGE_CLASSES[index].allowed,
            ]

            const uniqueElements = new Set(allowedOptions)

            const filteredElements = allowedOptions.filter((item) => {
              if (uniqueElements.has(item)) {
                uniqueElements.delete(item)
                return ''
              } else {
                return item
              }
            })

            allowedOptions = [...new Set(filteredElements)]
          }
        }
      })

  return allowedOptions
}

const StorageGroupsField = ({ value, setValue }) => {
  const [anyChecked, setAnyChecked] = useState(
    STORAGE_CLASSES.length === value.length
  )

  const initialCheckedState =
    value.length === 0
      ? Array(STORAGE_CLASSES.length).fill(false)
      : anyChecked
      ? Array(STORAGE_CLASSES.length).fill(false)
      : () => STORAGE_CLASSES.map((group) => value.includes(group.code))

  const [checkedState, setCheckedState] = useState(initialCheckedState)

  const initialAllowed =
    value.length === 0 ? '' : getAllowedOptions(checkedState, value)

  const [allowed, setAllowed] = useState(initialAllowed)

  const anyOnChangeHandler = () => {
    setCheckedState(Array(STORAGE_CLASSES.length).fill(false))

    if (anyChecked) {
      setValue([])
      setAllowed('')
    } else {
      setValue(STORAGE_CLASSES.map((group) => group.code))
    }

    setAnyChecked(!anyChecked)
  }

  const onChangeHandler = (e, position) => {
    const updatedCheckedState = checkedState.map((checked, index) =>
      index === position ? !checked : checked
    )

    setCheckedState(updatedCheckedState)

    let updatedValues = [...value]
    e.target.checked
      ? (updatedValues = [...value, e.target.value])
      : updatedValues.splice(value.indexOf(e.target.value), 1)

    setValue(updatedValues)

    setAllowed(getAllowedOptions(updatedCheckedState, updatedValues))
  }

  return (
    <div className='mb-6'>
      <div className='mb-1 flex'>
        <input
          className='mt-0.5 cursor-pointer'
          type='checkbox'
          id='any'
          value='any'
          onChange={anyOnChangeHandler}
          checked={anyChecked}
        />
        <label className='mb-0 cursor-pointer pl-2 font-normal' htmlFor='any'>
          Any Storage Classes
        </label>
      </div>

      <div className='grid gap-1'>
        {STORAGE_CLASSES.map((storage_class, index) => (
          <div
            key={index}
            className={`flex ${
              anyChecked || (allowed && !allowed.includes(storage_class.code))
                ? 'pointer-events-none opacity-50'
                : ''
            }`}
          >
            <input
              className='mt-0.5 cursor-pointer'
              type='checkbox'
              id={storage_class.code}
              value={storage_class.code}
              checked={checkedState[index]}
              onChange={(e) => onChangeHandler(e, index)}
            />
            <label
              className='mb-0 cursor-pointer space-x-1 pl-2 font-normal'
              htmlFor={storage_class.code}
            >
              {storage_class.code} - {storage_class.description}
            </label>
          </div>
        ))}
      </div>

      <p className='mt-2 text-xs text-gray-400'>
        Assign selected storage class(es) to the location.
      </p>
    </div>
  )
}

export default StorageGroupsField
