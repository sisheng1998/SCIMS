import React from 'react'
import STORAGE_GROUPS from '../../../config/storage_groups'

const tableHeaders = ['Code', 'Description']

const StorageGroupsSection = () => {
  return (
    <div className='w-full max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm xl:max-w-full'>
      <div className='overflow-x-auto'>
        <div className='border-b border-gray-200'>
          <table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
            <thead className='bg-gray-50'>
              <tr>
                {tableHeaders.map((title, index) => (
                  <th
                    scope='col'
                    key={index}
                    className={`px-6 py-4 font-medium text-gray-500 ${
                      index === 0 ? 'text-center' : 'text-left'
                    }`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-200 bg-white'>
              {STORAGE_GROUPS.map((group, index) => (
                <tr className='hover:bg-indigo-50/30' key={index}>
                  <td className='px-6 py-4 text-center'>{group.code}</td>
                  <td className='px-6 py-4'>{group.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StorageGroupsSection
