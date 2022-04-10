import React from 'react'
import { ArrowNarrowUpIcon } from '@heroicons/react/outline'
const FormatValue = (value) =>
	value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const InfoCard = ({ info, icon, text, increment, haveLetterS }) => {
	return (
		<div className='mb-6 w-1/5 min-w-max 2xl:w-1/4 xl:mb-4 xl:w-1/3 lg:w-1/2 sm:w-full'>
			<div className='mr-6 flex h-full items-center space-x-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow xl:mr-4'>
				{icon}
				<div>
					<h2 className='font-semibold text-gray-700'>
						{FormatValue(info)}
						{increment && (
							<span className='ml-2 inline-flex items-center text-sm font-medium text-green-600'>
								<ArrowNarrowUpIcon className='inline h-4 w-4' />{' '}
								{FormatValue(increment)}
								{' ' + text.replace('Total ', '').toLowerCase()}
								{increment > 1 ? 's' : ''}
							</span>
						)}
					</h2>
					<p className='font-medium text-gray-500'>
						{text}
						{info > 1 && haveLetterS ? 's' : ''}
					</p>
				</div>
			</div>
		</div>
	)
}

export default InfoCard
