import React from 'react'
import CASField from '../../../validations/CASField'
import NameField from '../../../validations/NameField'

const ChemicalInfoSection = ({
	CAS,
	setCAS,
	CASValidated,
	setCASValidated,
	name,
	setName,
	nameValidated,
	setNameValidated,
}) => {
	return (
		<div className='flex space-x-6'>
			<div className='w-1/3'>
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
					showValidated={true}
				/>
			</div>
		</div>
	)
}

export default ChemicalInfoSection
