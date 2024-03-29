import React from 'react'
import { PlusIcon, RefreshIcon, DownloadIcon } from '@heroicons/react/outline'

const Title = (props) => {
  return (
    <>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='flex h-10 items-end lg:h-auto'>
          {props.title}
          {props.titleTag}
        </h3>

        <div className='flex items-center space-x-4'>
          {props.chemicalList && (
            <button
              onClick={props.chemicalListButtonAction}
              className='button button-outline'
            >
              <DownloadIcon className='-ml-0.5 mr-1.5 h-3.5 w-3.5 stroke-2' />
              Chemical List
            </button>
          )}

          {props.QRCodes && (
            <button
              onClick={props.QRCodesButtonAction}
              className='button button-outline'
            >
              <DownloadIcon className='-ml-0.5 mr-1.5 h-3.5 w-3.5 stroke-2' />
              Export QR Codes
            </button>
          )}

          {props.hasButton && (
            <button
              onClick={props.buttonAction}
              className='button button-outline'
            >
              <PlusIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
              {props.buttonText}
            </button>
          )}

          {props.hasRefreshButton && (
            <button
              onClick={() => props.setRefresh(true)}
              className='button button-outline lg:py-1.5'
            >
              <RefreshIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
              Refresh
            </button>
          )}
        </div>
        {props.children}
      </div>

      <hr className='mb-6 border-gray-200 lg:mb-4' />
    </>
  )
}

export default Title
