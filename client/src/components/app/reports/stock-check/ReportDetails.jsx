import React from 'react'
import FormatDate from '../../../utils/FormatDate'
import {
	ClipboardListIcon,
	BeakerIcon,
	CheckCircleIcon,
	QuestionMarkCircleIcon,
	XCircleIcon,
} from '@heroicons/react/outline'

const InfoCard = ({ icon, value, text, haveLetterS }) => {
	return (
		<div className='mb-4 w-1/5 min-w-max 2xl:w-1/4 xl:w-1/3'>
			<div className='mr-4 flex h-full items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
				{icon}

				<div>
					<h3 className='text-gray-700'>{value}</h3>
					<p className='text-sm font-medium text-gray-500'>
						{text}
						{haveLetterS && value > 1 ? 's' : ''}
					</p>
				</div>
			</div>
		</div>
	)
}

const ReportDetails = ({ report }) => {
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
					<BeakerIcon className='h-14 w-14 rounded-full bg-indigo-50 p-3 text-indigo-500' />
				}
				value={total}
				text='Total Chemical'
				haveLetterS={true}
			/>

			<InfoCard
				icon={
					<CheckCircleIcon className='h-14 w-14 rounded-full bg-green-50 p-2.5 text-green-500' />
				}
				value={report.recordedChemicals.length}
				text='Recorded Chemical'
				haveLetterS={true}
			/>

			<InfoCard
				icon={
					<QuestionMarkCircleIcon className='h-14 w-14 rounded-full bg-yellow-50 p-2.5 text-yellow-500' />
				}
				value={report.missingChemicals.length}
				text='Missing Chemical'
				haveLetterS={true}
			/>

			<InfoCard
				icon={
					<XCircleIcon className='h-14 w-14 rounded-full bg-red-50 p-2.5 text-red-500' />
				}
				value={report.disposedChemicals.length}
				text='Disposed Chemical'
				haveLetterS={true}
			/>
		</div>
	)
}

export default ReportDetails
