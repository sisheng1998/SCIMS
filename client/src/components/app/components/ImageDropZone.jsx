import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UserCircleIcon } from '@heroicons/react/outline'
import ResizeImage from './ResizeImage'

const ImageDropZone = ({ setImage }) => {
	const MAX_SIZE_IN_BYTES = 5242880 // 5MB

	const onDrop = useCallback((acceptedFiles) => {
		if (acceptedFiles) {
			const image = acceptedFiles[0]

			if (image.size > MAX_SIZE_IN_BYTES) {
				console.log('File size already exceed the limit.')
			} else if (
				image.type.toLowerCase() !== 'image/png' &&
				image.type.toLowerCase() !== 'image/jpeg' &&
				image.type.toLowerCase() !== 'image/jpg'
			) {
				console.log('File format not supported.')
			} else {
				ResizeImage(image, setImage)
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const { getRootProps, getInputProps, isDragAccept, isDragReject } =
		useDropzone({
			onDrop,
			multiple: false,
			accept: 'image/png, image/jpeg, image/jpg',
		})

	return (
		<div
			{...getRootProps()}
			className={`flex h-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 ${
				isDragReject ? 'border-red-600 bg-red-50' : ''
			}${isDragAccept ? 'border-green-600 bg-green-50' : ''}`}
		>
			<input {...getInputProps()} />

			<div className='flex flex-col items-center'>
				{isDragAccept && (
					<p className='font-medium text-green-600'>Drop your image here</p>
				)}

				{isDragReject && (
					<p className='font-medium text-red-600'>
						Sorry, this file format is not supported
					</p>
				)}

				{!isDragAccept && !isDragReject && (
					<>
						<UserCircleIcon className='mb-1 h-12 w-12 stroke-1 text-gray-400' />
						<p className='font-medium'>Drag & drop your image here</p>
						<p className='text-sm text-gray-500'>
							or{' '}
							<span className='font-semibold text-indigo-600 hover:text-indigo-700'>
								click to select image
							</span>
						</p>
					</>
				)}
			</div>
		</div>
	)
}

export default ImageDropZone
