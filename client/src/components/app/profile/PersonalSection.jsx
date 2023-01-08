import React, { useState } from 'react'
import GetLetterPicture from '../../utils/GetLetterPicture'
import UpdateAvatarModal from './UpdateAvatarModal'
import EditPersonalInfoModal from './EditPersonalInfoModal'
import FILE_PATH from '../../../config/file_path'

const TabLabels = ['Profile Picture', 'Personal Info']

const PersonalSection = ({ user, setRefresh }) => {
  const [activeTab, setActiveTab] = useState('Tab0')
  const imageSrc = user.avatar
    ? FILE_PATH.avatars + user.avatar
    : GetLetterPicture(user.name)
  const [openUpdateAvatarModal, setOpenUpdateAvatarModal] = useState(false)
  const [openEditPersonalInfoModal, setOpenEditPersonalInfoModal] =
    useState(false)

  return (
    <>
      <div className='mb-6 border-b border-gray-200 text-sm font-medium text-gray-500'>
        <ul className='-mb-px flex flex-wrap space-x-6'>
          {TabLabels.map((label, index) => (
            <li
              key={index}
              className={`inline-block border-b-2 pb-3 ${
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

      {activeTab === 'Tab0' && (
        <div className='relative inline-block'>
          <img
            className='h-80 w-80 object-cover'
            onError={(event) =>
              (event.target.src = GetLetterPicture(user.name))
            }
            src={imageSrc}
            alt='Avatar'
            width='500'
            height='500'
          />

          <button
            className='button button-outline absolute top-0 right-0 m-3 px-3 py-2 text-xs font-semibold'
            onClick={() => setOpenUpdateAvatarModal(true)}
          >
            Change
          </button>
        </div>
      )}

      {activeTab === 'Tab1' && (
        <>
          <label htmlFor='matricNo'>Matric/Staff Number</label>
          <input
            className='mb-6 w-full max-w-lg'
            type='text'
            name='matricNo'
            id='matricNo'
            readOnly
            value={user.matricNo}
          />

          <label htmlFor='name'>
            Full Name <span className='text-xs'>(as per IC/Passport)</span>
          </label>
          <input
            className='mb-6 w-full max-w-lg'
            type='text'
            name='name'
            id='name'
            readOnly
            value={user.name}
          />

          <label htmlFor='altEmail'>Alternative Email Address</label>
          <input
            className='mb-9 w-full max-w-lg'
            type='text'
            name='altEmail'
            id='altEmail'
            readOnly
            value={user.altEmail || '-'}
          />

          <button
            className='button button-outline block w-60 justify-center px-4 py-3'
            onClick={() => setOpenEditPersonalInfoModal(true)}
          >
            Edit Personal Info
          </button>
        </>
      )}

      {openUpdateAvatarModal && (
        <UpdateAvatarModal
          openModal={openUpdateAvatarModal}
          setOpenModal={setOpenUpdateAvatarModal}
        />
      )}

      {openEditPersonalInfoModal && (
        <EditPersonalInfoModal
          user={user}
          openModal={openEditPersonalInfoModal}
          setOpenModal={setOpenEditPersonalInfoModal}
          setEditPersonalInfoSuccess={setRefresh}
        />
      )}
    </>
  )
}

export default PersonalSection
