import React from 'react'
import { CSVLink } from 'react-csv'
import { DownloadIcon } from '@heroicons/react/outline'
import { HEADERS } from '../../../config/chemical_list'
import useAuth from '../../../hooks/useAuth'

const DownloadChemicalList = ({ chemicals, disposedChemicals }) => {
  const { auth } = useAuth()

  const disposedIds = []

  const chemicalsData = chemicals.map((chemical) => {
    const disposedChemical = disposedChemicals.find(
      (disposedChemical) => disposedChemical._id === chemical._id
    )

    if (disposedChemical) {
      disposedIds.push(disposedChemical._id)
    }

    return {
      CASNo: chemical.CASNo,
      chemicalName: chemical.chemicalName,
      classifications:
        chemical.classifications.length !== 0
          ? chemical.classifications.join(', ')
          : '-',
      COCs: chemical.COCs.length !== 0 ? chemical.COCs.join(', ') : '-',
      state: chemical.state,
      storageClass: chemical.storageClass
        ? 'Class ' + chemical.storageClass
        : '-',
      quantity: chemical.quantity,
      disposed: disposedChemical ? disposedChemical.quantity : 0,
    }
  })

  const disposedChemicalsData = disposedChemicals
    .filter((chemical) => !disposedIds.includes(chemical._id))
    .map((chemical) => ({
      CASNo: chemical.CASNo,
      chemicalName: chemical.chemicalName,
      classifications:
        chemical.classifications.length !== 0
          ? chemical.classifications.join(', ')
          : '-',
      COCs: chemical.COCs.length !== 0 ? chemical.COCs.join(', ') : '-',
      state: chemical.state,
      storageClass: chemical.storageClass
        ? 'Class ' + chemical.storageClass
        : '-',
      quantity: 0,
      disposed: chemical.quantity,
    }))

  const data = [...chemicalsData, ...disposedChemicalsData]

  return (
    data.length !== 0 && (
      <CSVLink
        data={data}
        headers={HEADERS}
        filename={`lab_${auth.currentLabName}_chemical_list.csv`}
        className='button button-outline justify-center'
        target='_blank'
      >
        Chemical List
        <DownloadIcon className='ml-1.5 h-4 w-4 stroke-2' />
      </CSVLink>
    )
  )
}

export default DownloadChemicalList
