import React, { useState } from 'react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { HEADERS, Validate } from '../../../../../config/import_export'

const getTooltip = (value) => {
  if (value === '_id')
    return '24 characters with a-f, A-F and 0-9 only. (Optional)'

  if (value === 'status')
    return 'Normal, Low Amount, Expiring Soon, Expired or Disposed only. (Optional)'

  const header = HEADERS.find((header) => header.key === value)
  const isRequired = header.label.endsWith('*') ? ' (Required)' : ' (Optional)'

  return header['description'] + isRequired
}

const capitalizeFirstLetter = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

const capitalizeFirstLetterForEachWord = (value) => {
  const words = value.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = capitalizeFirstLetter(words[i])
  }

  return words.join(' ')
}

const CellEditor = ({
  cellKey,
  chemical,
  index,
  processedData,
  setProcessedData,
}) => {
  const [valid, setValid] = useState(Validate(cellKey, chemical[cellKey]))

  const validationHandler = (e) =>
    setValid(Validate(cellKey, e.currentTarget.textContent))

  const editHandler = (e) => {
    const value = e.currentTarget.textContent

    if (processedData[index][cellKey] === value) return

    const editedData = [...processedData]

    if (cellKey === 'state') {
      editedData[index][cellKey] = capitalizeFirstLetter(value)
    } else if (cellKey === 'status') {
      editedData[index][cellKey] = capitalizeFirstLetterForEachWord(value)
    } else if (cellKey === 'storageClass') {
      editedData[index][cellKey] = value.toUpperCase().replace(/\s/g, '')
    } else {
      editedData[index][cellKey] = value
    }

    const isValid = Validate(cellKey, editedData[index][cellKey])

    if (!isValid) {
      editedData[index]['validated'] = false
    } else {
      const validation = []

      for (const key in editedData[index]) {
        if (key === cellKey || key === 'validated') continue

        validation.push(Validate(key, editedData[index][key]))
      }

      editedData[index]['validated'] = validation.every(
        (result) => result === true
      )
    }

    setProcessedData(editedData)
  }

  const editNotesHandler = (e) => {
    const value = e.target.value

    if (processedData[index]['notes'] === value) return

    const editedData = [...processedData]
    editedData[index]['notes'] = value

    setProcessedData(editedData)
  }

  return (
    <td className='px-3 py-0'>
      <div
        className={`flex items-center justify-between border-b-2 pt-2 pb-1.5 ${
          valid
            ? 'border-transparent focus-within:border-green-600 hover:border-indigo-600 focus-within:hover:border-green-600'
            : 'border-red-600'
        }`}
      >
        {cellKey === 'notes' ? (
          <textarea
            rows='1'
            spellCheck={false}
            className='resize-none rounded-none border-none bg-transparent p-0 shadow-none focus:ring-0'
            value={chemical[cellKey]}
            onChange={editNotesHandler}
          ></textarea>
        ) : (
          <p
            className={`flex-1 outline-none ${!valid ? 'pr-1.5' : ''}`}
            spellCheck={false}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={validationHandler}
            onBlur={editHandler}
          >
            {chemical[cellKey]}
          </p>
        )}

        {!valid && (
          <p
            className='tooltip tooltip-right whitespace-pre-wrap hover:before:z-[2] hover:after:z-[2]'
            data-tooltip={getTooltip(cellKey)}
          >
            <ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
          </p>
        )}
      </div>
    </td>
  )
}

export default CellEditor
