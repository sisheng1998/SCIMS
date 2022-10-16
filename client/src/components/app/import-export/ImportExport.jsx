import React, { useState } from 'react'
import Title from '../components/Title'
import ImportSection from './import/ImportSection'
import ExportSection from './export/ExportSection'

const ImportExport = () => {
  const [type, setType] = useState('Import')

  return (
    <>
      <Title
        title={type + ' Chemicals'}
        hasButton={false}
        hasRefreshButton={false}
      >
        <div className='flex items-baseline self-end text-sm text-gray-500'>
          <select
            className='cursor-pointer border-none bg-transparent py-0 pr-8 pl-2 font-medium text-gray-700 shadow-none outline-none focus:border-none focus:ring-0'
            name='type'
            id='type'
            style={{ textAlignLast: 'right' }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value='Import'>Import</option>
            <option value='Export'>Export</option>
          </select>
        </div>
      </Title>

      {type === 'Import' ? <ImportSection /> : <ExportSection />}
    </>
  )
}

export default ImportExport
