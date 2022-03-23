import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import useAuth from '../../../hooks/useAuth'
import ROLES_LIST from '../../../config/roles_list'
import ChemicalInfoSection from './components/ChemicalInfoSection'

const AddChemical = () => {
	const { auth } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		auth.currentLabId === ROLES_LIST.admin.toString() && navigate('/admin')
	}, [auth.currentLabId, navigate])

	const [CAS, setCAS] = useState('')
	const [name, setName] = useState('')

	const [CASValidated, setCASValidated] = useState(false)
	const [nameValidated, setNameValidated] = useState(false)

	return (
		<>
			<Title
				title='Add New Chemical'
				hasButton={false}
				hasRefreshButton={false}
			/>

			<div className='flex space-x-6 xl:flex-col xl:space-x-0 xl:space-y-6'>
				<div className='w-full max-w-md 2xl:max-w-xs'>
					<h4>Chemical Info</h4>
					<p className='text-sm text-gray-500'>
						Basic information of the chemical.
					</p>
				</div>

				<div className='mb-9 w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
					<ChemicalInfoSection
						CAS={CAS}
						setCAS={setCAS}
						CASValidated={CASValidated}
						setCASValidated={setCASValidated}
						name={name}
						setName={setName}
						nameValidated={nameValidated}
						setNameValidated={setNameValidated}
					/>
				</div>
			</div>

			<hr className='mb-6 border-gray-200' />
		</>
	)
}

export default AddChemical
