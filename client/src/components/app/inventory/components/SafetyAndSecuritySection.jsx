import React, { useState, useEffect } from 'react'
import {
	CLASSIFICATION_LIST,
	CLASSIFICATION_ICON,
	COC_LIST,
} from '../../../../config/safety_security_list'
import SafetySecurityField from '../../../validations/SafetySecurityField'
import PDFDropZone from '../../components/PDFDropZone'
import RenderPDF from '../../components/RenderPDF'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

const SafetyAndSecuritySection = ({
	SDS,
	setSDS,
	classifications,
	setClassifications,
	COCs,
	setCOCs,
	setChemicalData,
	validated,
	setValidated,
}) => {
	const [errorMessage, setErrorMessage] = useState('')
	const [extractionResult, setExtractionResult] = useState('')

	useEffect(() => {
		if (SDS.toString().toLowerCase().endsWith('.pdf')) {
			setValidated &&
				setValidated((prev) => {
					return {
						...prev,
						SDSValidated: true,
					}
				})

			return
		}

		setChemicalData((prev) => {
			return {
				...prev,
				classifications,
				COCs,
			}
		})

		setValidated((prev) => {
			return {
				...prev,
				SDSValidated: SDS ? true : false,
			}
		})
	}, [classifications, COCs, setChemicalData, setValidated, SDS])

	return SDS.toString().toLowerCase().endsWith('.pdf') ? (
		<>
			<label htmlFor='SDS' className='mb-1'>
				Safety Data Sheet (SDS)
			</label>
			<RenderPDF PDF={SDS} setPDF={setSDS} />

			<div className='mb-4 mt-6'>
				<label htmlFor='classification'>GHS Classifications</label>
				{classifications.length !== 0
					? CLASSIFICATION_LIST.map(
							(classification, index) =>
								classifications.includes(classification) && (
									<span
										key={index}
										className='tooltip mb-2 mr-2 inline-flex'
										data-tooltip={classification}
									>
										<img
											className='h-16 w-16 flex-1'
											src={CLASSIFICATION_ICON[index]}
											alt='GHS Classifications'
										/>
									</span>
								)
					  )
					: '-'}
			</div>

			<div>
				<label htmlFor='coc'>Chemical of Concerns</label>
				{COCs.length !== 0
					? COC_LIST.filter((security) => COCs.includes(security)).map(
							(security, index) => (
								<span
									key={index}
									className='mb-2 mr-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600'
								>
									{security}
								</span>
							)
					  )
					: '-'}
			</div>
		</>
	) : (
		<div
			className={`transition ${
				validated.CASNoValidated ? '' : 'pointer-events-none opacity-50'
			}`}
		>
			{errorMessage && (
				<p className='mb-6 flex items-center text-sm font-medium text-red-600'>
					<ExclamationCircleIcon className='mr-2 h-5 w-5 shrink-0' />{' '}
					{errorMessage}
				</p>
			)}

			<label htmlFor='SDS' className='required-input-label'>
				Safety Data Sheet (SDS)
			</label>
			{!SDS ? (
				<>
					<PDFDropZone
						setPDF={setSDS}
						classifications={classifications}
						setClassifications={setClassifications}
						setExtractionResult={setExtractionResult}
						setErrorMessage={setErrorMessage}
					/>
					<p className='mt-2 text-xs text-gray-400'>
						Only PDF is supported. Max file size: 10 MB.
					</p>
				</>
			) : (
				<RenderPDF
					PDF={SDS}
					setPDF={setSDS}
					extractionResult={extractionResult}
				/>
			)}

			<label htmlFor='classification' className='mt-6'>
				GHS Classifications
			</label>
			<SafetySecurityField
				lists={CLASSIFICATION_LIST}
				value={classifications}
				setValue={setClassifications}
			/>

			<label htmlFor='coc' className='mt-6'>
				Chemical of Concerns
			</label>
			<SafetySecurityField
				lists={COC_LIST}
				value={COCs}
				setValue={setCOCs}
				isCOC={true}
			/>
		</div>
	)
}

export default SafetyAndSecuritySection
