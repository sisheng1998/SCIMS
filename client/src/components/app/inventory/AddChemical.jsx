import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import useAuth from '../../../hooks/useAuth'
import ChemicalInfoSection from './components/ChemicalInfoSection'
import StorageInfoSection from './components/StorageInfoSection'
import SafetyAndSecuritySection from './components/SafetyAndSecuritySection'
import ExtraInfoSection from './components/ExtraInfoSection'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import SuccessMessageModal from './components/SuccessMessageModal'

const AddChemical = () => {
	const { auth } = useAuth()
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [labData, setLabData] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getData = async () => {
			try {
				const { data } = await axiosPrivate.post(
					'/api/private/users',
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					data.data.locations.length === 0 && navigate('/inventory')
					setLabData(data.data)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getData()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, auth.currentLabId, navigate])

	const [chemicalId, setChemicalId] = useState('')
	const [SDS, setSDS] = useState('')
	const [classifications, setClassifications] = useState([])
	const [securities, setSecurities] = useState([])
	const [chemicalData, setChemicalData] = useState({
		labId: auth.currentLabId,
		classifications,
		securities,
	})

	const [validated, setValidated] = useState({})
	const [errorMessage, setErrorMessage] = useState('')
	const [openModal, setOpenModal] = useState(false)

	const disabled = Object.values(validated).some((val) => val === false)

	const submitHandler = async (e) => {
		e.preventDefault()
		setErrorMessage('')

		try {
			const formData = new FormData()
			formData.append('chemicalInfo', JSON.stringify(chemicalData))
			!chemicalData.SDSLink && formData.append('SDS', SDS)

			const { data } = await axiosPrivate.post(
				'/api/private/chemical',
				formData
			)
			setChemicalId(data.chemicalId)
			setOpenModal(true)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title
				title='Add New Chemical'
				hasButton={false}
				hasRefreshButton={false}
			/>

			<form onSubmit={submitHandler} spellCheck='false' autoComplete='off'>
				<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
					<div className='w-full max-w-md 2xl:max-w-xs'>
						<h4>Basic Info</h4>
						<p className='text-sm text-gray-500'>
							Basic information of the chemical.
						</p>
					</div>

					<div className='w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm xl:max-w-full'>
						<ChemicalInfoSection
							setSDS={setSDS}
							setClassifications={setClassifications}
							setSecurities={setSecurities}
							setChemicalData={setChemicalData}
							setValidated={setValidated}
						/>
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
							classifications={classifications}
							setClassifications={setClassifications}
							securities={securities}
							setSecurities={setSecurities}
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
							setChemicalData={setChemicalData}
							setValidated={setValidated}
						/>

						<div className='mt-9 flex items-center justify-end space-x-6'>
							{errorMessage && (
								<p className='mr-auto flex items-center text-sm font-medium text-red-600'>
									<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
									{errorMessage}
								</p>
							)}
							<span
								onClick={() => navigate('/inventory')}
								className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
							>
								Cancel
							</span>

							<button className='ml-6 w-40' type='submit' disabled={disabled}>
								Add Chemical
							</button>
						</div>
					</div>
				</div>
			</form>

			{openModal && chemicalId && (
				<SuccessMessageModal
					chemicalId={chemicalId}
					type='Add'
					openModal={openModal}
					setOpenModal={setOpenModal}
				/>
			)}
		</>
	)
}

export default AddChemical
