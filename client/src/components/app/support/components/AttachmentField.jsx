import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  CloudUploadIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import FormatBytes from '../../../utils/FormatBytes'

const AttachmentField = ({ attachments, setAttachments }) => {
  const MAX_SIZE_IN_BYTES = 10485760 // 10MB

  const fileSizeValidator = (file) =>
    file.size > MAX_SIZE_IN_BYTES
      ? {
          code: 'file-too-large',
          message: 'The file size already exceed the limit.',
        }
      : null

  const onDrop = useCallback((attachments) => {
    setAttachments((prev) => [...prev, ...attachments])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      validator: fileSizeValidator,
    })

  const handleRemove = (index) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index))

  return (
    <div>
      <label htmlFor='attachment'>
        Attachment(s){' '}
        <span className='text-xs text-gray-400'>- Max 10 MB / File</span>
      </label>

      <div
        {...getRootProps()}
        className={`flex flex-col justify-center rounded-lg border-2 border-dashed border-gray-200 p-3 focus:outline-none ${
          isDragActive ? 'border-indigo-600 bg-indigo-50' : ''
        }`}
      >
        <input {...getInputProps()} />

        <div className='flex items-center'>
          {isDragActive ? (
            <p className='font-medium text-indigo-600'>
              Drop your file(s) here
            </p>
          ) : (
            <>
              <CloudUploadIcon className='mr-2 h-6 w-6 text-gray-400' />
              <p className='text-sm font-medium'>Upload file(s)</p>
            </>
          )}
        </div>
      </div>

      {fileRejections.length !== 0 && (
        <p className='mt-2 flex text-sm font-medium text-red-600'>
          <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />
          <span>
            The size of the file(s) below already exceed the limit:
            <br />
            <span className='font-normal text-gray-700'>
              {fileRejections.map(({ file }) => file.name).join(', ')}
            </span>
          </span>
        </p>
      )}

      {attachments.length !== 0 && (
        <div className='mt-2 space-y-2'>
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className='flex items-center justify-between space-x-6 rounded-lg border border-gray-200 py-2.5 pl-4 pr-3'
            >
              <p>{attachment.name}</p>
              <div className='flex items-center'>
                <p className='text-sm text-gray-400'>
                  {FormatBytes(attachment.size)}
                </p>
                <TrashIcon
                  onClick={() => handleRemove(index)}
                  className='ml-2 h-5 w-5 cursor-pointer text-red-600'
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AttachmentField
