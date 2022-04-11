import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LabNameField from '../../validations/LabNameField'
import FormatDate from '../../utils/FormatDate'
import StaticLabInfo from '../components/StaticLabInfo'

const EditLabInfoModal = ({ lab, openModal, setOpenModal }) => {
	const axiosPrivate = useAxiosPrivate()

	const labId = lab._id
	const [labName, setLabName] = useState(lab.labName)
	const [labNameValidated, setLabNameValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const editLabInfoHandler = async (e) => {
		e.preventDefault()

		try {
			await axiosPrivate.put('/api/private/lab', {
				labId,
				labName,
			})
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 409) {
				setErrorMessage('A lab with this name already exists.')
			} else if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
		setAllowed(labNameValidated && labName !== lab.labName)
	}, [lab, labName, labNameValidated])

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
							<h2 className='mt-6 mb-2 text-green-600'>Lab Info Updated!</h2>
							<p>The lab information has been updated.</p>
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
								<h4>Edit Lab Information</h4>
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
								onSubmit={editLabInfoHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<div className='mb-6'>
									<label htmlFor='labName' className='required-input-label'>
										Lab Name
									</label>
									<LabNameField
										value={labName}
										setValue={setLabName}
										validated={labNameValidated}
										setValidated={setLabNameValidated}
									/>
									{labNameValidated || labName === '' ? (
										<p className='mt-2 text-xs text-gray-400'>
											Name of the current lab.
										</p>
									) : (
										<p className='mt-2 text-xs text-red-600'>
											Please enter a valid lab name.
										</p>
									)}
								</div>

								<StaticLabInfo
									labUsersNo={lab.labUsers.length + 1}
									chemicalsNo={lab.chemicals.length}
								/>

								<div className='mb-9 mt-6 flex items-center justify-between space-x-6 text-sm text-gray-500'>
									<p>
										Created At:{' '}
										<span className='font-semibold'>
											{FormatDate(lab.createdAt)}
										</span>
									</p>
									<p>
										Last Updated:{' '}
										<span className='font-semibold'>
											{FormatDate(lab.lastUpdated)}
										</span>
									</p>
								</div>

								<div className='flex items-center justify-end'>
									<span
										onClick={closeHandler}
										className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button
										className='ml-6 w-40'
										type='submit'
										disabled={!allowed}
									>
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

export default EditLabInfoModal
