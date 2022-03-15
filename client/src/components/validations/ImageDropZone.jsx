import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UserCircleIcon } from '@heroicons/react/outline'

const ImageDropZone = () => {
	const onDrop = useCallback((acceptedFiles) => {
		console.log(acceptedFiles)
	}, [])

	const { getRootProps, getInputProps, isDragAccept, isDragReject } =
		useDropzone({
			onDrop,
			multiple: false,
			accept: 'image/png, image/jpeg, image/jpg',
		})

	return (
		<>
			<div
				{...getRootProps()}
				className={`flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 ${
					isDragReject ? 'border-red-600 bg-red-50' : ''
				}${isDragAccept ? 'border-green-600 bg-green-50' : ''}`}
			>
				<input {...getInputProps()} />

				<div className='flex flex-col items-center space-y-2'>
					{isDragReject && (
						<p className='font-medium text-red-600'>
							Sorry, this file is not supported.
						</p>
					)}

					{isDragAccept && (
						<p className='font-medium text-green-600'>Drop the image here!</p>
					)}

					{!isDragAccept && !isDragReject && (
						<>
							<UserCircleIcon className='h-12 w-12 stroke-1 text-gray-300' />
							<button className='button button-outline justify-center px-3 py-2'>
								Choose Image
							</button>
							<p className='text-xs text-gray-500'>or drop image here</p>
						</>
					)}
				</div>
			</div>
			<p className='mt-2 text-xs text-gray-400'>
				Only jpg, jpeg, and png files are supported.
			</p>
		</>
	)
}

export default ImageDropZone
