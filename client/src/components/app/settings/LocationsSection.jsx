import React, { useState } from 'react'
import EditLocationModal from './EditLocationModal'
import STORAGE_CLASSES from '../../../config/storage_classes'

const tableHeaders = ['Location', 'Storage Class(es)', 'Action']

const LocationsSection = ({ locations, setEditLocationSuccess }) => {
  const [location, setLocation] = useState('')
  const [openEditLocationModal, setOpenEditLocationModal] = useState(false)

  const editLocationHandler = (location) => {
    setLocation(location)
    setOpenEditLocationModal(true)
  }

  return (
    <>
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm'>
        <div className='overflow-x-auto'>
          <div className='border-b border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
              <thead className='bg-gray-50'>
                <tr>
                  {tableHeaders.map((title, index) => (
                    <th
                      scope='col'
                      key={index}
                      className='px-6 py-4 text-left font-medium text-gray-500'
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 bg-white'>
                {locations.length === 0 ? (
                  <tr>
                    <td
                      className='px-6 py-4 text-center'
                      colSpan={tableHeaders.length}
                    >
                      No location added.
                    </td>
                  </tr>
                ) : (
                  locations
                    .sort((a, b) =>
                      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                    )
                    .map((location) => (
                      <tr className='hover:bg-indigo-50/30' key={location._id}>
                        <td className='px-6 py-4'>{location.name}</td>
                        <td className='px-6 py-4'>
                          {location.storageClasses.length ===
                          STORAGE_CLASSES.length
                            ? 'Any Storage Classes'
                            : location.storageClasses.map(
                                (code, index) => (index ? ', ' : '') + code
                              )}
                        </td>
                        <td className='px-6 py-4'>
                          <button
                            onClick={() => editLocationHandler(location)}
                            className='flex font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none'
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {location && openEditLocationModal && (
        <EditLocationModal
          location={location}
          openModal={openEditLocationModal}
          setOpenModal={setOpenEditLocationModal}
          setEditLocationSuccess={setEditLocationSuccess}
        />
      )}
    </>
  )
}

export default LocationsSection
