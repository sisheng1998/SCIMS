import React from 'react'
import { ArrowNarrowUpIcon } from '@heroicons/react/outline'
const FormatValue = (value) =>
	value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const InfoCard = ({ info, icon, text, increment, haveLetterS }) => {
	return (
		<div className='mb-4 w-1/5 min-w-max 2xl:w-1/4 xl:w-1/3'>
			<div className='mr-4 flex h-full items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
				{icon}
				<div>
					<h3 className='font-semibold text-gray-700'>
						{FormatValue(info)}
						{increment && (
							<span className='ml-2 inline-flex items-center text-sm font-medium text-green-600'>
								<ArrowNarrowUpIcon className='inline h-4 w-4' />{' '}
								{FormatValue(increment)}
								{' ' + text.replace('Total ', '')}
								{increment > 1 ? 's' : ''}
							</span>
						)}
					</h3>
					<p className='text-sm font-medium text-gray-500'>
						{text}
						{info > 1 && haveLetterS ? 's' : ''}
					</p>
				</div>
			</div>
		</div>
	)
}

export default InfoCard
