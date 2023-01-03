import React from 'react'
import FormatBytes from '../../utils/FormatBytes'
import {
  DocumentTextIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import { PaperClipIcon } from '@heroicons/react/solid'
import FILE_PATH from '../../../config/file_path'

const RenderPDF = ({ language, PDF, setPDF, extractionResult }) => {
  const RenameFile = (name) =>
    name.replace('.pdf', `_${language.toUpperCase()}.pdf`)

  return PDF.toString().toLowerCase().endsWith('.pdf') ? (
    <div className='flex items-center justify-between space-x-6 rounded-lg border border-gray-200 py-2 px-3 pr-4 font-medium'>
      <p className='flex items-center'>
        <PaperClipIcon className='mr-2 h-5 w-5 text-gray-400' />
        {RenameFile(PDF)}
      </p>
      <a href={FILE_PATH.SDSs[language] + PDF} target='_blank' rel='noreferrer'>
        View
      </a>
    </div>
  ) : PDF === 'No SDS' ? (
    <p className='!mt-2 flex items-center text-sm font-medium text-red-600'>
      <ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' /> SDS -{' '}
      {language.toUpperCase()} not found, kindly upload one for this chemical.
    </p>
  ) : (
    <>
      <div className='mt-3'>
        <div className='flex items-center'>
          <DocumentTextIcon className='mr-2 h-12 w-12 shrink-0 stroke-1 text-gray-400' />

          <div className='overflow-hidden'>
            <p className='truncate text-sm font-medium'>{PDF.name}</p>
            <p className='text-xs'>{FormatBytes(PDF.size)}</p>
          </div>
        </div>

        <div className='mt-2'>
          <p className='text-xs text-gray-500'>Detected GHS Classifications</p>
          <p className='text-sm font-medium'>
            {extractionResult ? extractionResult : '-'}
          </p>
        </div>
      </div>

      <button
        className='button button-outline mt-4 px-3 py-2 text-xs font-semibold'
        onClick={() => setPDF('')}
      >
        Change File
      </button>
    </>
  )
}

export default RenderPDF
