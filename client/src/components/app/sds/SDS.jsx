import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import LoadingScreen from '../../utils/LoadingScreen'
import SDSTable from './SDSTable'
import AddSDSModal from './AddSDSModal'

const SDS = () => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [SDS, setSDS] = useState([])
	const [openModal, setOpenModal] = useState(false)

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

		const getSDS = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/private/sds', {
					signal: controller.signal,
				})
				if (isMounted) {
					const processedData = data.data.map((SDS, index) => {
						return {
							...SDS,
							index,
						}
					})

					setSDS(processedData)
					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getSDS()

		return () => {
			isMounted = false
			controller.abort()
		}
	}, [axiosPrivate, refresh])

	return isLoading ? (
		<LoadingScreen />
	) : (
		<>
			<Title
				title='All Safety Data Sheets'
				hasButton={auth.currentRole >= ROLES_LIST.postgraduate}
				hasRefreshButton={true}
				buttonText='Add Safety Data Sheet'
				buttonAction={() => setOpenModal(true)}
				setRefresh={setRefresh}
			/>

			<SDSTable SDS={SDS} />

			{openModal && (
				<AddSDSModal
					existedSDS={SDS}
					openModal={openModal}
					setOpenModal={setOpenModal}
					setAddSDSSuccess={setRefresh}
				/>
			)}
		</>
	)
}

export default SDS
