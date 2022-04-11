import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import ImageDropZone from '../components/ImageDropZone'
import RenderImage from '../components/RenderImage'
import SampleImages from '../components/SampleImages'

const UpdateAvatarModal = ({ openModal, setOpenModal }) => {
	const axiosPrivate = useAxiosPrivate()

	const [image, setImage] = useState('')
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const submitHandler = async (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('avatar', image)

		try {
			await axiosPrivate.post('/api/private/profile/avatar', formData)
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	const closeHandler = () => {
		setErrorMessage('')

		if (success) {
			window.location.reload(false)
		}

		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div
					className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>Picture Updated!</h2>
							<p>Your profile picture has been updated.</p>
							<button
								className='button button-solid mt-6 w-32 justify-center'
								onClick={closeHandler}
							>
								Okay
							</button>
						</>
					) : (
						<>
							<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
								<h4>Update Profile Picture</h4>
								<XIcon
									className='h-5 w-5 cursor-pointer hover:text-indigo-600'
									onClick={closeHandler}
								/>
							</div>

							{errorMessage && (
								<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
									<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
									{errorMessage}
								</p>
							)}

							<form
								onSubmit={submitHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<div className='flex items-baseline justify-between'>
									<label htmlFor='profilePic' className='required-input-label'>
										Profile Picture
									</label>
									{!image && <SampleImages />}
								</div>

								{!image ? (
									<>
										<ImageDropZone
											setImage={setImage}
											setErrorMessage={setErrorMessage}
										/>
										<p className='mt-2 text-xs text-gray-400'>
											Only JPG, JPEG, and PNG are supported. Max file size: 5
											MB.
										</p>
									</>
								) : (
									<RenderImage image={image} setImage={setImage} />
								)}

								<div className='mt-9 flex items-center justify-end'>
									<span
										onClick={closeHandler}
										className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button className='ml-6 w-40' type='submit' disabled={!image}>
										Update
									</button>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		</Dialog>
	)
}

export default UpdateAvatarModal
