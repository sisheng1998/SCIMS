import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DocumentAddIcon } from '@heroicons/react/outline'
import { parse } from 'papaparse'
import { HEADERS } from '../../../../../config/import_export'

const CSVDropZone = ({
  setCSV,
  setDetectedColumns,
  setMappedColumns,
  setData,
  setErrorMessage,
}) => {
  const MAX_SIZE_IN_BYTES = 10485760 // 10MB

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length !== 0) {
      const CSV = acceptedFiles[0]

      if (CSV.size > MAX_SIZE_IN_BYTES) {
        setErrorMessage('The file size already exceed the limit.')
      } else if (CSV.type.toLowerCase() !== 'text/csv') {
        setErrorMessage('This file format is not supported.')
      } else {
        setErrorMessage('')

        const text = await CSV.text()
        const result = parse(text.replace(/\r\n+$/, ''), { header: true })

        const initialMapping = HEADERS.map((header) => {
          const label = result.meta.fields.find(
            (field) => field === header.label
          )
          const key = header.key

          return {
            label: label ? label : '',
            key,
          }
        })

        setDetectedColumns(result.meta.fields)
        setMappedColumns(initialMapping)
        setData(result.data)

        result.data.length === 0 &&
          setErrorMessage('The CSV file is empty / contains header only.')

        setCSV(CSV)
      }
    } else {
      if (rejectedFiles.length > 1) {
        setErrorMessage('Only single file is accepted.')
      } else {
        setErrorMessage('This file format is not supported.')
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'text/csv',
  })

  return (
    <div
      {...getRootProps()}
      className={`flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 focus:outline-none ${
        isDragActive ? 'border-indigo-600 bg-indigo-50' : ''
      }`}
    >
      <input {...getInputProps()} />

      <div className='flex flex-col items-center'>
        {isDragActive ? (
          <p className='font-medium text-indigo-600'>Drop CSV here</p>
        ) : (
          <>
            <DocumentAddIcon className='mb-1 h-10 w-10 stroke-1 text-gray-400' />
            <p className='font-medium'>Drag & drop CSV here</p>
            <p className='text-sm text-gray-500'>
              or{' '}
              <span className='font-semibold text-indigo-600 hover:text-indigo-700'>
                click to select CSV
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default CSVDropZone
