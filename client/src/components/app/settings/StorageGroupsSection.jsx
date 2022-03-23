import React from 'react'
import STORAGE_GROUPS from '../../../config/storage_groups'

const tableHeaders = ['Code', 'Description']

const StorageGroupsSection = () => {
	return (
		<div className='mb-6 w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm'>
			<div className='overflow-x-auto'>
				<div className='border-b border-gray-200'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='sticky top-0 bg-gray-50'>
							<tr>
								{tableHeaders.map((title, index) => (
									<th
										scope='col'
										key={index}
										className={`px-6 py-4 font-medium text-gray-500 ${
											index === 0 ? 'text-center' : 'text-left'
										}`}
									>
										{title}
									</th>
								))}
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200 bg-white'>
							{STORAGE_GROUPS.map((group, index) => (
								<tr key={index}>
									<td className='px-6 py-4 text-center'>{group.code}</td>
									<td className='px-6 py-4'>{group.description}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default StorageGroupsSection
