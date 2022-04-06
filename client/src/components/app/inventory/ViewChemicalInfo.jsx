import React, { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import ImageLightBox from '../../utils/ImageLightBox'
import FormatDate, { FormatChemicalDate } from '../../utils/FormatDate'
import FormatAmountWithUnit from '../../utils/FormatAmountWithUnit'
import STORAGE_GROUPS from '../../../config/storage_groups'
import {
	CLASSIFICATION_LIST,
	SECURITY_LIST,
} from '../../../config/safety_security_list'
import { ExclamationIcon, PencilAltIcon } from '@heroicons/react/outline'
import { PaperClipIcon } from '@heroicons/react/solid'
import UpdateAmountModal from './components/UpdateAmountModal'

const ViewChemicalInfo = ({
	chemical,
	lab,
	setUpdateAmountSuccess,
	setEdit,
}) => {
	const { auth } = useAuth()
	const [QRCodeInfo, setQRCodeInfo] = useState('')
	const [openViewImageModal, setOpenViewImageModal] = useState(false)
	const [openUpdateAmountModal, setOpenUpdateAmountModal] = useState(false)

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

	return (
		<>
			<div className='mx-auto mb-6 w-full max-w-4xl xl:max-w-full'>
				{/* Basic Info */}
				<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<div className='flex justify-between'>
						<div>
							<h4>Basic Info</h4>
							<p className='text-sm text-gray-500'>
								Basic information of the chemical.
							</p>
						</div>

						<img
							src={chemical.QRCode}
							alt='QRCode'
							className='h-10 w-10 cursor-pointer object-cover'
							height='200'
							width='200'
							draggable={false}
							onClick={() => viewImageHandler(chemical.name, chemical.QRCode)}
						/>
					</div>

					<hr className='mb-6 mt-4 border-gray-200' />

					<div className='mb-6 flex space-x-6'>
						<div className='flex-1'>
							<label htmlFor='CAS' className='mb-0.5 text-gray-500'>
								CAS No.
							</label>
							<p className='font-medium'>{chemical.CAS}</p>
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
								{Number(chemical.amount) < Number(chemical.minAmount) && (
									<span className='tooltip ml-1.5' data-tooltip='Low Amount'>
										<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
									</span>
								)}
								{currentUser.role >= ROLES_LIST.undergraduate && !isDisposed && (
									<button
										onClick={() => setOpenUpdateAmountModal(true)}
										className='tooltip ml-1.5 text-gray-400 transition hover:text-indigo-700 focus:outline-none'
										data-tooltip='Update Amount'
									>
										<PencilAltIcon className='h-5 w-5' />
									</button>
								)}
							</p>
						</div>
					</div>
				</div>

				<p className='mt-3 mb-9 text-sm text-gray-500'>
					Added At:{' '}
					<span className='font-semibold'>
						{FormatDate(chemical.createdAt)}
					</span>
				</p>

				{/* Storage Info */}
				<div className='mb-9 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<h4>Storage Info</h4>
					<p className='text-sm text-gray-500'>
						Information of storing the chemical.
					</p>

					<hr className='mb-6 mt-4 border-gray-200' />

					<div className='mb-6 flex space-x-6'>
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
									!allowedStorageGroups.includes(storageGroup[0].code) && (
										<span
											className='tooltip ml-1.5'
											data-tooltip={`Storage Group ${storageGroup[0].code} is not allowed in this location`}
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

					<div className='flex space-x-6'>
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
								{chemical.status === 'Expiring Soon' && (
									<span className='tooltip ml-1.5' data-tooltip='Expiring Soon'>
										<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
									</span>
								)}
								{chemical.status === 'Expired' && (
									<span className='tooltip ml-1.5' data-tooltip='Expired'>
										<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-red-600' />
									</span>
								)}
							</p>
						</div>
					</div>
				</div>

				{/* Safety/Security Info */}
				<div className='mb-9 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<h4>Safety/Security Info</h4>
					<p className='text-sm text-gray-500'>
						Security and classification of the chemical.
					</p>

					<hr className='mb-6 mt-4 border-gray-200' />

					<div className='mb-6'>
						<label htmlFor='SDS' className='mb-1 text-gray-500'>
							Safety Data Sheet (SDS)
						</label>
						<div className='flex items-center justify-between space-x-6 rounded-lg border border-gray-200 py-2 px-3 pr-4 font-medium'>
							<p className='flex items-center'>
								<PaperClipIcon className='mr-2 h-5 w-5 text-gray-400' />
								{chemical.SDS.split('/').pop()}
							</p>
							<a href={chemical.SDS} target='_blank' rel='noreferrer'>
								View
							</a>
						</div>
					</div>

					<div className='mb-4'>
						<label htmlFor='classification' className='mb-1 text-gray-500'>
							GHS Classification
						</label>
						{chemical.classifications.length !== 0
							? CLASSIFICATION_LIST.filter((classification) =>
									chemical.classifications.includes(classification)
							  ).map((classification, index) => (
									<span
										key={index}
										className={`mb-2 mr-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
											classification === 'Carcinogen' ||
											classification === 'Health Hazard' ||
											classification === 'Irritant' ||
											classification === 'Acute Toxicity'
												? 'bg-blue-100 text-blue-600'
												: 'bg-yellow-100 text-yellow-600'
										}`}
									>
										{classification}
									</span>
							  ))
							: '-'}
					</div>

					<div>
						<label htmlFor='security' className='mb-1 text-gray-500'>
							Security
						</label>
						{chemical.securities.length !== 0
							? SECURITY_LIST.filter((security) =>
									chemical.securities.includes(security)
							  ).map((security, index) => (
									<span
										key={index}
										className='mb-2 mr-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600'
									>
										{security}
									</span>
							  ))
							: '-'}
					</div>
				</div>

				{/* Extra Info */}
				<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<h4>Extra Info</h4>
					<p className='text-sm text-gray-500'>
						Extra information for the chemical.
					</p>

					<hr className='mb-6 mt-4 border-gray-200' />

					<div className='mb-6 flex space-x-6'>
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

					{auth.currentLabId === lab._id &&
						currentUser.role >= ROLES_LIST.postgraduate &&
						!isDisposed && (
							<div className='mt-9'>
								<button
									className='button button-outline w-60 justify-center px-4 py-3'
									onClick={() => {
										setEdit(true)
										window.scrollTo(0, 0)
									}}
								>
									Edit Chemical Info
								</button>
							</div>
						)}
				</div>
			</div>

			{openViewImageModal && QRCodeInfo && (
				<ImageLightBox
					object={QRCodeInfo}
					type='QRCode'
					openModal={openViewImageModal}
					setOpenModal={setOpenViewImageModal}
				/>
			)}

			{openUpdateAmountModal && (
				<UpdateAmountModal
					chemical={chemical}
					openModal={openUpdateAmountModal}
					setOpenModal={setOpenUpdateAmountModal}
					setUpdateAmountSuccess={setUpdateAmountSuccess}
				/>
			)}
		</>
	)
}

export default ViewChemicalInfo
