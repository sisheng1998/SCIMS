import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import Procedure from './Procedure'
import ProcedureModal from './ProcedureModal'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import LoadingScreen from '../../utils/LoadingScreen'
import ActionCard from './ActionCard'
import ScanQRCodeModal from '../components/ScanQRCodeModal'
import AddRecordModal from './AddRecordModal'
import ChemicalsLoop from './ChemicalsLoop'

const StockCheck = () => {
	const { auth, setAuth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let isMounted = true
		const controller = new AbortController()

		setIsLoading(true)

		const getChemicals = async () => {
			try {
				const { data } = await axiosPrivate.post(
					'/api/private/chemicals',
					{
						labId: auth.currentLabId,
					},
					{
						signal: controller.signal,
					}
				)
				if (isMounted) {
					let processedChemicals = []
					let processedDisposedChemicals = []

					if (
						data.data.locations.length !== 0 &&
						data.data.chemicals.length !== 0
					) {
						processedChemicals = data.data.chemicals.map((chemical) => {
							const location = data.data.locations.find(
								(location) => location._id === chemical.locationId
							)

							return {
								...chemical,
								location: location ? location.name : '-',
							}
						})
					}

					if (
						data.data.locations.length !== 0 &&
						data.data.disposedChemicals.length !== 0
					) {
						processedDisposedChemicals = data.data.disposedChemicals.map(
							(chemical) => {
								const location = data.data.locations.find(
									(location) => location._id === chemical.locationId
								)

								return {
									...chemical,
									location: location ? location.name : '-',
								}
							}
						)
					}

					setAuth((prev) => {
						return {
							...prev,
							stockCheck: {
								chemicals: processedChemicals,
								disposedChemicals: processedDisposedChemicals,
							},
						}
					})
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
	}, [axiosPrivate, auth.currentLabId, setAuth])

	const storageName = auth.currentLabId + '_chemicals'

	const recordedChemicals = JSON.parse(localStorage.getItem(storageName))

	const [started, setStarted] = useState(recordedChemicals !== null)
	const [chemicals, setChemicals] = useState(
		recordedChemicals !== null ? recordedChemicals : []
	)

	const [openProcedureModal, setOpenProcedureModal] = useState(false)
	const [openScanQRCodeModal, setOpenScanQRCodeModal] = useState(false)
	const [scannedChemicalId, setScannedChemicalId] = useState('')

	const startStockCheck = () => {
		localStorage.setItem(storageName, JSON.stringify([]))
		setStarted(true)
	}

	return isLoading ? (
		<LoadingScreen />
	) : !started ? (
		<div className='auth-card mb-6 self-center'>
			<h4 className='mb-2'>Stock Check Procedure</h4>
			<Procedure showFirstStep={true} />
			<button
				className='button button-solid mt-6 w-full justify-center'
				onClick={startStockCheck}
			>
				Start Stock Check
			</button>
		</div>
	) : (
		<>
			<Title title='Stock Check' hasButton={false} hasRefreshButton={false}>
				<div className='ml-2 flex flex-1 justify-start'>
					<QuestionMarkCircleIcon
						onClick={() => setOpenProcedureModal(true)}
						className='h-4 w-4 stroke-2 text-gray-400'
					/>
				</div>
			</Title>

			<p className='mb-2 text-sm font-medium text-gray-500'>Stock Check Info</p>
			<ActionCard
				chemicals={chemicals}
				setChemicals={setChemicals}
				setStarted={setStarted}
			/>

			<p className='mb-2 text-sm font-medium text-gray-500'>
				Recorded Chemicals
			</p>
			{chemicals.length === 0 ? (
				<div className='mb-4 rounded-lg bg-white p-4 text-center shadow'>
					No record added.
				</div>
			) : (
				<ChemicalsLoop chemicals={chemicals} setChemicals={setChemicals} />
			)}

			<button
				className='button button-solid fixed bottom-2 right-2 z-10 -translate-y-12 justify-center py-2 shadow-md'
				onClick={() => setOpenScanQRCodeModal(true)}
			>
				<PlusIcon className='-ml-1 mr-1.5 h-4 w-4 stroke-2' />
				Add Record
			</button>

			{openProcedureModal && (
				<ProcedureModal
					openModal={openProcedureModal}
					setOpenModal={setOpenProcedureModal}
				/>
			)}

			{openScanQRCodeModal && (
				<ScanQRCodeModal
					openModal={openScanQRCodeModal}
					setOpenModal={setOpenScanQRCodeModal}
					isStockCheck={true}
					setScannedChemicalId={setScannedChemicalId}
				/>
			)}

			{scannedChemicalId && (
				<AddRecordModal
					scannedChemicalId={scannedChemicalId}
					setScannedChemicalId={setScannedChemicalId}
					chemicals={chemicals}
					setChemicals={setChemicals}
				/>
			)}
		</>
	)
}

export default StockCheck
