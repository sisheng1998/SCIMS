import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import ROLES_LIST from '../../../../config/roles_list'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import InfoCard from '../../components/InfoCard'
import UserInfoCard from '../../components/UserInfoCard'
import QuickAccessCard from '../../components/QuickAccessCard'
import { UsersIcon, BeakerIcon, CubeIcon } from '@heroicons/react/outline'

const Dashboard = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()

	useEffect(() => {
		auth.currentLabId !== ROLES_LIST.admin.toString() && navigate('/')
	}, [auth.currentLabId, navigate])

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState({})

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/admin/dashboard', {
					signal: controller.signal,
				})
				if (isMounted) {
					setInfo(data.data)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getInfo()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<div className='mb-6'>
			<UserInfoCard />

			<p className='mb-2 text-lg font-medium text-gray-500'>
				Overview <span className='text-sm text-gray-400'>(Past 90 Days)</span>
			</p>
			<div className='-mr-6 flex flex-wrap xl:-mr-4'>
				<InfoCard
					info={info.totalLabs}
					icon={
						<div className='rounded-full bg-blue-50 p-4'>
							<BeakerIcon className='h-8 w-8 text-blue-500' />
						</div>
					}
					text='Total Lab'
					increment={info.newLabs === 0 ? false : info.newLabs}
					haveLetterS={true}
				/>

				<InfoCard
					info={info.totalUsers}
					icon={
						<div className='rounded-full bg-purple-50 p-4'>
							<UsersIcon className='h-8 w-8 text-purple-500' />
						</div>
					}
					text='Total User'
					increment={info.newUsers === 0 ? false : info.newUsers}
					haveLetterS={true}
				/>

				<InfoCard
					info={info.totalChemicals}
					icon={
						<div className='rounded-full bg-pink-50 p-4'>
							<CubeIcon className='h-8 w-8 text-pink-500' />
						</div>
					}
					text='Total Chemical'
					increment={info.newChemicals === 0 ? false : info.newChemicals}
					haveLetterS={true}
				/>
			</div>

			<QuickAccessCard />
		</div>
	)
}

export default Dashboard
