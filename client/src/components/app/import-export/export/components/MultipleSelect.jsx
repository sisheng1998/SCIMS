import React, { Fragment } from 'react'
import { Listbox } from '@headlessui/react'
import { SelectorIcon, XIcon, CheckIcon } from '@heroicons/react/outline'
import { COLUMNS, STATUS } from '../../../../../config/import_export'

const MultipleSelect = ({ type, selected, setSelected }) => {
	const isColumns = type === 'Columns'
	const dataset = isColumns ? COLUMNS : STATUS

	const isSelected = (value) =>
		selected.some((selection) => selection.value === value)

	const selectHandler = (selection) =>
		!isSelected(selection.value)
			? setSelected((prev) =>
					dataset.filter((data) => [...prev, selection].includes(data))
			  )
			: deselectHandler(selection.value)

	const deselectHandler = (value) =>
		setSelected(selected.filter((selection) => selection.value !== value))

	return (
		<Listbox
			as='div'
			className='relative'
			value={selected}
			onChange={(selection) => selectHandler(selection)}
		>
			<Listbox.Button className='flex w-full justify-between rounded-lg border border-gray-300 p-2 text-left shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'>
				{selected.length === 0 ? (
					<span className='my-0.5 ml-1 text-gray-400'>
						{isColumns ? 'Export all columns' : 'Export all status'}
					</span>
				) : (
					<span className='-mb-1.5'>
						{dataset
							.filter((data) => isSelected(data.value))
							.map((data, index) => (
								<span
									key={index}
									className='mr-1.5 mb-1.5 inline-flex items-center rounded-full bg-indigo-100 py-1 pl-3 pr-2 text-sm font-medium text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700'
									onClick={(e) => {
										e.stopPropagation()
										deselectHandler(data.value)
									}}
								>
									{data.label}
									<XIcon className='ml-1.5 h-3.5 w-3.5 stroke-2 text-red-600' />
								</span>
							))}
					</span>
				)}
				<SelectorIcon className='my-0.5 h-6 w-6 shrink-0 text-gray-500' />
			</Listbox.Button>

			<Listbox.Options className='absolute top-full z-[1] mt-1 max-h-80 w-full overflow-auto rounded-lg border border-gray-300 bg-white py-1 shadow-lg focus:outline-none'>
				{dataset.map((data, index) => (
					<Listbox.Option key={index} value={data} as={Fragment}>
						{() => (
							<li
								className={`flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600 ${
									isSelected(data.value) ? 'font-semibold text-indigo-600' : ''
								}`}
							>
								{data.label}
								{isSelected(data.value) && (
									<CheckIcon className='ml-2 h-4 w-4 stroke-2' />
								)}
							</li>
						)}
					</Listbox.Option>
				))}
			</Listbox.Options>
		</Listbox>
	)
}

export default MultipleSelect
