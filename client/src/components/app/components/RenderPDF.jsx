import React from 'react'
import FormatBytes from '../../utils/FormatBytes'
import { DocumentTextIcon } from '@heroicons/react/outline'
import { PaperClipIcon } from '@heroicons/react/solid'

const RenderPDF = ({ PDF, setPDF }) => {
	return (
		<div className='mb-6'>
			{PDF.toString().toLowerCase().endsWith('.pdf') ? (
				<div className='flex items-center justify-between space-x-6 rounded-lg border border-gray-200 py-2 px-3 pr-4 font-medium'>
					<p className='flex items-center'>
						<PaperClipIcon className='mr-2 h-5 w-5 text-gray-400' />
						{PDF.split('/').pop()}
					</p>
					<a href={PDF} target='_blank' rel='noreferrer'>
						View
					</a>
				</div>
			) : (
				<>
					<div className='mt-3 flex items-center'>
						<DocumentTextIcon className='mr-2 h-12 w-12 shrink-0 stroke-1 text-gray-400' />

						<div className='overflow-auto'>
							<p className='max-w-full overflow-hidden text-ellipsis text-sm font-medium'>
								{PDF.name}
							</p>

							<p className='text-xs'>{FormatBytes(PDF.size)}</p>
						</div>
					</div>

					<button
						className='button button-outline mt-4 px-3 py-2 text-xs font-semibold'
						onClick={() => setPDF('')}
					>
						Change File
					</button>
				</>
			)}
		</div>
	)
}

export default RenderPDF
