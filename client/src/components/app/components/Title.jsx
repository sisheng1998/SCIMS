import React from 'react'
import { PlusIcon, RefreshIcon } from '@heroicons/react/outline'

const Title = (props) => {
	return (
		<div className='mb-5 flex items-center justify-between'>
			<h3 className='flex h-10 items-end'>{props.title}</h3>
			<div className='flex items-center'>
				{props.hasButton && (
					<button
						onClick={props.buttonAction}
						className='button button-outline'
					>
						<PlusIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
						{props.buttonText}
					</button>
				)}
				{props.hasRefreshButton && (
					<button
						onClick={() => props.setRefresh(true)}
						className='button button-outline ml-4'
					>
						<RefreshIcon className='-ml-0.5 mr-1 h-3.5 w-3.5 stroke-2' />
						Refresh
					</button>
				)}
			</div>
			{props.children}
		</div>
	)
}

export default Title
