import React, { useState, useEffect } from 'react'
import CASField from '../../../validations/CASField'
import NameField from '../../../validations/NameField'
import NumberWithUnitField from '../../../validations/NumberWithUnitField'

const ChemicalInfoSection = ({ setChemicalData, setValidated }) => {
	const [CAS, setCAS] = useState('')
	const [name, setName] = useState('')
	const [state, setState] = useState('')
	const [unit, setUnit] = useState('')
	const [containerSize, setContainerSize] = useState('')
	const [amount, setAmount] = useState('')
	const [minAmount, setMinAmount] = useState('')

	const [CASValidated, setCASValidated] = useState(false)
	const [nameValidated, setNameValidated] = useState(false)
	const [containerSizeValidated, setContainerSizeValidated] = useState(false)
	const [amountValidated, setAmountValidated] = useState(false)
	const [minAmountValidated, setMinAmountValidated] = useState(false)

	useEffect(() => {
		setChemicalData((prev) => {
			return {
				...prev,
				CAS,
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
				CASValidated,
				nameValidated,
				stateValidated: state !== '',
				unitValidated: unit !== '',
				containerSizeValidated,
				amountValidated,
				minAmountValidated,
			}
		})
	}, [
		CAS,
		name,
		state,
		unit,
		containerSize,
		amount,
		minAmount,
		CASValidated,
		nameValidated,
		containerSizeValidated,
		amountValidated,
		minAmountValidated,
		setChemicalData,
		setValidated,
	])

	return (
		<>
			<div className='flex space-x-6'>
				<div className='w-2/5'>
					<label htmlFor='CAS' className='required-input-label'>
						CAS No.
					</label>
					<CASField
						value={CAS}
						setValue={setCAS}
						validated={CASValidated}
						setValidated={setCASValidated}
						showValidated={true}
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
						showValidated={true}
					/>
				</div>
			</div>

			<div className='mb-6 flex space-x-6'>
				<div className='w-1/3'>
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

				<div className='w-1/3'>
					<label htmlFor='unitSelection' className='required-input-label'>
						Unit
					</label>
					<select
						className='w-full'
						id='unitSelection'
						required
						value={unit}
						onChange={(e) => setUnit(e.target.value)}
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
			</div>

			<div className='flex space-x-6'>
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
						showValidated={true}
					/>
				</div>

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
						showValidated={true}
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
						showValidated={true}
					/>
				</div>
			</div>
		</>
	)
}

export default ChemicalInfoSection
