import React from 'react'
import FormatBytes from '../../others/FormatBytes'

const RenderImage = ({ image, setImage }) => {
	return (
		<div className='flex h-36 items-center rounded-lg'>
			<img
				className='mr-4 h-32 w-32 rounded-full border border-gray-200 object-cover'
				src={URL.createObjectURL(image)}
				alt='User Profile'
			/>

			<div className='overflow-auto'>
				<p className='max-w-full overflow-hidden text-ellipsis text-sm font-medium'>
					{image.name}
				</p>

				<p className='text-xs'>{FormatBytes(image.size)}</p>

				<button
					className='button button-outline mt-4 px-3 py-2 text-xs font-semibold'
					onClick={() => setImage('')}
				>
					Change Image
				</button>
			</div>
		</div>
	)
}

export default RenderImage
