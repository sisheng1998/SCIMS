import React, { useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import ChemicalInfoSection from './components/ChemicalInfoSection'
import StorageInfoSection from './components/StorageInfoSection'
import ExtraInfoSection from './components/ExtraInfoSection'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import FormatDate from '../../utils/FormatDate'
import SafetyAndSecuritySection from './components/SafetyAndSecuritySection'

const EditChemicalInfo = ({ chemical, labData, usersData }) => {
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [chemicalData, setChemicalData] = useState(chemical)

	const initialSDS = chemical.SDS ? chemical.SDS : ''
	const [SDS, setSDS] = useState(initialSDS)
	const [validated, setValidated] = useState({})
	const [errorMessage, setErrorMessage] = useState('')

	const disabled = Object.values(validated).some((val) => val === false)

	const submitHandler = async (e) => {
		e.preventDefault()

		try {
			if (chemicalData.dateOpen === '') {
				delete chemicalData.dateOpen
			}
			console.log(chemicalData)
			// const { data } = await axiosPrivate.post(
			// 	'/api/private/chemical',
			// 	chemicalData
			// )
			// console.log(data.chemicalId)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	return (
		<form onSubmit={submitHandler} spellCheck='false' autoComplete='off'>
			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Basic Info</h4>
					<p className='text-sm text-gray-500'>
						Basic information of the chemical.
					</p>
				</div>

				<div className='mb-9 w-full max-w-4xl'>
					{errorMessage && (
						<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
							<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
							{errorMessage}
						</p>
					)}

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

			<hr className='mb-6 border-gray-200' />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Storage Info</h4>
					<p className='text-sm text-gray-500'>
						Information of storing the chemical.
					</p>
				</div>

				<div className='mb-9 w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<StorageInfoSection
						lab={labData}
						users={usersData}
						chemical={chemicalData}
						setChemicalData={setChemicalData}
						setValidated={setValidated}
					/>
				</div>
			</div>

			<hr className='mb-6 border-gray-200' />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Safety/Security Info</h4>
					<p className='text-sm text-gray-500'>
						Security and classification of the chemical.
					</p>
				</div>

				<div className='mb-9 w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<SafetyAndSecuritySection
						SDS={SDS}
						setSDS={setSDS}
						chemical={chemicalData}
						setChemicalData={setChemicalData}
						setValidated={setValidated}
					/>
				</div>
			</div>

			<hr className='mb-6 border-gray-200' />

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Extra Info</h4>
					<p className='text-sm text-gray-500'>
						Extra information for the chemical.
					</p>
				</div>

				<div className='mb-9 w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<ExtraInfoSection
						chemical={chemicalData}
						setChemicalData={setChemicalData}
						setValidated={setValidated}
					/>

					<div className='mt-9 flex items-center justify-end'>
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
				</div>
			</div>
		</form>
	)
}

export default EditChemicalInfo
