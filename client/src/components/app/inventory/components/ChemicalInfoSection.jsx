import React, { useState, useEffect } from 'react'
import CASField from '../../../validations/CASField'
import NameField from '../../../validations/NameField'
import NumberWithUnitField from '../../../validations/NumberWithUnitField'
import ImageLightBox from '../../../utils/ImageLightBox'
import ConvertUnit from '../../../utils/ConvertUnit'
import useAuth from '../../../../hooks/useAuth'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

const ChemicalInfoSection = ({
	chemical,
	setSDS,
	setClassifications,
	setCOCs,
	setChemicalData,
	setValidated,
}) => {
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()

	const [CASNo, setCASNo] = useState(chemical ? chemical.CASId.CASNo : '')
	const [name, setName] = useState(chemical ? chemical.name : '')
	const [state, setState] = useState(chemical ? chemical.state : '')
	const [unit, setUnit] = useState(chemical ? chemical.unit : '')
	const [containerSize, setContainerSize] = useState(
		chemical ? chemical.containerSize : ''
	)
	const [amount, setAmount] = useState(chemical ? chemical.amount : '')
	const [minAmount, setMinAmount] = useState(chemical ? chemical.minAmount : '')

	const [CASNoValidated, setCASNoValidated] = useState(chemical ? true : false)
	const [nameValidated, setNameValidated] = useState(false)
	const [containerSizeValidated, setContainerSizeValidated] = useState(false)
	const [amountValidated, setAmountValidated] = useState(false)
	const [minAmountValidated, setMinAmountValidated] = useState(false)

	const [QRCodeInfo, setQRCodeInfo] = useState('')
	const [openViewImageModal, setOpenViewImageModal] = useState(false)

	let classes = ''

	if (chemical) {
		if (chemical.status === 'Normal') {
			classes = 'bg-green-100 text-green-600'
		} else if (
			chemical.status === 'Expired' ||
			chemical.status === 'Disposed'
		) {
			classes = 'bg-red-100 text-red-600'
		} else {
			// Low Amount / Expiring Soon
			classes = 'bg-yellow-100 text-yellow-600'
		}
	}

	useEffect(() => {
		setChemicalData((prev) => {
			return {
				...prev,
				CASNo,
				name,
				state,
				unit,
				containerSize,
				amount,
				minAmount,
			}
		})

		setValidated((prev) => {
			return {
				...prev,
				CASNoValidated,
				nameValidated,
				stateValidated: state !== '',
				unitValidated: unit !== '',
				containerSizeValidated,
				amountValidated,
				minAmountValidated,
			}
		})
	}, [
		CASNo,
		name,
		state,
		unit,
		containerSize,
		amount,
		minAmount,
		CASNoValidated,
		nameValidated,
		containerSizeValidated,
		amountValidated,
		minAmountValidated,
		setChemicalData,
		setValidated,
	])

	useEffect(() => {
		if (!chemical) {
			setChemicalData((prev) => {
				return {
					...prev,
					SDSLink: '',
				}
			})
			setSDS('')
			setClassifications([])
			setCOCs([])

			if (CASNo && CASNoValidated) {
				let isMounted = true
				const controller = new AbortController()

				const getCASInfo = async () => {
					try {
						const { data } = await axiosPrivate.put(
							'/api/private/cas',
							{
								labId: auth.currentLabId,
								CASNo,
							},
							{
								signal: controller.signal,
							}
						)
						if (isMounted) {
							setChemicalData((prev) => {
								return {
									...prev,
									SDSLink: data.data.SDS,
								}
							})
							setSDS(data.data.SDS)
							setClassifications(data.data.classifications)
							setCOCs(data.data.COCs)
						}
					} catch (error) {
						return
					}
				}

				getCASInfo()

				return () => {
					isMounted = false
					controller.abort()
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [CASNo, CASNoValidated])

	const unitChangeHandler = (e) => {
		const selectedUnit = e.target.value

		containerSizeValidated &&
			setContainerSize((prev) => ConvertUnit(prev, unit, selectedUnit))
		amountValidated &&
			setAmount((prev) => ConvertUnit(prev, unit, selectedUnit))
		minAmountValidated &&
			setMinAmount((prev) => ConvertUnit(prev, unit, selectedUnit))

		setUnit(selectedUnit)
	}

	const viewImageHandler = (name, imageSrc) => {
		setQRCodeInfo({ name, imageSrc })
		setOpenViewImageModal(true)
	}

	return (
		<>
			{chemical ? (
				<>
					<div className='mb-3 flex space-x-6'>
						<div className='w-1/3'>
							<label htmlFor='CAS' className='mb-1'>
								CAS No.
							</label>
							<p className='text-lg'>{chemical.CASId.CASNo}</p>
						</div>

						<div className='flex-1'>
							<label htmlFor='status' className='mb-1'>
								Status
							</label>
							<span
								className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${classes}`}
							>
								{chemical.status}
							</span>
						</div>

						<img
							src={chemical.QRCode}
							alt='QRCode'
							className='h-14 w-14 cursor-pointer object-cover'
							height='200'
							width='200'
							draggable={false}
							onClick={() => viewImageHandler(chemical.name, chemical.QRCode)}
						/>
					</div>

					<div className='w-2/3'>
						<label htmlFor='name' className='required-input-label'>
							Name of Chemical
						</label>
						<NameField
							id='name'
							placeholder='Enter chemical name'
							required={true}
							value={name}
							setValue={setName}
							validated={nameValidated}
							setValidated={setNameValidated}
							withNumber={true}
							showValidated={chemical ? false : true}
						/>
					</div>
				</>
			) : (
				<div className='flex space-x-6'>
					<div className='w-1/3'>
						<label htmlFor='CAS' className='required-input-label'>
							CAS No.
						</label>
						<CASField
							value={CASNo}
							setValue={setCASNo}
							validated={CASNoValidated}
							setValidated={setCASNoValidated}
							showValidated={chemical ? false : true}
						/>
					</div>

					<div className='w-3/5'>
						<label htmlFor='name' className='required-input-label'>
							Name of Chemical
						</label>
						<NameField
							id='name'
							placeholder='Enter chemical name'
							required={true}
							value={name}
							setValue={setName}
							validated={nameValidated}
							setValidated={setNameValidated}
							withNumber={true}
							showValidated={chemical ? false : true}
						/>
					</div>
				</div>
			)}

			<div className='mb-6 flex space-x-6'>
				<div className='w-1/5'>
					<label htmlFor='stateSelection' className='required-input-label'>
						State
					</label>
					<select
						className='w-full'
						id='stateSelection'
						required
						value={state}
						onChange={(e) => setState(e.target.value)}
					>
						<option value=''>Select</option>
						<option value='Solid'>Solid</option>
						<option value='Liquid'>Liquid</option>
						<option value='Gas'>Gas</option>
					</select>
					<p className='mt-2 text-xs text-gray-400'>State of the chemical.</p>
				</div>

				<div className='w-1/5'>
					<label htmlFor='unitSelection' className='required-input-label'>
						Unit
					</label>
					<select
						className='w-full'
						id='unitSelection'
						required
						value={unit}
						onChange={unitChangeHandler}
					>
						<option value=''>Select</option>
						<option value='kg'>kg</option>
						<option value='g'>g</option>
						<option value='mg'>mg</option>
						<option value='L'>L</option>
						<option value='mL'>mL</option>
					</select>
					<p className='mt-2 text-xs text-gray-400'>Unit of the chemical.</p>
				</div>

				<div className='w-1/3'>
					<label htmlFor='containerSize' className='required-input-label'>
						Container Size
					</label>
					<NumberWithUnitField
						id='containerSize'
						placeholder='Enter container size'
						required={true}
						value={containerSize}
						setValue={setContainerSize}
						validated={containerSizeValidated}
						setValidated={setContainerSizeValidated}
						unit={unit}
						showValidated={chemical ? false : true}
					/>
				</div>
			</div>

			<div className='flex space-x-6'>
				<div className='w-1/3'>
					<label htmlFor='amount' className='required-input-label'>
						Amount
					</label>
					<NumberWithUnitField
						id='amount'
						placeholder='Enter amount'
						required={true}
						value={amount}
						setValue={setAmount}
						validated={amountValidated}
						setValidated={setAmountValidated}
						unit={unit}
						maxValue={containerSize}
						showValidated={chemical ? false : true}
					/>
				</div>

				<div className='w-1/3'>
					<label htmlFor='minAmount' className='required-input-label'>
						Minimum Amount <span className='text-xs'>(for notification)</span>
					</label>
					<NumberWithUnitField
						id='minAmount'
						placeholder='Enter minimum amount'
						message='Get notified when this amount reached.'
						required={true}
						value={minAmount}
						setValue={setMinAmount}
						validated={minAmountValidated}
						setValidated={setMinAmountValidated}
						unit={unit}
						maxValue={containerSize}
						showValidated={chemical ? false : true}
					/>
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
		</>
	)
}

export default ChemicalInfoSection
