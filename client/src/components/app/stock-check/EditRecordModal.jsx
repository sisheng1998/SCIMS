import React, { useState, useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { CheckIcon, XIcon } from '@heroicons/react/outline'
import NumberWithUnitField from '../../validations/NumberWithUnitField'
import useAuth from '../../../hooks/useAuth'

const EditRecordModal = ({
	chemical,
	chemicals,
	setChemicals,
	openModal,
	setOpenModal,
}) => {
	const { auth } = useAuth()
	const storageName = auth.currentLabId + '_chemicals'
	const divRef = useRef(null)

	const [amount, setAmount] = useState(chemical.amount)
	const [amountValidated, setAmountValidated] = useState(false)

	const [success, setSuccess] = useState(false)
	const [allowed, setAllowed] = useState(false)

	useEffect(() => {
		setAllowed(amountValidated && amount !== chemical.amount)
	}, [amountValidated, amount, chemical.amount])

	const submitHandler = (e) => {
		e.preventDefault()

		const foundIndex = chemicals.findIndex(
			(chemicalItem) => chemicalItem.chemicalId === chemical.chemicalId
		)
		chemicals[foundIndex].amount = Number(amount)

		setChemicals(chemicals)
		localStorage.setItem(storageName, JSON.stringify(chemicals))

		setSuccess(true)
	}

	const closeHandler = () => {
		setAmount('')

		if (success) {
			setSuccess(false)
		}

		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			initialFocus={divRef}
			className='fixed inset-0 z-20 overflow-y-auto'
		>
			<div
				ref={divRef}
				className='flex min-h-screen items-center justify-center'
			>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div
					className={`relative m-4 w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>Record Updated!</h2>
							<p>The record has been updated.</p>
							<button
								className='button button-solid mt-6 w-32 justify-center'
								onClick={closeHandler}
							>
								Okay
							</button>
						</>
					) : (
						<>
							<div className='mb-4 flex justify-between border-b border-gray-200 pb-3'>
								<h4>Edit Record</h4>
								<XIcon
									className='h-5 w-5 cursor-pointer hover:text-indigo-600'
									onClick={closeHandler}
								/>
							</div>

							<form
								onSubmit={submitHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<label htmlFor='chemical' className='mb-1'>
									Chemical Info
								</label>
								<div className='mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
									<label htmlFor='CAS' className='mb-0.5 text-gray-400'>
										CAS No.
									</label>
									<p className='mb-2 font-medium'>{chemical.CASNo}</p>

									<label htmlFor='name' className='mb-0.5 text-gray-400'>
										Name of Chemical
									</label>
									<p className='mb-2 font-medium'>{chemical.name}</p>

									<label htmlFor='location' className='mb-0.5 text-gray-400'>
										Location
									</label>
									<p className='font-medium'>{chemical.location}</p>
								</div>

								<label htmlFor='amount' className='required-input-label'>
									Amount of Chemical
								</label>
								<NumberWithUnitField
									id='amount'
									placeholder='Enter amount'
									required={true}
									value={amount}
									setValue={setAmount}
									validated={amountValidated}
									setValidated={setAmountValidated}
									unit={chemical.unit}
								/>

								<div className='mt-9 flex items-center justify-end'>
									<span
										onClick={closeHandler}
										className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button
										className='ml-6 w-32'
										type='submit'
										disabled={!allowed}
									>
										Update
									</button>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		</Dialog>
	)
}

export default EditRecordModal
