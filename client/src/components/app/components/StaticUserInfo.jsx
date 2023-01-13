import React, { useState } from 'react'
import GetLetterPicture from '../../utils/GetLetterPicture'
import ImageLightBox from '../../utils/ImageLightBox'
import FILE_PATH from '../../../config/file_path'

const StaticUserInfo = ({ user }) => {
  const name = user.name
  const imageSrc = user.avatar
    ? FILE_PATH.avatars + user.avatar
    : GetLetterPicture(name)
  const avatarInfo = { name, imageSrc }

  const [openViewImageModal, setOpenViewImageModal] = useState(false)

  return (
    <>
      <div className='mb-6 flex items-center space-x-6 border-b border-gray-200 pb-6'>
        <img
          onError={(event) => (event.target.src = GetLetterPicture(name))}
          src={imageSrc}
          alt='Avatar'
          className='h-36 w-36 cursor-pointer object-cover'
          height='200'
          width='200'
          draggable={false}
          onClick={() => setOpenViewImageModal(true)}
        />

        <div className='flex-1 space-y-6'>
          <div className='flex space-x-6'>
            <div className='flex-1'>
              <label htmlFor='name' className='mb-1'>
                Full Name <span className='text-xs'>(as per IC/Passport)</span>
              </label>
              {user.name}
            </div>

            <div className='flex-1'>
              <label htmlFor='matricNo' className='mb-1'>
                Matric/Staff Number
              </label>
              {user.matricNo}
            </div>
          </div>

          <div className='flex space-x-6'>
            <div className='flex-1'>
              <label htmlFor='email' className='mb-1 flex items-baseline'>
                Email Address
                <span
                  className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                    user.isEmailVerified
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </label>
              {user.email}
            </div>

            <div className='flex-1'>
              <label htmlFor='altEmail' className='mb-1'>
                Alternative Email Address
              </label>
              {user.altEmail || '-'}
            </div>
          </div>
        </div>
      </div>

      {openViewImageModal && avatarInfo && (
        <ImageLightBox
          object={avatarInfo}
          type='Avatar'
          openModal={openViewImageModal}
          setOpenModal={setOpenViewImageModal}
        />
      )}
    </>
  )
}

export default StaticUserInfo
