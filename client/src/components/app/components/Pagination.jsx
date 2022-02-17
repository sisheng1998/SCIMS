import React from 'react'

const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
	const pageNumbers = []

	for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
		pageNumbers.push(i)
	}

	return (
		<nav>
			<ul className='flex'>
				{pageNumbers.map((number) => (
					<li onClick={() => paginate(number)} key={number}>
						{number}
					</li>
				))}
			</ul>
		</nav>
	)
}

export default Pagination
