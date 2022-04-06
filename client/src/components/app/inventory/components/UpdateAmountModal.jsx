import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
	CheckIcon,
	XIcon,
	ExclamationCircleIcon,
	ExclamationIcon,
} from '@heroicons/react/outline'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import FormatAmountWithUnit from '../../../utils/FormatAmountWithUnit'
import NumberWithUnitField from '../../../validations/NumberWithUnitField'
import FormatDate from '../../../utils/FormatDate'

const UpdateAmountModal = ({
	chemical,
	openModal,
	setOpenModal,
	setUpdateAmountSuccess,
}) => {
	const axiosPrivate = useAxiosPrivate()

	const chemicalId = chemical._id
	const [usage, setUsage] = useState('')
	const [remainingAmount, setRemainingAmount] = useState('')

	const [usageValidated, setUsageValidated] = useState(false)

	const [allowed, setAllowed] = useState(false)
	const [success, setSuccess] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const submitHandler = async (e) => {
		e.preventDefault()

		try {
			await axiosPrivate.post('/api/private/chemical/usage', {
				chemicalId,
				amount: remainingAmount,
			})
			setSuccess(true)
		} catch (error) {
			if (error.response?.status === 500) {
				setErrorMessage('Server not responding. Please try again later.')
			} else {
				setErrorMessage('Oops. Something went wrong. Please try again later.')
			}
		}
	}

	useEffect(() => {
		setErrorMessage('')
		setAllowed(usageValidated && usage !== '0')
		if (usage) setRemainingAmount(Number(chemical.amount) - Number(usage))
	}, [usage, usageValidated, chemical])

	const closeHandler = () => {
		setErrorMessage('')
		setUsage('')
		setRemainingAmount('')

		if (success) {
			setSuccess(false)
			setUpdateAmountSuccess(true)
		}

		setOpenModal(false)
	}

	return (
		<Dialog
			open={openModal}
			onClose={() => {}}
			className='fixed inset-0 z-10 overflow-y-auto'
		>
			<div className='flex min-h-screen items-center justify-center'>
				<Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
				<div
					className={`relative w-full rounded-lg bg-white p-6 shadow ${
						success ? 'max-w-sm text-center' : 'max-w-xl'
					}`}
				>
					{success ? (
						<>
							<CheckIcon className='mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600' />
							<h2 className='mt-6 mb-2 text-green-600'>Amount Updated!</h2>
							<p>The chemical amount has been updated.</p>
							<button
								className='button button-solid mt-6 w-32 justify-center'
								onClick={closeHandler}
							>
								Okay
							</button>
						</>
					) : (
						<>
							<div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
								<h4>Update Chemical Amount</h4>
								<XIcon
									className='h-5 w-5 cursor-pointer hover:text-indigo-600'
									onClick={closeHandler}
								/>
							</div>

							{errorMessage && (
								<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
									<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
									{errorMessage}
								</p>
							)}

							<form
								onSubmit={submitHandler}
								spellCheck='false'
								autoComplete='off'
							>
								<div className='grid grid-cols-3 gap-6'>
									<div>
										<label htmlFor='CAS' className='mb-1'>
											CAS No.
										</label>
										{chemical.CAS}
									</div>

									<div className='col-span-2'>
										<label htmlFor='name' className='mb-1'>
											Name
										</label>
										{chemical.name}
									</div>

									<div>
										<label htmlFor='containerSize' className='mb-1'>
											Container Size
										</label>
										{FormatAmountWithUnit(
											chemical.containerSize,
											chemical.unit
										)}
									</div>

									<div>
										<label htmlFor='amount' className='mb-1'>
											Current Amount
										</label>
										{FormatAmountWithUnit(chemical.amount, chemical.unit)}
										{Number(chemical.amount) < Number(chemical.minAmount) && (
											<span
												className='tooltip ml-1.5'
												data-tooltip='Low Amount'
											>
												<ExclamationIcon className='inline-block h-4 w-4 stroke-2 text-yellow-600' />
											</span>
										)}
									</div>

									<div>
										<label htmlFor='lastUpdated' className='mb-1'>
											Last Updated
										</label>
										{FormatDate(chemical.lastUpdated)}
									</div>
								</div>

								<div className='my-6 flex items-center justify-between space-x-6 rounded-lg border border-gray-200 bg-gray-50 p-6'>
									<div className='text-center'>
										<p className='text-xl'>
											{FormatAmountWithUnit(chemical.amount, chemical.unit)}
										</p>
										<p className='text-sm font-medium text-gray-500'>
											Current Amount
										</p>
									</div>

									<p className='text-gray-400'>-</p>

									<div className='text-center'>
										<p className='text-xl'>
											{usage && usageValidated
												? FormatAmountWithUnit(usage, chemical.unit)
												: `-- ${chemical.unit}`}
										</p>
										<p className='text-sm font-medium text-gray-500'>Usage</p>
									</div>

									<p className='text-gray-400'>=</p>

									<div className='text-center'>
										<p className='text-xl'>
											{remainingAmount >= 0 && usageValidated
												? FormatAmountWithUnit(remainingAmount, chemical.unit)
												: `-- ${chemical.unit}`}
										</p>
										<p className='text-sm font-medium text-gray-500'>
											Remaining Amount
										</p>
									</div>
								</div>

								<div className='w-2/3'>
									<label htmlFor='usage' className='required-input-label'>
										Usage <span className='text-xs'>(Amount used)</span>
									</label>
									<NumberWithUnitField
										id='usage'
										placeholder='Enter chemical usage'
										required={true}
										value={usage}
										setValue={setUsage}
										validated={usageValidated}
										setValidated={setUsageValidated}
										unit={chemical.unit}
										maxValue={chemical.amount}
										usage={true}
									/>
								</div>

								<div className='mt-9 flex items-center justify-end'>
									<span
										onClick={closeHandler}
										className='cursor-pointer font-medium text-gray-500 transition hover:text-indigo-600'
									>
										Cancel
									</span>
									<button
										className='ml-6 w-40'
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

export default UpdateAmountModal
