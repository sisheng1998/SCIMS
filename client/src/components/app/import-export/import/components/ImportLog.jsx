import React, { useState } from 'react'
import LogTable from './LogTable'

const ImportLog = ({ results }) => {
	const [activeTab, setActiveTab] = useState('Tab0')

	const TabLabels = [
		`Newly Added (${results.new.length})`,
		`Updated (${results.updated.length})`,
		`Failed (${results.failed.length})`,
	]

	return (
		<>
			<div className='mb-5 grid grid-cols-5 gap-4'>
				<div className='col-span-2'>
					<label htmlFor='filename' className='mb-0.5 text-gray-500'>
						CSV File Name
					</label>
					<p className='truncate font-medium'>{results.filename}</p>
				</div>

				<div>
					<label htmlFor='new' className='mb-0.5 text-gray-500'>
						Newly Added
					</label>
					<p className='font-medium'>
						{results.new.length} Chemical{results.new.length > 1 ? 's' : ''}
					</p>
				</div>

				<div>
					<label htmlFor='updated' className='mb-0.5 text-gray-500'>
						Updated
					</label>
					<p className='font-medium'>
						{results.updated.length} Chemical
						{results.updated.length > 1 ? 's' : ''}
					</p>
				</div>

				<div>
					<label htmlFor='failed' className='mb-0.5 text-gray-500'>
						Failed
					</label>
					<p className='font-medium'>
						{results.failed.length} Chemical
						{results.failed.length > 1 ? 's' : ''}
					</p>
				</div>
			</div>

			<label htmlFor='log' className='mb-1 text-gray-500'>
				Import Log
			</label>
			<div className='mb-3 font-medium text-gray-500'>
				<ul className='flex flex-wrap space-x-6'>
					{TabLabels.map((label, index) => (
						<li
							key={index}
							className={`inline-block border-b-2 pb-2 ${
								activeTab === 'Tab' + index
									? 'pointer-events-none border-indigo-600 font-semibold text-indigo-600'
									: 'cursor-pointer border-transparent hover:border-gray-300 hover:text-gray-700'
							}`}
							onClick={() => setActiveTab('Tab' + index)}
						>
							{label}
						</li>
					))}
				</ul>
			</div>

			{activeTab === 'Tab0' && <LogTable data={results.new} type='new' />}
			{activeTab === 'Tab1' && (
				<LogTable data={results.updated} type='updated' />
			)}
			{activeTab === 'Tab2' && <LogTable data={results.failed} type='failed' />}
		</>
	)
}

export default ImportLog
