import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UserCircleIcon } from '@heroicons/react/outline'
import ResizeImage from './ResizeImage'

const ImageDropZone = ({ setImage, setErrorMessage }) => {
	const MAX_SIZE_IN_BYTES = 5242880 // 5MB

	const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
		if (acceptedFiles.length !== 0) {
			const image = acceptedFiles[0]

			if (image.size > MAX_SIZE_IN_BYTES) {
				setErrorMessage('The file size already exceed the limit.')
			} else if (
				image.type.toLowerCase() !== 'image/png' &&
				image.type.toLowerCase() !== 'image/jpeg' &&
				image.type.toLowerCase() !== 'image/jpg'
			) {
				setErrorMessage('This file format is not supported.')
			} else {
				setErrorMessage('')
				ResizeImage(image, setImage)
			}
		} else {
			if (rejectedFiles.length > 1) {
				setErrorMessage('Only single file is accepted.')
			} else {
				setErrorMessage('This file format is not supported.')
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: 'image/png, image/jpeg, image/jpg',
	})

	return (
		<div
			{...getRootProps()}
			className={`flex h-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 focus:outline-none ${
				isDragActive ? 'border-indigo-600 bg-indigo-50' : ''
			}`}
		>
			<input {...getInputProps()} />

			<div className='flex flex-col items-center'>
				{isDragActive ? (
					<p className='font-medium text-indigo-600'>Drop your image here</p>
				) : (
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
