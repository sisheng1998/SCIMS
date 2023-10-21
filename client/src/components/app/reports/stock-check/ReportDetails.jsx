import React from 'react'
import FormatDate from '../../../utils/FormatDate'
import InfoCard from '../InfoCard'
import {
  ClipboardListIcon,
  BeakerIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
  UsersIcon,
} from '@heroicons/react/outline'

const ReportDetails = ({ report }) => {
  const involvedUserCount = new Set(
    report.recordedChemicals.map((item) => item.recordedBy._id)
  ).size

  const total =
    report.recordedChemicals.length +
    report.missingChemicals.length +
    report.disposedChemicals.length

  return (
    <div className='-mr-4 mb-2 flex flex-wrap'>
      <InfoCard
        icon={
          <ClipboardListIcon className='h-14 w-14 rounded-full bg-purple-50 p-3 text-purple-500' />
        }
        value={`Lab ${report.lab.labName}`}
        text={FormatDate(report.date)}
      />

      <InfoCard
        icon={
          <UsersIcon className='h-14 w-14 rounded-full bg-blue-50 p-3 text-blue-500' />
        }
        value={involvedUserCount}
        text='Involved User'
        haveLetterS={true}
      />

      <InfoCard
        icon={
          <BeakerIcon className='h-14 w-14 rounded-full bg-indigo-50 p-3 text-indigo-500' />
        }
        value={total}
        text='Total Chemical'
        haveLetterS={true}
      />

      <InfoCard
        icon={
          <CheckCircleIcon className='h-14 w-14 rounded-full bg-green-50 p-3 text-green-500' />
        }
        value={report.recordedChemicals.length}
        text='Recorded Chemical'
        haveLetterS={true}
      />

      <InfoCard
        icon={
          <QuestionMarkCircleIcon className='h-14 w-14 rounded-full bg-yellow-50 p-3 text-yellow-500' />
        }
        value={report.missingChemicals.length}
        text='Missing Chemical'
        haveLetterS={true}
      />

      <InfoCard
        icon={
          <XCircleIcon className='h-14 w-14 rounded-full bg-red-50 p-3 text-red-500' />
        }
        value={report.disposedChemicals.length}
        text='Disposed Chemical'
        haveLetterS={true}
      />
    </div>
  )
}

export default ReportDetails
