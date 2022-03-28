import React, { useState, useEffect } from 'react'
import {
	CLASSIFICATION_LIST,
	SECURITY_LIST,
} from '../../../../config/safety_security_list'
import SafetySecurityField from '../../../validations/SafetySecurityField'
import PDFDropZone from '../../components/PDFDropZone'
import RenderPDF from '../../components/RenderPDF'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

const SafetyAndSecuritySection = ({
	SDS,
	setSDS,
	chemical,
	chemicalData,
	setChemicalData,
	setValidated,
}) => {
	const [classifications, setClassifications] = useState(
		chemical ? chemical.classifications : []
	)
	const [securities, setSecurities] = useState(
		chemical ? chemical.securities : []
	)

	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		setChemicalData((prev) => {
			return {
				...prev,
				classifications,
				securities,
			}
		})

		setValidated((prev) => {
			return {
				...prev,
			}
		})
	}, [classifications, securities, setChemicalData, setValidated])

	return (
		<>
			{errorMessage && (
				<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
					<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
					{errorMessage}
				</p>
			)}

			{!SDS ? (
				<>
					<label htmlFor='SDS' className='required-input-label'>
						Safety Data Sheet (SDS)
					</label>
					<PDFDropZone setPDF={setSDS} setErrorMessage={setErrorMessage} />
					<p className='mt-2 text-xs text-gray-400'>
						Only PDF is supported. Max file size: 5 MB.
					</p>
				</>
			) : (
				<>
					<label
						htmlFor='SDS'
						className={
							SDS.toString().toLowerCase().endsWith('.pdf')
								? 'mb-1'
								: 'required-input-label'
						}
					>
						Safety Data Sheet (SDS)
					</label>
					<RenderPDF PDF={SDS} setPDF={setSDS} />

					<label htmlFor='classification'>Classification</label>
					<SafetySecurityField
						lists={CLASSIFICATION_LIST}
						value={
							chemicalData && chemicalData.classifications.length !== 0
								? chemicalData.classifications
								: classifications
						}
						setValue={setClassifications}
					/>

					<label htmlFor='security' className='mt-6'>
						Security
					</label>
					<SafetySecurityField
						lists={SECURITY_LIST}
						value={
							chemicalData && chemicalData.securities.length !== 0
								? chemicalData.securities
								: securities
						}
						setValue={setSecurities}
					/>
				</>
			)}
		</>
	)
}

export default SafetyAndSecuritySection
