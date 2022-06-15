import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../../utils/LoadingScreen'
import ChemicalsTable from './ChemicalsTable'

const Chemicals = () => {
	const axiosPrivate = useAxiosPrivate()

	const [chemicals, setChemicals] = useState([])
	const [disposedChemicals, setDisposedChemicals] = useState([])
	const [labs, setLabs] = useState([])

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

		const getChemicals = async () => {
			try {
				const { data } = await axiosPrivate.get('/api/admin/chemicals', {
					signal: controller.signal,
				})
				if (isMounted) {
					setLabs(data.labs)

					const processedChemicals = data.chemicals.map((chemical, index) => {
						return {
							...chemical,
							labName: chemical.lab.labName,
							CAS: chemical.CASId.CASNo,
							index,
						}
					})
					setChemicals(processedChemicals)

					const processedDisposedChemicals = data.disposedChemicals.map(
						(chemical, index) => {
							return {
								...chemical,
								labName: chemical.lab.labName,
								CAS: chemical.CASId.CASNo,
								index,
							}
						}
					)
					setDisposedChemicals(processedDisposedChemicals)

					setIsLoading(false)
				}
			} catch (error) {
				return
			}
		}

		getChemicals()

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
				title='All Chemicals'
				hasButton={false}
				hasRefreshButton={true}
				setRefresh={setRefresh}
			/>

			<ChemicalsTable
				labs={labs}
				chemicals={chemicals}
				disposedChemicals={disposedChemicals}
				setUpdateAmountSuccess={setRefresh}
			/>
		</>
	)
}

export default Chemicals
