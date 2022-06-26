import React from 'react'

const LogTable = ({ data, type }) => {
	const tableHeaders = ['No.', 'CAS No.', 'Name']
	type === 'updated' && tableHeaders.push('Changes')
	type === 'failed' && tableHeaders.push('Reason of Failure')

	return (
		<div className='overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pb-3'>
			<div className='max-h-64 overflow-x-auto'>
				<div className='border-b border-gray-200'>
					<table className='min-w-full whitespace-nowrap'>
						<thead className='sticky top-0 z-[1] bg-gray-50'>
							<tr className='sticky-border-b'>
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
							{data.length === 0 ? (
								<tr>
									<td
										className='px-3 py-2 text-center'
										colSpan={tableHeaders.length}
									>
										No record.
									</td>
								</tr>
							) : (
								data.map((chemical, index) => (
									<tr key={index} className='hover:bg-indigo-50/30'>
										<td className='px-3 py-2'>{chemical.index + 1}</td>
										<td className='px-3 py-2'>{chemical.CASNo}</td>
										<td className='px-3 py-2'>{chemical.name}</td>

										{type === 'updated' && (
											<td className='px-3 py-2'>{chemical.changes}</td>
										)}

										{type === 'failed' && (
											<td className='px-3 py-2'>{chemical.reason}</td>
										)}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default LogTable
