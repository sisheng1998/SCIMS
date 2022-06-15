import React, { useState, useEffect, useRef } from 'react'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import ImageLightBox from '../../utils/ImageLightBox'
import FormatDate, { FormatChemicalDate } from '../../utils/FormatDate'
import FormatAmountWithUnit from '../../utils/FormatAmountWithUnit'
import STORAGE_GROUPS from '../../../config/storage_groups'
import {
	ExclamationIcon,
	PencilAltIcon,
	ExclamationCircleIcon,
	ArrowLeftIcon,
} from '@heroicons/react/outline'
import ChemicalUsageModal from './components/ChemicalUsageModal'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import SuccessMessageModal from './components/SuccessMessageModal'
import useMobile from '../../../hooks/useMobile'
import SafetyAndSecuritySection from './components/SafetyAndSecuritySection'
import { useNavigate } from 'react-router-dom'

const ViewChemicalInfo = ({ chemical, lab, setUpdateSuccess, setEdit }) => {
	const isMounted = useRef(true)
	useEffect(() => {
		return () => {
			isMounted.current = false
		}
	}, [])

	const navigate = useNavigate()
	const isMobile = useMobile()
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [QRCodeInfo, setQRCodeInfo] = useState('')
	const [openViewImageModal, setOpenViewImageModal] = useState(false)
	const [openChemicalUsageModal, setOpenChemicalUsageModal] = useState(false)

	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [openModal, setOpenModal] = useState(false)

	const isDisposed = chemical.status === 'Disposed' ? true : false

	let classes = ''

	if (chemical.status === 'Normal') {
		classes = 'bg-green-100 text-green-600'
	} else if (chemical.status === 'Expired' || isDisposed) {
		classes = 'bg-red-100 text-red-600'
	} else {
		// Low Amount / Expiring Soon
		classes = 'bg-yellow-100 text-yellow-600'
	}

	let chemicalLocation = '-'
	let allowedStorageGroups = []

	if (lab && chemical && chemical.locationId) {
		lab.locations.forEach((location) => {
			if (location._id === chemical.locationId) {
				chemicalLocation = location.name
				allowedStorageGroups = location.storageGroups
			}
		})
	}

	const storageGroup =
		chemical.storageGroup &&
		STORAGE_GROUPS.filter((group) => group.code === chemical.storageGroup)

	const currentUser = auth.roles.find((role) => role.lab._id === lab._id)

	const viewImageHandler = (name, imageSrc) => {
		setQRCodeInfo({ name, imageSrc })
		setOpenViewImageModal(true)
	}

	const cancelDisposalHandler = async () => {
		setErrorMessage('')

		try {
			await axiosPrivate.post('/api/private/chemical/cancel-disposal', {
				chemicalId: chemical._id,
				labId: lab._id,
			})
			if (isMounted.current) {
				setOpenModal(true)
				setSuccess(true)
			}
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	return (
		<>
			{isMobile && (
				<div className='mb-2'>
					<p
						onClick={() => navigate('/inventory')}
						className='inline-flex cursor-pointer items-center font-medium text-indigo-600 transition hover:text-indigo-700'
					>
						<ArrowLeftIcon className='mr-1 h-4 w-4' />
						Back to Inventory
					</p>
				</div>
			)}

			<div className='mx-auto mb-6 w-full max-w-4xl xl:max-w-full lg:mb-0'>
				{/* Basic Info */}
				<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<div className='flex justify-between'>
						<div>
							<h4>Basic Info</h4>
							<p className='text-sm text-gray-500'>
								Basic information of the chemical.
							</p>
						</div>

						{!isMobile && (
							<img
								src={chemical.QRCode}
								alt='QRCode'
								className='h-10 w-10 cursor-pointer object-cover'
								height='200'
								width='200'
								draggable={false}
								onClick={() => viewImageHandler(chemical.name, chemical.QRCode)}
							/>
						)}
					</div>

					<hr className='mb-6 mt-4 border-gray-200' />

					<div className='mb-6 flex space-x-6 lg:flex-col lg:space-x-0 lg:space-y-6'>
						<div className='flex-1'>
							<label htmlFor='CAS' className='mb-0.5 text-gray-500'>
								CAS No.
							</label>
							<p className='font-medium'>{chemical.CASId.CASNo}</p>
						</div>

						<div className='flex-1'>
							<label htmlFor='name' className='mb-0.5 text-gray-500'>
								Name of Chemical
							</label>
							<p className='font-medium'>{chemical.name}</p>
						</div>
					</div>

					<div className='mb-6 flex space-x-6'>
						<div className='flex-1'>
							<label htmlFor='status' className='mb-1 text-gray-500'>
								Status
							</label>
							<span
								className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${classes}`}
							>
								{chemical.status}
							</span>
						</div>

						<div className='flex-1'>
							<label htmlFor='state' className='mb-0.5 text-gray-500'>
								State
							</label>
							<p className='font-medium'>{chemical.state}</p>
						</div>
					</div>

					<div className='flex space-x-6'>
						<div className='flex-1'>
							<label htmlFor='containerSize' className='mb-0.5 text-gray-500'>
								Container Size
							</label>
							<p className='font-medium'>
								{FormatAmountWithUnit(chemical.containerSize, chemical.unit)}
							</p>
						</div>

						<div className='flex-1'>
							<label htmlFor='amount' className='mb-0.5 text-gray-500'>
								Remaining Amount
							</label>
							<p className='flex items-center font-medium'>
								{FormatAmountWithUnit(chemical.amount, chemical.unit)}
								{Number(chemical.amount) <= Number(chemical.minAmount) &&
									!isDisposed && (
										<span className='tooltip ml-1.5' data-tooltip='Low Amount'>
											<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
										</span>
									)}
								{currentUser.role >= ROLES_LIST.undergraduate &&
									!isDisposed &&
									!isMobile && (
										<button
											onClick={() => setOpenChemicalUsageModal(true)}
											className='tooltip ml-1.5 text-gray-400 transition hover:text-indigo-700 focus:outline-none'
											data-tooltip='Chemical Usage'
										>
											<PencilAltIcon className='h-5 w-5' />
										</button>
									)}
							</p>
						</div>
					</div>
				</div>

				<div className='mt-3 mb-9 text-sm text-gray-500 lg:mb-4 lg:text-xs'>
					<p>
						Added At:{' '}
						<span className='font-semibold'>
							{FormatDate(chemical.createdAt)}
						</span>
					</p>

					{isDisposed && (
						<p className='mt-1'>
							Disposed At:{' '}
							<span className='font-semibold'>
								{FormatDate(chemical.disposedDate)}
							</span>
						</p>
					)}
				</div>

				{/* Storage Info */}
				<div className='mb-9 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:mb-4'>
					<h4>Storage Info</h4>
					<p className='text-sm text-gray-500'>
						Information of storing the chemical.
					</p>

					<hr className='mb-6 mt-4 border-gray-200' />

					<div className='mb-6 flex space-x-6 lg:flex-col lg:space-x-0 lg:space-y-6'>
						<div className='flex-1'>
							<label htmlFor='lab' className='mb-0.5 text-gray-500'>
								Lab
							</label>
							<p className='font-medium'>{'Lab ' + lab.labName}</p>
						</div>

						<div className='flex-1'>
							<label htmlFor='location' className='mb-0.5 text-gray-500'>
								{isDisposed ? 'Previous ' : ''}Location
							</label>
							<p className='font-medium'>
								{chemicalLocation}
								{chemical.storageGroup &&
									chemicalLocation !== '-' &&
									!allowedStorageGroups.includes(storageGroup[0].code) &&
									!isDisposed && (
										<span
											className='tooltip ml-1.5'
											data-tooltip={`Group ${storageGroup[0].code} is not allowed in this location`}
										>
											<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
										</span>
									)}
							</p>
						</div>
					</div>

					<div className='mb-6'>
						<label htmlFor='storageGroup' className='mb-0.5 text-gray-500'>
							Storage Group
						</label>
						<p className='font-medium'>
							{chemical.storageGroup
								? `${storageGroup[0].code} - ${storageGroup[0].description}`
								: '-'}
						</p>
					</div>

					<div className='flex space-x-6 lg:flex-col lg:space-x-0 lg:space-y-6'>
						<div className='flex-1'>
							<label htmlFor='dateIn' className='mb-0.5 text-gray-500'>
								Date In
							</label>
							<p className='font-medium'>
								{FormatChemicalDate(chemical.dateIn)}
							</p>
						</div>

						<div className='flex-1'>
							<label htmlFor='dateOpen' className='mb-0.5 text-gray-500'>
								Date Open
							</label>
							<p className='font-medium'>
								{chemical.dateOpen
									? FormatChemicalDate(chemical.dateOpen)
									: '-'}
							</p>
						</div>

						<div className='flex-1'>
							<label htmlFor='expirationDate' className='mb-0.5 text-gray-500'>
								Expiration Date
							</label>
							<p className='font-medium'>
								{FormatChemicalDate(chemical.expirationDate)}
								{chemical.status === 'Expired' && (
									<span className='tooltip ml-1.5' data-tooltip='Expired'>
										<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
									</span>
								)}
								{chemical.status === 'Expiring Soon' && (
									<span className='tooltip ml-1.5' data-tooltip='Expiring Soon'>
										<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
									</span>
								)}
							</p>
						</div>
					</div>
				</div>

				{/* Safety/Security Info */}
				<div className='mb-9 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:mb-4'>
					<h4>Safety/Security Info</h4>
					<p className='text-sm text-gray-500'>
						Security and classifications of the chemical.
					</p>

					<hr className='mb-6 mt-4 border-gray-200' />

					<SafetyAndSecuritySection
						SDS={chemical.CASId.SDS}
						classifications={chemical.CASId.classifications}
						COCs={chemical.CASId.COCs}
					/>
				</div>

				{/* Extra Info */}
				<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<h4>Extra Info</h4>
					<p className='text-sm text-gray-500'>
						Extra information for the chemical.
					</p>

					<hr className='mb-6 mt-4 border-gray-200' />

					<div className='mb-6 flex space-x-6 lg:flex-col lg:space-x-0 lg:space-y-6'>
						<div className='flex-1'>
							<label htmlFor='supplier' className='mb-0.5 text-gray-500'>
								Supplier Name
							</label>
							<p className='font-medium'>
								{chemical.supplier ? chemical.supplier : '-'}
							</p>
						</div>

						<div className='flex-1'>
							<label htmlFor='brand' className='mb-0.5 text-gray-500'>
								Brand Name
							</label>
							<p className='font-medium'>
								{chemical.brand ? chemical.brand : '-'}
							</p>
						</div>
					</div>

					<div>
						<label htmlFor='notes' className='mb-1 text-gray-500'>
							Notes
						</label>
						<pre className='min-h-[120px] rounded-lg border border-gray-200 py-2 px-3 font-sans font-medium'>
							{chemical.notes ? chemical.notes : '-'}
						</pre>
					</div>

					{errorMessage && (
						<p className='mt-6 flex items-center text-sm font-medium text-red-600'>
							<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
							{errorMessage}
						</p>
					)}

					{auth.currentLabId === lab._id &&
						currentUser.role >= ROLES_LIST.postgraduate &&
						!isMobile && (
							<div className='mt-9'>
								{isDisposed ? (
									<span
										className='cursor-pointer text-sm font-medium text-red-600 transition hover:text-red-700'
										onClick={cancelDisposalHandler}
									>
										Cancel Disposal
									</span>
								) : (
									<button
										className='button button-outline w-60 justify-center px-4 py-3'
										onClick={() => {
											setEdit(true)
											window.scrollTo(0, 0)
										}}
									>
										Edit Chemical Info
									</button>
								)}
							</div>
						)}
				</div>
			</div>

			{currentUser.role >= ROLES_LIST.undergraduate && !isDisposed && isMobile && (
				<button
					className='button button-solid fixed bottom-2 right-2 z-10 -translate-y-12 justify-center py-2 shadow-md'
					onClick={() => setOpenChemicalUsageModal(true)}
				>
					<PencilAltIcon className='-ml-1 mr-1.5 h-5 w-5' />
					Chemical Usage
				</button>
			)}

			{openViewImageModal && QRCodeInfo && (
				<ImageLightBox
					object={QRCodeInfo}
					type='QRCode'
					openModal={openViewImageModal}
					setOpenModal={setOpenViewImageModal}
				/>
			)}

			{openChemicalUsageModal && (
				<ChemicalUsageModal
					chemical={chemical}
					openModal={openChemicalUsageModal}
					setOpenModal={setOpenChemicalUsageModal}
					setUpdateAmountSuccess={setUpdateSuccess}
				/>
			)}

			{success && openModal && (
				<SuccessMessageModal
					type='Cancel Disposal'
					openModal={openModal}
					setOpenModal={setOpenModal}
					setEditSuccess={setUpdateSuccess}
				/>
			)}
		</>
	)
}

export default ViewChemicalInfo
