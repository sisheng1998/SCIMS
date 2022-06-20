import React from 'react'

const CSVTable = ({ data }) => {
	const tableHeaders = data.length !== 0 && Object.keys(data[0])

	return data.length === 0 ? (
		<p className='rounded-lg border border-gray-300 bg-gray-50 p-2 text-center'>
			No data found.
		</p>
	) : (
		<div className='overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pb-3'>
			<div className='max-h-96 overflow-x-auto'>
				<div className='border-b border-gray-200'>
					<table className='min-w-full divide-y divide-gray-200 whitespace-nowrap'>
						<thead className='sticky top-0 bg-gray-50'>
							<tr>
								{tableHeaders.map((title, index) => (
									<th
										scope='col'
										key={index}
										className='px-3 py-2 text-left font-medium text-gray-500'
									>
										{title}
									</th>
								))}
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200 bg-white'>
							{data.map((chemical) => (
								<tr key={chemical._id} className='hover:bg-indigo-50/30'>
									{tableHeaders.map((title, index) => (
										<td key={index} className='px-3 py-2'>
											{chemical[title]}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default CSVTable
