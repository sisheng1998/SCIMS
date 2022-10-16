import React, { useState } from 'react'
import UsageOverview from './UsageOverview'
import DateRangesFilter from './DateRangesFilter'
import Analytics from './Analytics'
import UsageTable from './UsageTable'

const TabLabels = ['Analytics', 'Records']

const Usage = ({ data, dateRanges, setDateRanges }) => {
  const [activeTab, setActiveTab] = useState('Tab0')

  let chemicals = []
  let users = []

  data.forEach((log) => {
    const chemicalExist = chemicals.some(
      (chemical) => chemical._id === log.chemical._id
    )

    if (!chemicalExist) {
      chemicals.push({
        _id: log.chemical._id,
        CASNo: log.CASNo,
        chemicalName: log.chemical.CASId.chemicalName,
        name: log.chemical.name,
      })
    }

    const userExist = users.some((user) => user._id === log.user._id)

    if (!userExist) {
      users.push({
        _id: log.user._id,
        name: log.user.name,
      })
    }
  })

  return (
    <>
      <DateRangesFilter dateRanges={dateRanges} setDateRanges={setDateRanges} />

      <p className='mb-2 font-medium text-gray-500'>Report Overview</p>
      <UsageOverview
        data={data}
        dateRanges={dateRanges}
        chemicals={chemicals}
        users={users}
      />

      <div className='mb-6 border-b border-gray-200 font-medium text-gray-500'>
        <ul className='-mb-px flex flex-wrap space-x-6'>
          {TabLabels.map((label, index) => (
            <li
              key={index}
              className={`inline-block border-b-2 pb-2 ${
                activeTab === 'Tab' + index
                  ? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
                  : 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Tab' + index)}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {activeTab === 'Tab0' && (
        <Analytics data={data} chemicals={chemicals} users={users} />
      )}

      {activeTab === 'Tab1' && <UsageTable data={data} />}
    </>
  )
}

export default Usage
