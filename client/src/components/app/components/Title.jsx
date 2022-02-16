import React from 'react'
import { PlusIcon } from '@heroicons/react/outline'

const Title = (props) => {
	return (
		<div className='mb-6 flex items-end justify-between'>
			<h2 className='flex h-12 items-end'>{props.title}</h2>
			{props.hasButton && (
				<button onClick={props.buttonAction} className='button'>
					<PlusIcon className='-ml-1 mr-1.5 h-4 w-4 stroke-2' />
					{props.buttonText}
				</button>
			)}
		</div>
	)
}

export default Title
