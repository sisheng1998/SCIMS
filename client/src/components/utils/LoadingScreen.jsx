import React from 'react'

const LoadingScreen = () => {
	return (
		<div className='flex flex-col items-center p-12'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'
				aria-hidden='true'
				className='h-16 w-16 animate-spin'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
					className='origin-center -scale-x-100'
				></path>
			</svg>
			<p className='mt-4 text-xl font-medium'>Retrieving information...</p>
		</div>
	)
}

export default LoadingScreen
