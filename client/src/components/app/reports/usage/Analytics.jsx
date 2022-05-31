import React, { useState } from 'react'
import BarChart from './BarChart'

const TabLabels = [
	'Users / No. of Records',
	'Chemicals (Name) / Usages',
	'Chemicals (CAS No.) / Usages',
]
const UnitTabLabels = ['kg', 'g', 'mg', 'L', 'mL']

const Analytics = ({ data, chemicals, users }) => {
	const [activeTab, setActiveTab] = useState('Tab0')
	const [activeUnitTab, setActiveUnitTab] = useState(0)
	const [indexAxis, setIndexAxis] = useState('x')

	return (
		<div className='mb-6 grid grid-cols-5 gap-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
			{data.length === 0 ? (
				<p className='p-2 text-center'>No record found.</p>
			) : (
				<>
					<div className='space-y-2 border-r border-r-gray-200 p-2 pr-0 text-sm font-medium text-gray-400'>
						<ul>
							{TabLabels.map((label, index) => (
								<li
									key={index}
									className={`-mr-px border-r-2 py-1 ${
										activeTab === 'Tab' + index
											? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
											: 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-500'
									}`}
									onClick={() => setActiveTab('Tab' + index)}
								>
									{label}
								</li>
							))}
						</ul>
					</div>

					<div className='col-span-4'>
						<div className='mb-4 flex items-start justify-between space-x-6'>
							<h4 className='pt-2 text-gray-700'>
								{activeTab === 'Tab0' && TabLabels[0]}
								{activeTab === 'Tab1' &&
									`${TabLabels[1]} (in
								${UnitTabLabels[activeUnitTab]})`}
								{activeTab === 'Tab2' &&
									`${TabLabels[2]} (in
								${UnitTabLabels[activeUnitTab]})`}
								<span className='ml-1.5 text-base text-gray-500'>- Top 10</span>
							</h4>

							{indexAxis === 'x' ? (
								<button
									className='button button-outline px-4 py-1 font-medium'
									onClick={() => setIndexAxis('y')}
								>
									Horizontal
								</button>
							) : (
								<button
									className='button button-outline px-4 py-1 font-medium'
									onClick={() => setIndexAxis('x')}
								>
									Vertical
								</button>
							)}
						</div>

						{activeTab !== 'Tab0' && (
							<div className='mr-3 border-b border-gray-200 text-sm font-medium text-gray-400'>
								<ul className='-mb-px flex flex-wrap space-x-6'>
									{UnitTabLabels.map((label, index) => (
										<li
											key={index}
											className={`inline-block border-b-2 pb-3 ${
												activeUnitTab === index
													? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
													: 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-500'
											}`}
											onClick={() => setActiveUnitTab(index)}
										>
											{label}
										</li>
									))}
								</ul>
							</div>
						)}

						{activeTab === 'Tab0' && (
							<BarChart
								info={data}
								users={users}
								type='Users/Records'
								indexAxis={indexAxis}
							/>
						)}

						{activeTab === 'Tab1' && (
							<BarChart
								info={data}
								chemicals={chemicals}
								type='Name'
								unit={UnitTabLabels[activeUnitTab]}
								indexAxis={indexAxis}
							/>
						)}

						{activeTab === 'Tab2' && (
							<BarChart
								info={data}
								chemicals={chemicals}
								type='CASNo'
								unit={UnitTabLabels[activeUnitTab]}
								indexAxis={indexAxis}
							/>
						)}
					</div>
				</>
			)}
		</div>
	)
}

export default Analytics
