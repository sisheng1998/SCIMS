import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DocumentAddIcon } from '@heroicons/react/outline'
import ExtractClassifications from './ExtractClassifications'

const PDFDropZone = ({
	setPDF,
	classifications,
	setClassifications,
	setExtractionResult,
	setErrorMessage,
}) => {
	const MAX_SIZE_IN_BYTES = 5242880 // 5MB

	const onDrop = useCallback(
		(acceptedFiles, rejectedFiles) => {
			if (acceptedFiles.length !== 0) {
				const PDF = acceptedFiles[0]

				if (PDF.size > MAX_SIZE_IN_BYTES) {
					setErrorMessage('The file size already exceed the limit.')
				} else if (PDF.type.toLowerCase() !== 'application/pdf') {
					setErrorMessage('This file format is not supported.')
				} else {
					setErrorMessage('')

					const getClassifications = async () => {
						const extractedResult = await ExtractClassifications(PDF)

						if (classifications.length === 0 && extractedResult.length !== 0) {
							setClassifications(extractedResult)
						}

						setExtractionResult(extractedResult.join(', '))
						setPDF(PDF)
					}

					getClassifications()
				}
			} else {
				if (rejectedFiles.length > 1) {
					setErrorMessage('Only single file is accepted.')
				} else {
					setErrorMessage('This file format is not supported.')
				}
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[classifications]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: 'application/pdf',
	})

	return (
		<div
			{...getRootProps()}
			className={`flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 focus:outline-none ${
				isDragActive ? 'border-indigo-600 bg-indigo-50' : ''
			}`}
		>
			<input {...getInputProps()} />

			<div className='flex flex-col items-center'>
				{isDragActive ? (
					<p className='font-medium text-indigo-600'>Drop PDF here</p>
				) : (
					<>
						<DocumentAddIcon className='mb-1 h-10 w-10 stroke-1 text-gray-400' />
						<p className='font-medium'>Drag & drop PDF here</p>
						<p className='text-sm text-gray-500'>
							or{' '}
							<span className='font-semibold text-indigo-600 hover:text-indigo-700'>
								click to select PDF
							</span>
						</p>
					</>
				)}
			</div>
		</div>
	)
}

export default PDFDropZone
