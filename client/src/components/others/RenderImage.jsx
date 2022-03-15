import React from 'react'
import FormatBytes from './FormatBytes'

const RenderImage = ({ image, setImage }) => {
	return (
		<div className='flex h-36 items-center rounded-lg border-2 border-dashed border-gray-200 p-2'>
			<img
				className='ml-2 mr-4 h-28 w-28 rounded-full border border-gray-200 object-cover'
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
