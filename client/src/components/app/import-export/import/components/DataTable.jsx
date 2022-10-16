import React from 'react'
import { HEADERS } from '../../../../../config/import_export'
import CellEditor from './CellEditor'

const getLabel = (value) =>
  HEADERS.find((header) => header.key === value)['label']

const DataTable = ({ processedData, setProcessedData }) => {
  const tableHeaders = Object.keys(processedData[0]).filter(
    (header) => header !== 'validated'
  )

  return (
    <div className='overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pb-3'>
      <div className='max-h-96 overflow-x-auto'>
        <div className='border-b border-gray-200'>
          <table className='min-w-full whitespace-nowrap'>
            <thead className='sticky top-0 z-[1] bg-gray-50'>
              <tr className='sticky-border-b'>
                <th
                  scope='col'
                  className='px-3 py-2 text-left font-medium text-gray-500'
                >
                  No.
                </th>
                {tableHeaders.map((key, index) => (
                  <th
                    scope='col'
                    key={index}
                    className='px-3 py-2 text-left font-medium text-gray-500'
                  >
                    {getLabel(key)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-200 bg-white'>
              {processedData.map((chemical, index) => (
                <tr
                  key={index}
                  className={
                    chemical.validated ? 'hover:bg-indigo-50/30' : 'bg-red-50'
                  }
                >
                  <td className='px-3 py-2'>{index + 1}</td>

                  {tableHeaders.map((key, i) => (
                    <CellEditor
                      key={i}
                      cellKey={key}
                      chemical={chemical}
                      index={index}
                      processedData={processedData}
                      setProcessedData={setProcessedData}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataTable
