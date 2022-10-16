import React from 'react'
import { HEADERS } from '../../../../../config/import_export'

const getLabel = (value) =>
  HEADERS.find((header) => header.key === value)['label']

const CSVTable = ({ data }) => {
  const tableHeaders = data.length !== 0 && Object.keys(data[0])

  return data.length === 0 ? (
    <p className='rounded-lg border border-gray-300 bg-gray-50 px-2 py-4 text-center'>
      No data found.
    </p>
  ) : (
    <div className='overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pb-3'>
      <div className='max-h-96 overflow-x-auto'>
        <div className='border-b border-gray-200'>
          <table className='min-w-full whitespace-nowrap'>
            <thead className='sticky top-0 bg-gray-50'>
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
              {data.map((chemical, index) => (
                <tr key={index} className='hover:bg-indigo-50/30'>
                  <td className='px-3 py-2'>{index + 1}</td>

                  {tableHeaders.map((key, index) => (
                    <td key={index} className='px-3 py-2'>
                      {chemical[key]}
                    </td>
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

export default CSVTable
