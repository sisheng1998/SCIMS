import React from 'react'
import { useNavigate } from 'react-router-dom'

const tableHeaders = ['No.', 'Name', 'Lab', 'Action']

const ChemicalTable = ({ chemicals }) => {
  const navigate = useNavigate()

  return (
    <div className='overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pb-3'>
      <div className='max-h-96 overflow-x-auto'>
        <div className='border-b border-gray-200'>
          <table className='min-w-full whitespace-nowrap'>
            <thead className='sticky top-0 bg-gray-50'>
              <tr className='sticky-border-b'>
                {tableHeaders.map((title, index) => (
                  <th
                    scope='col'
                    key={index}
                    className='px-3 py-2 text-left font-medium text-gray-500'
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-200 bg-white'>
              {chemicals.map((chemical, index) => (
                <tr key={index}>
                  <td className='px-3 py-2'>{index + 1}</td>
                  <td className='px-3 py-2'>{chemical.name}</td>
                  <td className='px-3 py-2'>Lab {chemical.lab.labName}</td>
                  <td className='px-3 py-2'>
                    <button
                      onClick={() => navigate(`/inventory/${chemical._id}`)}
                      className='inline font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ChemicalTable
