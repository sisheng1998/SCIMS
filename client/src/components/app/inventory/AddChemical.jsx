import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import ChemicalInfoSection from './components/ChemicalInfoSection'
import StorageInfoSection from './components/StorageInfoSection'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'

const AddChemical = () => {
	const { auth } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		auth.currentLabId === ROLES_LIST.admin.toString() && navigate('/admin')
	}, [auth.currentLabId, navigate])

	const axiosPrivate = useAxiosPrivate()
	const [labData, setLabData] = useState('')
	const [usersData, setUsersData] = useState('')

	const [isLoading, setIsLoading] = useState(true)
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		if (refresh) {
			setRefresh(false)
			return
		}

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

					data.data.labUsers.unshift(data.data.labOwner)
					const processedData = data.data.labUsers
						.map((user) => {
							const currentRole = user.roles.find((role) => {
								return role.lab === data.data._id
							})

							return {
								...user,
								roleValue: currentRole.role,
								status: currentRole.status,
							}
						})
						.filter(
							(user) =>
								user.isEmailVerified &&
								user.roleValue !== ROLES_LIST.guest &&
								user.status === 'Active'
						)
					// LabUsers array
					setUsersData(processedData)

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
	}, [axiosPrivate, auth.currentLabId, refresh, navigate])

	const [chemicalData, setChemicalData] = useState({ labId: auth.currentLabId })

	const [validated, setValidated] = useState({})

	const disabled = Object.values(validated).some((val) => val === false)

	const submitHandler = async (e) => {
		e.preventDefault()

		try {
			console.log(chemicalData)
		} catch (error) {
			console.log(error)
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
						<h4>Chemical Info</h4>
						<p className='text-sm text-gray-500'>
							Basic information of the chemical.
						</p>
					</div>

					<div className='mb-9 w-full max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
						<ChemicalInfoSection
							setChemicalData={setChemicalData}
							setValidated={setValidated}
						/>
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
							setChemicalData={setChemicalData}
							setValidated={setValidated}
						/>
					</div>
				</div>

				<button className='w-40' type='submit' disabled={disabled}>
					Add Chemical
				</button>
			</form>
		</>
	)
}

export default AddChemical