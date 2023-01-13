import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DocumentAddIcon, DocumentTextIcon } from '@heroicons/react/outline'
import FormatBytes from '../../../../utils/FormatBytes'
import FormatDate from '../../../../utils/FormatDate'

const BackupField = ({ backup, setBackup, setErrorMessage }) => {
  const MAX_SIZE_IN_BYTES = 10485760 // 10MB

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length !== 0) {
        const backup = acceptedFiles[0]

        if (backup.size > MAX_SIZE_IN_BYTES) {
          setErrorMessage('The file size already exceed the limit.')
        } else if (
          backup.type.toLowerCase() !== 'application/gzip' &&
          backup.type.toLowerCase() !== 'application/x-gzip'
        ) {
          setErrorMessage('This file format is not supported.')
        } else {
          setErrorMessage('')
          setBackup(backup)
        }
      } else {
        if (rejectedFiles.length > 1) {
          setErrorMessage('Only single file is accepted.')
        } else {
          setErrorMessage('This file format is not supported.')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'application/gzip, application/x-gzip',
  })

  return (
    <div>
      <label
        htmlFor='backup'
        className={backup === '' ? 'required-input-label' : ''}
      >
        Backup File
      </label>

      {backup === '' ? (
        <>
          <div
            {...getRootProps()}
            className={`flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 focus:outline-none ${
              isDragActive ? 'border-indigo-600 bg-indigo-50' : ''
            }`}
          >
            <input {...getInputProps()} />

            <div className='flex flex-col items-center'>
              {isDragActive ? (
                <p className='font-medium text-indigo-600'>
                  Drop backup file here
                </p>
              ) : (
                <>
                  <DocumentAddIcon className='mb-1 h-10 w-10 stroke-1 text-gray-400' />
                  <p className='font-medium'>Drag & drop backup file here</p>
                  <p className='text-sm text-gray-500'>
                    or{' '}
                    <span className='font-semibold text-indigo-600 hover:text-indigo-700'>
                      click to select backup file
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>

          <p className='mt-2 text-xs text-gray-400'>
            Only .gz file is supported. Max file size: 10 MB.
          </p>
        </>
      ) : (
        <>
          <div className='mt-3 flex items-center'>
            <DocumentTextIcon className='mr-2 h-12 w-12 shrink-0 stroke-1 text-gray-400' />

            <div>
              <p className='font-medium text-gray-900'>{backup.name}</p>
              <p className='text-xs text-gray-500'>
                {FormatBytes(backup.size)} -{' '}
                {FormatDate(backup.lastModifiedDate)}
              </p>
            </div>
          </div>

          <button
            className='button button-outline mt-4 px-3 py-2 text-xs font-semibold'
            onClick={() => setBackup('')}
          >
            Change File
          </button>
        </>
      )}
    </div>
  )
}

export default BackupField
