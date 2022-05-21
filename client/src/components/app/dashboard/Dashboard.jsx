import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import ROLES_LIST from '../../../config/roles_list'
import InfoCard from '../components/InfoCard'
import { UsersIcon, CubeIcon } from '@heroicons/react/outline'
import Title from '../components/Title'
import ScanQRCode from '../components/ScanQRCode'
import useMobile from '../../../hooks/useMobile'
import UserInfoCard from '../components/UserInfoCard'
import QuickAccessCard from '../components/QuickAccessCard'

const Dashboard = () => {
	const navigate = useNavigate()
	const { auth } = useAuth()
	const isMobile = useMobile()

	useEffect(() => {
		!isMobile &&
			auth.currentLabId === ROLES_LIST.admin.toString() &&
			navigate('/admin')
	}, [auth.currentLabId, navigate, isMobile])

	const axiosPrivate = useAxiosPrivate()
	const [isLoading, setIsLoading] = useState(true)
	const [info, setInfo] = useState({})
	const [days, setDays] = useState(30)

	useEffect(() => {
		if (isMobile) {
			return
		}

		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getInfo = async () => {
			try {
				const { data } = await axiosPrivate.put(
					'/api/private/dashboard',
					{ labId: auth.currentLabId, days },
					{
						signal: controller.signal,
					}
				)
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
	}, [axiosPrivate, auth.currentLabId, days, isMobile])

	return isMobile ? (
		<>
			<UserInfoCard />
			<QuickAccessCard />
			<ScanQRCode />
		</>
	) : isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title title='Dashboard' hasButton={false} hasRefreshButton={false}>
				<div className='flex items-baseline self-end text-sm text-gray-500'>
					<p>Last</p>
					<select
						className='cursor-pointer border-none bg-transparent py-0 pr-8 pl-1.5 font-medium text-gray-700 shadow-none outline-none focus:border-none focus:ring-0'
						name='days'
						id='days'
						value={days}
						onChange={(e) => setDays(e.target.value)}
					>
						<option value='30'>30 Days</option>
						<option value='60'>60 Days</option>
						<option value='90'>90 Days</option>
					</select>
				</div>
			</Title>

			<div className='mb-6'>
				<p className='mb-2 text-lg font-medium text-gray-500'>Overview</p>
				<div className='-mr-6 flex flex-wrap xl:-mr-4'>
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

					{info.pendingUsers !== 0 && (
						<InfoCard
							info={info.pendingUsers}
							icon={
								<div className='rounded-full bg-yellow-50 p-4'>
									<UsersIcon className='h-8 w-8 text-yellow-500' />
								</div>
							}
							text='Pending Approval'
						/>
					)}

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

					{info.lowAmountChemicals !== 0 && (
						<InfoCard
							info={info.lowAmountChemicals}
							icon={
								<div className='rounded-full bg-yellow-50 p-4'>
									<CubeIcon className='h-8 w-8 text-yellow-500' />
								</div>
							}
							text='Low Amount'
						/>
					)}

					{info.expiringChemicals !== 0 && (
						<InfoCard
							info={info.expiringChemicals}
							icon={
								<div className='rounded-full bg-yellow-50 p-4'>
									<CubeIcon className='h-8 w-8 text-yellow-500' />
								</div>
							}
							text='Expiring Soon'
						/>
					)}

					{info.expiredChemicals !== 0 && (
						<InfoCard
							info={info.expiredChemicals}
							icon={
								<div className='rounded-full bg-red-50 p-4'>
									<CubeIcon className='h-8 w-8 text-red-500' />
								</div>
							}
							text='Expired'
						/>
					)}

					{info.disposedChemicals !== 0 && (
						<InfoCard
							info={info.disposedChemicals}
							icon={
								<div className='rounded-full bg-red-50 p-4'>
									<CubeIcon className='h-8 w-8 text-red-500' />
								</div>
							}
							text='Disposed'
						/>
					)}
				</div>
			</div>
		</>
	)
}

export default Dashboard
