import React from 'react'
import FormatBytes from '../../utils/FormatBytes'

const RenderImage = ({ image, setImage }) => {
  return (
    <div className='mb-6 flex items-center'>
      <img
        className='mr-4 h-32 w-32 rounded-full object-cover'
        src={URL.createObjectURL(image)}
        alt='Avatar'
        width='200'
        height='200'
      />

      <div className='overflow-auto'>
        <p className='max-w-full overflow-hidden text-ellipsis text-sm font-medium'>
          {image.name}
        </p>

        <p className='text-xs'>{FormatBytes(image.size)}</p>

        <button
          className='button button-outline mt-4 px-3 py-2 text-xs font-semibold'
          onClick={() => setImage('')}
        >
          Change Image
        </button>
      </div>
    </div>
  )
}

export default RenderImage
