import React from 'react'
import Title from './components/Title'

const Users = () => {
	const addUser = () => {
		console.log('Hello')
	}

	return (
		<>
			<Title
				title='All Users'
				hasButton={true}
				buttonText='Add User'
				buttonAction={addUser}
			/>
			<div className='min-h-screen rounded-lg bg-white p-4 shadow'>hello</div>
		</>
	)
}

export default Users
