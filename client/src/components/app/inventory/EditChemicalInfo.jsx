import React, { useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import ChemicalInfoSection from './components/ChemicalInfoSection'
import StorageInfoSection from './components/StorageInfoSection'
import ExtraInfoSection from './components/ExtraInfoSection'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import FormatDate from '../../utils/FormatDate'
import SafetyAndSecuritySection from './components/SafetyAndSecuritySection'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import SuccessMessageModal from './components/SuccessMessageModal'

const EditChemicalInfo = ({ chemical, labData, usersData, setEditSuccess }) => {
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const { auth } = useAuth()

	const [chemicalData, setChemicalData] = useState(chemical)

	const initialSDS = chemical.SDS ? chemical.SDS : ''
	const [SDS, setSDS] = useState(initialSDS)
	const [validated, setValidated] = useState({})

	const [errorMessage, setErrorMessage] = useState('')
	const [isRemove, setIsRemove] = useState(false)
	const [success, setSuccess] = useState(false)
	const [openModal, setOpenModal] = useState(false)

	const disabled = Object.values(validated).some((val) => val === false)

	const submitHandler = async (e) => {
		e.preventDefault()
		setErrorMessage('')

		if (isRemove) {
			try {
				await axiosPrivate.delete('/api/private/chemical', {
					data: { chemicalId: chemicalData._id, labId: labData._id },
				})
				setSuccess(true)
				setOpenModal(true)
			} catch (error) {
				if (error.response?.status === 500) {
					setErrorMessage('Server not responding. Please try again later.')
				} else {
					setErrorMessage('Oops. Something went wrong. Please try again later.')
				}
			}
		} else {
			try {
				if (chemicalData.dateOpen === '') {
					delete chemicalData.dateOpen
				}

				chemicalData.labId = labData._id

				await axiosPrivate.put('/api/private/chemical', chemicalData)
				setSuccess(true)
				setOpenModal(true)
			} catch (error) {
				if (error.response?.status === 500) {
					setErrorMessage('Server not responding. Please try again later.')
				} else {
					setErrorMessage('Oops. Something went wrong. Please try again later.')
				}
			}
		}
	}

	return (
		<>
			<form onSubmit={submitHandler} spellCheck='false' autoComplete='off'>
				<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
					<div className='w-full max-w-md 2xl:max-w-xs'>
						<h4>Basic Info</h4>
						<p className='text-sm text-gray-500'>
							Basic information of the chemical.
						</p>
					</div>

					<div className='w-full max-w-4xl xl:max-w-full'>
						<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
							<ChemicalInfoSection
								chemical={chemicalData}
								setChemicalData={setChemicalData}
								setValidated={setValidated}
							/>
						</div>

						<p className='mt-3 text-sm text-gray-500'>
							Added At:{' '}
							<span className='font-semibold'>
								{FormatDate(chemical.createdAt)}
							</span>
						</p>
					</div>
				</div>

				<hr className='mb-6 mt-9 border-gray-200' />

				<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
					<div className='w-full max-w-md 2xl:max-w-xs'>
						<h4>Storage Info</h4>
						<p className='text-sm text-gray-500'>
							Information of storing the chemical.
						</p>
					</div>

					<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
						<StorageInfoSection
							lab={labData}
							users={usersData}
							chemical={chemicalData}
							setChemicalData={setChemicalData}
							setValidated={setValidated}
						/>
					</div>
				</div>

				<hr className='mb-6 mt-9 border-gray-200' />

				<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
					<div className='w-full max-w-md 2xl:max-w-xs'>
						<h4>Safety/Security Info</h4>
						<p className='text-sm text-gray-500'>
							Security and classification of the chemical.
						</p>
					</div>

					<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
						<SafetyAndSecuritySection
							SDS={SDS}
							setSDS={setSDS}
							chemical={chemicalData}
							setChemicalData={setChemicalData}
							setValidated={setValidated}
						/>
					</div>
				</div>

				<hr className='mb-6 mt-9 border-gray-200' />

				<div className='mb-6 flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
					<div className='w-full max-w-md 2xl:max-w-xs'>
						<h4>Extra Info</h4>
						<p className='text-sm text-gray-500'>
							Extra information for the chemical.
						</p>
					</div>

					<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
						<ExtraInfoSection
							chemical={chemicalData}
							setChemicalData={setChemicalData}
							setValidated={setValidated}
						/>

						{errorMessage && (
							<p className='mt-6 flex items-center text-sm font-medium text-red-600'>
								<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
								{errorMessage}
							</p>
						)}

						{isRemove ? (
							<div className='mt-9 flex items-center justify-end'>
								<div className='mr-auto'>
									<p className='font-medium text-gray-900'>
										Confirm remove chemical from the current lab?
									</p>
									<p className='mt-1 flex items-center text-sm font-medium text-red-600'>
										<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
										This action is irreversible!
									</p>
								</div>
								<span
									onClick={() => setIsRemove(false)}
									className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
								>
									Cancel
								</span>
								<button
									className='button button-solid button-red ml-6 w-40 justify-center text-lg font-semibold'
									onClick={submitHandler}
								>
									Remove
								</button>
							</div>
						) : (
							<div className='mt-9 flex items-center justify-end'>
								{auth.currentRole >= ROLES_LIST.labOwner && (
									<span
										onClick={() => setIsRemove(true)}
										className='mr-auto cursor-pointer self-end text-sm font-medium text-red-600 transition hover:text-red-700'
									>
										Remove Chemical
									</span>
								)}

								<span
									onClick={() => navigate('/inventory')}
									className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
								>
									Cancel
								</span>

								<button className='ml-6 w-40' type='submit' disabled={disabled}>
									Update
								</button>
							</div>
						)}
					</div>
				</div>
			</form>

			{success && openModal && isRemove && (
				<SuccessMessageModal
					type='Remove'
					openModal={openModal}
					setOpenModal={setOpenModal}
				/>
			)}

			{success && openModal && !isRemove && (
				<SuccessMessageModal
					type='Edit'
					openModal={openModal}
					setOpenModal={setOpenModal}
					setEditSuccess={setEditSuccess}
				/>
			)}
		</>
	)
}

export default EditChemicalInfo
