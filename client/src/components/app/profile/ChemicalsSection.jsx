import React from 'react'
import FormatAmountWithUnit from '../../utils/FormatAmountWithUnit'
import { FormatChemicalDate } from '../../utils/FormatDate'

const tableHeaders = ['Lab', 'CAS No.', 'Amount', 'Status', 'Exp. Date']

const ChemicalsSection = ({ chemicals }) => {
	return (
		<div className='w-full max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm xl:max-w-full'>
			<div className='overflow-x-auto'>
				<div className='border-b border-gray-200'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								{tableHeaders.map((title, index) => (
									<th
										scope='col'
										key={index}
										className='px-6 py-4 text-left font-medium text-gray-500'
									>
										{title}
									</th>
								))}
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200 bg-white'>
							{chemicals
								.sort((a, b) =>
									a.lab.labName.toLowerCase() > b.lab.labName.toLowerCase()
										? 1
										: -1
								)
								.map((chemical) => {
									let classes

									if (chemical.status === 'Normal') {
										classes = 'bg-green-100 text-green-600'
									} else if (chemical.status === 'Expired') {
										classes = 'bg-red-100 text-red-600'
									} else {
										// Low Amount / Expiring Soon
										classes = 'bg-yellow-100 text-yellow-600'
									}

									return (
										<tr key={chemical._id}>
											<td className='px-6 py-4'>
												{'Lab ' + chemical.lab.labName}
											</td>
											<td className='px-6 py-4'>{chemical.CAS}</td>
											<td className='px-6 py-4'>
												{FormatAmountWithUnit(chemical.amount, chemical.unit)}
											</td>
											<td className='px-6 py-4'>
												<span
													className={`inline-flex rounded-full px-3 py-1 font-medium ${classes}`}
												>
													{chemical.status}
												</span>
											</td>
											<td className='px-6 py-4'>
												{FormatChemicalDate(chemical.expirationDate)}
											</td>
										</tr>
									)
								})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default ChemicalsSection
